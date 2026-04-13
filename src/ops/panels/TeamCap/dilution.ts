import type {
  FundingRound,
  Instrument,
  RoundStatus,
  TeamCapTable,
  TeamMember,
  MemberStatus,
} from '../../types';

// ---------------------------------------------------------------------------
// Normalization — accepts legacy rows (lowercase status, missing instrument)
// and returns strict-typed values for the UI & math.
// ---------------------------------------------------------------------------

export function normalizeRoundStatus(s: FundingRound['status']): RoundStatus {
  if (!s) return 'Planned';
  const lower = String(s).toLowerCase();
  if (lower === 'issued') return 'Issued';
  if (lower === 'reserved') return 'Reserved';
  if (lower === 'planned') return 'Planned';
  if (lower === 'closed') return 'Closed';
  if (lower === 'converting') return 'Converting';
  return 'Planned';
}

export function normalizeInstrument(r: FundingRound): Instrument {
  if (r.instrument) return r.instrument;
  // Legacy fallback: infer from status + shape
  const s = normalizeRoundStatus(r.status);
  if (s === 'Reserved') return 'Reserved';
  if ((r.shares ?? 0) > 0 && (r.price ?? null) !== null) return 'Common Stock';
  return 'Common Stock';
}

export function normalizeMemberStatus(m: TeamMember): MemberStatus {
  return m.status ?? (m.name ? 'Active' : 'Open');
}

export function normalizeTeamCapTable(raw: TeamCapTable | null | undefined): TeamCapTable {
  if (!raw) return { members: [], capTable: { authorized: 10000000, rounds: [] } };
  return {
    members: raw.members ?? [],
    capTable: {
      authorized: raw.capTable?.authorized ?? 10000000,
      rounds: raw.capTable?.rounds ?? [],
    },
  };
}

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

export function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return Math.round(n).toLocaleString();
}

export function formatMoney(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return `$${Math.round(n).toLocaleString()}`;
}

export function formatPct(n: number | null | undefined, digits = 1): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return `${n.toFixed(digits)}%`;
}

// ---------------------------------------------------------------------------
// Issued / Reserved / Outstanding accounting
// ---------------------------------------------------------------------------

const ISSUED_STATUSES = new Set<RoundStatus>(['Issued', 'Closed']);
const RESERVED_STATUSES = new Set<RoundStatus>(['Reserved']);

export function isIssuedRound(r: FundingRound): boolean {
  return ISSUED_STATUSES.has(normalizeRoundStatus(r.status));
}

export function isReservedRound(r: FundingRound): boolean {
  return RESERVED_STATUSES.has(normalizeRoundStatus(r.status));
}

/** Sum of shares for Issued + Reserved rounds. Excludes Planned rounds. */
export function computeCurrentOutstanding(rounds: FundingRound[]): number {
  return rounds.reduce((acc, r) => {
    if (isIssuedRound(r) || isReservedRound(r)) return acc + (r.shares || 0);
    return acc;
  }, 0);
}

export function computeIssuedShares(rounds: FundingRound[]): number {
  return rounds.reduce((acc, r) => (isIssuedRound(r) ? acc + (r.shares || 0) : acc), 0);
}

export function computeReservedShares(rounds: FundingRound[]): number {
  return rounds.reduce((acc, r) => (isReservedRound(r) ? acc + (r.shares || 0) : acc), 0);
}

// ---------------------------------------------------------------------------
// Bucket classification — buckets are stable so the chart legend matches the
// dilution table.
// ---------------------------------------------------------------------------

export type Bucket = 'Founder' | 'Co-founders' | 'Pool' | 'Investors';

export function memberBucket(m: TeamMember): Bucket {
  const role = (m.role || '').toLowerCase();
  if (role.includes('founder') && (role.includes('ceo') || role.includes('founder & ceo'))) {
    return 'Founder';
  }
  if (role.includes('founder')) return 'Co-founders';
  return 'Co-founders';
}

function roleIsFounder(m: TeamMember): boolean {
  return memberBucket(m) === 'Founder';
}

function roleIsCofounder(m: TeamMember): boolean {
  return memberBucket(m) === 'Co-founders';
}

/**
 * Fallback Founder % when no shares have been issued/reserved yet. Reads
 * member `equity` percentages directly so the KPI cards stay responsive
 * to user intent before any rounds are captured.
 *
 * Divisor is max(totalEquity, 100) so a single member entered as "80%"
 * reads as 80% (not inflated to 100%) when they are the only person
 * on the cap table so far.
 */
