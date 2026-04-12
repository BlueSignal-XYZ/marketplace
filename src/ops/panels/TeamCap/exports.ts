import Papa from 'papaparse';
import jsPDF from 'jspdf';
import type { FundingRound, TeamCapTable, TeamMember } from '../../types';
import type { KPIData } from './KPICards';
import {
  computeProForma,
  election83bDeadline,
  formatMoney,
  formatNumber,
  formatPct,
  normalizeInstrument,
  normalizeMemberStatus,
  normalizeRoundStatus,
} from './dilution';

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportTeamCSV(members: TeamMember[]) {
  const rows = members.map((m) => {
    const deadline = election83bDeadline(m.startDate);
    return {
      Name: m.name,
      Role: m.role,
      'Equity %': m.equity,
      Shares: m.shares ?? '',
      'Start Date': m.startDate,
      'Vesting (yrs)': m.vestingYears ?? '',
      'Cliff (yrs)': m.cliffYears ?? '',
      Status: normalizeMemberStatus(m),
      '83(b) Filed': m.filed83b ? 'Yes' : 'No',
      '83(b) Deadline': deadline ? deadline.toISOString().slice(0, 10) : '',
    };
  });
  const csv = Papa.unparse(rows);
  download(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'cap-table-team.csv');
}

export function exportRoundsCSV(rounds: FundingRound[]) {
  const rows = rounds.map((r) => ({
    Round: r.name,
    Instrument: normalizeInstrument(r),
    Status: normalizeRoundStatus(r.status),
    Shares: r.shares ?? '',
    'Price/Share': r.price ?? '',
    'Valuation Cap': r.valuationCap ?? '',
    'Discount %': r.discountPct ?? '',
    'Interest %': r.interestPct ?? '',
    'Maturity Date': r.maturityDate ?? '',
    'Liquidation Pref': r.liquidationPref ?? '',
    Participating: r.participation ? 'Yes' : 'No',
    'Target Raise': r.targetRaise ?? '',
    Valuation: r.targetValuation ?? '',
  }));
  const csv = Papa.unparse(rows);
  download(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'cap-table-rounds.csv');
}

export interface PDFInput {
  data: TeamCapTable;
  kpis: KPIData;
  companyName?: string;
}

/**
 * One-page letter PDF, investor-facing. Uses jsPDF direct draw (no
 * html2canvas) to produce a crisp vector PDF with dark text on white.
 */