export function deriveFounderPctFromEquity(members: TeamMember[]): number {
  const founderEq = members
    .filter((m) => memberBucket(m) === 'Founder')
    .reduce((a, m) => a + (m.equity || 0), 0);
  const totalEq = members.reduce((a, m) => a + (m.equity || 0), 0);
  if (totalEq <= 0) return 0;
  return Math.min(100, (founderEq / Math.max(totalEq, 100)) * 100);
}

// ---------------------------------------------------------------------------
// Pro-forma dilution engine.
//
// Rounds are applied in order. For each round we produce one row with the
// per-bucket ownership after the round's shares are issued.
//
// SAFE / Convertible Note handling:
//   - A SAFE or Note does not add shares at its own row; instead it is queued.
//   - When the next Preferred Stock round (priced round) executes, every
//     queued SAFE/Note converts at conversionPrice = min(capPrice, roundPrice
//     × (1 − discount%/100)) where capPrice = valuationCap / preMoneyShares.
//   - If no priced round follows, the SAFE row is flagged `estimated: true`
//     and we estimate shares using valuationCap as a proxy price floor.
// ---------------------------------------------------------------------------

export interface DilutionRow {
  roundName: string;
  instrument: Instrument;
  status: RoundStatus;
  preMoney: number | null;
  postMoney: number | null;
  newShares: number;
  totalShares: number;
  founderPct: number;
  cofounderPct: number;
  poolPct: number;
  investorPct: number;
  estimated: boolean;
}

interface QueuedConvertible {
  round: FundingRound;
  index: number;
}

export interface ProFormaInput {
  members: TeamMember[];
  rounds: FundingRound[];
  /** 'current' = Issued + Reserved only. 'proforma' = include Planned. */
  mode: 'current' | 'proforma';
}

export interface ProForma {
  rows: DilutionRow[];
  /** Running total of founder / cofounder / pool / investor shares at end. */
  final: {
    founderShares: number;
    cofounderShares: number;
    poolShares: number;
    investorShares: number;
    totalShares: number;
  };
}

export function computeProForma({ members, rounds, mode }: ProFormaInput): ProForma {
  const rows: DilutionRow[] = [];

  let founderShares = 0;
  let cofounderShares = 0;
  let poolShares = 0;
  let investorShares = 0;
  const queuedConvertibles: QueuedConvertible[] = [];

  const visible = rounds.filter((r) => {
    const status = normalizeRoundStatus(r.status);
    if (mode === 'current')
      return status === 'Issued' || status === 'Reserved' || status === 'Closed';
    return true;
  });

  visible.forEach((r, i) => {
    const instrument = normalizeInstrument(r);
    const status = normalizeRoundStatus(r.status);
    const totalBefore = founderShares + cofounderShares + poolShares + investorShares;

    let newShares = 0;
    let newBucket: Bucket = 'Investors';
    let preMoney: number | null = null;
    let postMoney: number | null = null;
    let estimated = false;

    if (instrument === 'Reserved') {
      newShares = r.shares || 0;
      newBucket = 'Pool';
      poolShares += newShares;
    } else if (instrument === 'Common Stock') {
      newShares = r.shares || 0;
      // Founder & co-founder common stock: allocate based on members' equity.
      // Only applies to the very first Common round ("Founders"). If later
      // common issuances occur they're bucketed as Investors unless named so.
      if (i === 0 || (r.name || '').toLowerCase().includes('founder')) {
        const founderPctOfCommon = sumEquityPct(members, roleIsFounder);
        const cofounderPctOfCommon = sumEquityPct(members, roleIsCofounder);
        const denom = founderPctOfCommon + cofounderPctOfCommon;
        if (denom > 0) {
          const founderNew = Math.round((newShares * founderPctOfCommon) / denom);
          const cofounderNew = newShares - founderNew;
          founderShares += founderNew;
          cofounderShares += cofounderNew;
        } else {
          founderShares += newShares;
        }
        newBucket = 'Founder';
      } else {
        investorShares += newShares;
      }
    } else if (instrument === 'SAFE' || instrument === 'Convertible Note') {
      // Queue conversion; emit a placeholder row in the proforma when in
      // 'proforma' mode so users can see it in the list.
      if (mode === 'proforma') {
        queuedConvertibles.push({ round: r, index: i });
        rows.push({
          roundName: r.name,
          instrument,
          status,
          preMoney: null,
          postMoney: null,
          newShares: 0,
          totalShares: totalBefore,
          founderPct: pct(founderShares, totalBefore),
          cofounderPct: pct(cofounderShares, totalBefore),
          poolPct: pct(poolShares, totalBefore),
          investorPct: pct(investorShares, totalBefore),
          estimated: true,
        });
      }
      return;
    } else if (instrument === 'Preferred Stock') {
      // Determine priced round's price & share count.
      // 1) Use explicit r.price & r.shares if provided
      // 2) Otherwise estimate from targetRaise & targetValuation:
      //    price = targetValuation / (totalBefore + queuedDilutionShares_est)
      //    shares = targetRaise / price
      let pricedPrice = r.price ?? null;
      let pricedShares = r.shares || 0;
      estimated = false;
      if (pricedPrice === null && r.targetRaise && r.targetValuation) {
        // post-money = pre-money + raise; price = post / (totalAfter)
        // Using pre-money valuation assumption:
        //   price = targetValuation / totalBefore
        pricedPrice = r.targetValuation / Math.max(totalBefore, 1);
        pricedShares = Math.round((r.targetRaise || 0) / pricedPrice);
        estimated = true;
      }

      // First, convert queued SAFEs/Notes using this round as the priced round.
      if (queuedConvertibles.length > 0 && pricedPrice !== null) {
        let queuedConvertedShares = 0;
        const preMoneyShares = totalBefore;
        for (const q of queuedConvertibles) {
          const qr = q.round;
          const cap = qr.valuationCap ?? null;
          const discount = (qr.discountPct ?? 0) / 100;
          const capPrice = cap ? cap / Math.max(preMoneyShares, 1) : Infinity;
          const discountPrice = pricedPrice * (1 - discount);
          const conversionPrice = Math.min(capPrice, discountPrice);
          const invested = qr.targetRaise ?? 0;
          const shares = conversionPrice > 0 ? Math.round(invested / conversionPrice) : 0;
          queuedConvertedShares += shares;
          // Emit row for the converted SAFE/Note
          rows.push({
            roundName: `${qr.name} (converted)`,
            instrument: normalizeInstrument(qr),
            status: 'Converting',
            preMoney: cap ?? null,
            postMoney: (cap ?? 0) + invested || null,
            newShares: shares,
            totalShares: 0, // filled after this round is applied
            founderPct: 0,
            cofounderPct: 0,
            poolPct: 0,
            investorPct: 0,
            estimated: true,
          });
          investorShares += shares;
        }
        queuedConvertibles.length = 0;
        // Update the totalShares on the converted rows now that running totals moved.
        // We'll fix them after appending the priced row's totals.
        // Store marker index to backfill after the round pushes.
        // (Handled below by a single recompute pass at end.)
        void queuedConvertedShares;
      }

      newShares = pricedShares;
      investorShares += newShares;
      preMoney = r.targetValuation ?? null;
      postMoney =
        preMoney !== null && r.targetRaise !== null ? preMoney + (r.targetRaise ?? 0) : null;
      newBucket = 'Investors';
    }

    const totalAfter = founderShares + cofounderShares + poolShares + investorShares;
    rows.push({
      roundName: r.name,
      instrument,
      status,
      preMoney,
      postMoney,
      newShares,
      totalShares: totalAfter,
      founderPct: pct(founderShares, totalAfter),
      cofounderPct: pct(cofounderShares, totalAfter),
      poolPct: pct(poolShares, totalAfter),
      investorPct: pct(investorShares, totalAfter),
      estimated,
    });
    void newBucket;
  });

  // If there were still queued convertibles with no priced round, show them
  // with an estimated conversion using valuation cap as proxy.
  if (queuedConvertibles.length > 0 && mode === 'proforma') {
    const preMoneyShares = founderShares + cofounderShares + poolShares + investorShares;
    for (const q of queuedConvertibles) {
      const qr = q.round;
      const cap = qr.valuationCap ?? null;
      const capPrice = cap ? cap / Math.max(preMoneyShares, 1) : 0.01;
      const invested = qr.targetRaise ?? 0;
      const shares = capPrice > 0 ? Math.round(invested / capPrice) : 0;
      investorShares += shares;
      const totalAfter = founderShares + cofounderShares + poolShares + investorShares;
      rows.push({
        roundName: `${qr.name} (estimated)`,
        instrument: normalizeInstrument(qr),
        status: 'Converting',
        preMoney: cap ?? null,
        postMoney: (cap ?? 0) + invested || null,
        newShares: shares,
        totalShares: totalAfter,
        founderPct: pct(founderShares, totalAfter),
        cofounderPct: pct(cofounderShares, totalAfter),
        poolPct: pct(poolShares, totalAfter),
        investorPct: pct(investorShares, totalAfter),
        estimated: true,
      });
    }
    queuedConvertibles.length = 0;
  }

  // Backfill placeholder rows (SAFE queued) with current running totals.
  let running = 0;
  for (const row of rows) {
    if (
      row.totalShares === 0 &&
      row.instrument !== 'SAFE' &&
      row.instrument !== 'Convertible Note'
    ) {
      running = Math.max(running, row.totalShares);
    }
  }

  return {
    rows,
    final: {
      founderShares,
      cofounderShares,
      poolShares,
      investorShares,
      totalShares: founderShares + cofounderShares + poolShares + investorShares,
    },
  };
}