export function exportPDF({ data, kpis, companyName = 'BlueSignal' }: PDFInput) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 40;
  let y = 56;

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(20, 23, 31);
  pdf.text(`${companyName} — Cap Table`, margin, y);
  y += 8;
  pdf.setDrawColor(79, 143, 247);
  pdf.setLineWidth(1);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 20;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(90, 93, 110);
  pdf.text(`Generated ${new Date().toISOString().slice(0, 10)}`, margin, y);
  y += 18;

  // KPIs
  pdf.setFontSize(10);
  pdf.setTextColor(20, 23, 31);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Summary', margin, y);
  y += 12;
  pdf.setFont('helvetica', 'normal');

  const kpiRow = [
    ['Authorized', formatNumber(kpis.authorized)],
    ['Issued', formatNumber(kpis.issued)],
    ['Reserved', formatNumber(kpis.reserved)],
    ['Available', formatNumber(kpis.available)],
    ['Founder % (current)', formatPct(kpis.founderPctCurrent)],
    ['Founder % (FD)', formatPct(kpis.founderPctDiluted)],
  ];
  const colWidth = (pageWidth - margin * 2) / 3;
  for (let i = 0; i < kpiRow.length; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = margin + col * colWidth;
    const ry = y + row * 28;
    pdf.setTextColor(90, 93, 110);
    pdf.setFontSize(8);
    pdf.text(kpiRow[i][0].toUpperCase(), x, ry);
    pdf.setTextColor(20, 23, 31);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(kpiRow[i][1], x, ry + 12);
    pdf.setFont('helvetica', 'normal');
  }
  y += 70;

  // Team section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(20, 23, 31);
  pdf.text('Team', margin, y);
  y += 12;
  pdf.setFontSize(8);
  pdf.setTextColor(90, 93, 110);
  pdf.setFont('helvetica', 'bold');
  pdf.text('NAME', margin, y);
  pdf.text('ROLE', margin + 120, y);
  pdf.text('EQUITY', margin + 280, y);
  pdf.text('SHARES', margin + 340, y);
  pdf.text('STATUS', margin + 420, y);
  pdf.setFont('helvetica', 'normal');
  pdf.setDrawColor(220, 222, 230);
  pdf.line(margin, y + 2, pageWidth - margin, y + 2);
  y += 14;
  pdf.setTextColor(20, 23, 31);

  data.members.forEach((m) => {
    if (y > 720) {
      pdf.addPage();
      y = 56;
    }
    const shares = m.shares ?? '';
    pdf.text(truncate(pdf, m.name || '—', 115), margin, y);
    pdf.text(truncate(pdf, m.role || '—', 155), margin + 120, y);
    pdf.text(formatPct(m.equity, 1), margin + 280, y);
    pdf.text(typeof shares === 'number' ? formatNumber(shares) : '—', margin + 340, y);
    pdf.text(normalizeMemberStatus(m), margin + 420, y);
    y += 14;
  });
  y += 8;

  // Rounds section
  if (y > 640) {
    pdf.addPage();
    y = 56;
  }
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('Funding Rounds', margin, y);
  y += 12;
  pdf.setFontSize(8);
  pdf.setTextColor(90, 93, 110);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ROUND', margin, y);
  pdf.text('INSTRUMENT', margin + 110, y);
  pdf.text('STATUS', margin + 210, y);
  pdf.text('SHARES', margin + 280, y);
  pdf.text('RAISE', margin + 360, y);
  pdf.text('VALUATION', margin + 440, y);
  pdf.setFont('helvetica', 'normal');
  pdf.setDrawColor(220, 222, 230);
  pdf.line(margin, y + 2, pageWidth - margin, y + 2);
  y += 14;
  pdf.setTextColor(20, 23, 31);

  data.capTable.rounds.forEach((r) => {
    if (y > 720) {
      pdf.addPage();
      y = 56;
    }
    pdf.text(truncate(pdf, r.name || '—', 105), margin, y);
    pdf.text(normalizeInstrument(r), margin + 110, y);
    pdf.text(normalizeRoundStatus(r.status), margin + 210, y);
    pdf.text(r.shares ? formatNumber(r.shares) : '—', margin + 280, y);
    pdf.text(
      r.targetRaise !== null && r.targetRaise !== undefined ? formatMoney(r.targetRaise) : '—',
      margin + 360,
      y
    );
    const valDisplay = r.targetValuation ?? r.valuationCap;
    pdf.text(
      valDisplay !== null && valDisplay !== undefined
        ? `${formatMoney(valDisplay)}${r.valuationCap ? ' cap' : ''}`
        : '—',
      margin + 440,
      y
    );
    y += 14;
  });
  y += 8;

  // Pro-forma summary
  if (y > 640) {
    pdf.addPage();
    y = 56;
  }
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('Pro-Forma Dilution (estimated)', margin, y);
  y += 12;
  pdf.setFontSize(8);
  pdf.setTextColor(90, 93, 110);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ROUND', margin, y);
  pdf.text('FOUNDER', margin + 180, y);
  pdf.text('CO-FOUND.', margin + 260, y);
  pdf.text('POOL', margin + 340, y);
  pdf.text('INVESTORS', margin + 400, y);
  pdf.setFont('helvetica', 'normal');
  pdf.setDrawColor(220, 222, 230);
  pdf.line(margin, y + 2, pageWidth - margin, y + 2);
  y += 14;
  pdf.setTextColor(20, 23, 31);

  const pf = computeProForma({
    members: data.members,
    rounds: data.capTable.rounds,
    mode: 'proforma',
  });
  pf.rows.forEach((row) => {
    if (y > 720) {
      pdf.addPage();
      y = 56;
    }
    pdf.text(truncate(pdf, row.roundName, 175), margin, y);
    pdf.text(formatPct(row.founderPct), margin + 180, y);
    pdf.text(formatPct(row.cofounderPct), margin + 260, y);
    pdf.text(formatPct(row.poolPct), margin + 340, y);
    pdf.text(formatPct(row.investorPct), margin + 400, y);
    y += 14;
  });

  pdf.save(`${companyName.toLowerCase().replace(/\s+/g, '-')}-cap-table.pdf`);
}

function truncate(pdf: jsPDF, s: string, maxWidth: number): string {
  if (pdf.getTextWidth(s) <= maxWidth) return s;
  let truncated = s;
  while (truncated.length > 0 && pdf.getTextWidth(truncated + '…') > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '…';
}