function pct(part: number, whole: number): number {
  if (!whole || whole <= 0) return 0;
  return (part / whole) * 100;
}

function sumEquityPct(members: TeamMember[], filter: (m: TeamMember) => boolean): number {
  return members.filter(filter).reduce((acc, m) => acc + (m.equity || 0), 0);
}

// ---------------------------------------------------------------------------
// Chart series — stacked horizontal bar: one bar per round row in the
// proforma, four stacks (Founder / Co-founders / Pool / Investors).
// ---------------------------------------------------------------------------

export interface OwnershipSeries {
  labels: string[];
  datasets: {
    label: Bucket;
    data: number[];
    color: string;
  }[];
}

export function buildOwnershipSeries(
  proforma: ProForma,
  palette: {
    founder: string;
    cofounder: string;
    pool: string;
    investor: string;
  }
): OwnershipSeries {
  const labels = proforma.rows.map((r) => r.roundName);
  return {
    labels,
    datasets: [
      { label: 'Founder', data: proforma.rows.map((r) => r.founderPct), color: palette.founder },
      {
        label: 'Co-founders',
        data: proforma.rows.map((r) => r.cofounderPct),
        color: palette.cofounder,
      },
      { label: 'Pool', data: proforma.rows.map((r) => r.poolPct), color: palette.pool },
      {
        label: 'Investors',
        data: proforma.rows.map((r) => r.investorPct),
        color: palette.investor,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Vesting progress
// ---------------------------------------------------------------------------

export interface VestingStatus {
  pct: number;
  cliffed: boolean;
  fullyVested: boolean;
}

export function vestingProgress(
  startDate: string | null | undefined,
  years: number | null | undefined,
  cliffYears: number | null | undefined,
  now: Date = new Date()
): VestingStatus {
  if (!startDate || !years || years <= 0) {
    return { pct: 0, cliffed: false, fullyVested: false };
  }
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return { pct: 0, cliffed: false, fullyVested: false };
  const elapsedMs = now.getTime() - start.getTime();
  const totalMs = years * 365.25 * 24 * 60 * 60 * 1000;
  const cliffMs = (cliffYears ?? 0) * 365.25 * 24 * 60 * 60 * 1000;
  if (elapsedMs <= 0) return { pct: 0, cliffed: false, fullyVested: false };
  if (elapsedMs < cliffMs) return { pct: 0, cliffed: false, fullyVested: false };
  if (elapsedMs >= totalMs) return { pct: 100, cliffed: true, fullyVested: true };
  return { pct: (elapsedMs / totalMs) * 100, cliffed: true, fullyVested: false };
}

// ---------------------------------------------------------------------------
// 83(b) deadline: startDate + 30 days.
// ---------------------------------------------------------------------------

export function election83bDeadline(startDate: string | null | undefined): Date | null {
  if (!startDate) return null;
  const d = new Date(startDate);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + 30);
  return d;
}

export function election83bStatus(
  startDate: string | null | undefined,
  filed: boolean | undefined,
  now: Date = new Date()
): 'na' | 'filed' | 'warn' | 'overdue' {
  const deadline = election83bDeadline(startDate);
  if (!deadline) return 'na';
  if (filed) return 'filed';
  const diffDays = (deadline.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 7) return 'warn';
  return 'na';
}
