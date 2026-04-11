// Pipeline stages for CRM
export type PipelineStage =
  | 'Prospect'
  | 'Aware'
  | 'Onboarding'
  | 'Installing'
  | 'Engaged'
  | 'Retention'
  | 'Re-Engage';

export const PIPELINE_STAGES: PipelineStage[] = [
  'Prospect',
  'Aware',
  'Onboarding',
  'Installing',
  'Engaged',
  'Retention',
  'Re-Engage',
];

// needs-action-today.json
export interface ActionItem {
  title: string;
  priority: 'high' | 'medium' | 'low';
  account: string;
  notes: string;
}

// todays-agenda.json
export interface AgendaItem {
  time: string;
  title: string;
  duration: number;
  type: string;
  notes: string;
}

// top-accounts.json
export interface TopAccount {
  rank: number;
  name: string;
  health: string;
  revenue: number | null;
  lastContact: string;
  nextAction: string;
}

// open-loops.json
export interface OpenLoop {
  title: string;
  priority: 'high' | 'medium' | 'low';
  age: number;
  nextStep: string;
}

// active-initiatives.json
export interface Milestone {
  name: string;
  status: 'done' | 'in-progress' | 'pending';
}

export interface Initiative {
  name: string;
  description: string;
  status: 'in-progress' | 'pending' | 'completed';
  target: string;
  progress: number;
  milestones: Milestone[];
}

// customers.json
export interface Customer {
  name: string;
  contact: string;
  type: string;
  stage: PipelineStage;
  dealValue: number;
  lastContact: string;
  notes: string;
}

// pipeline-snapshot.json
export interface PipelineStageData {
  name: string;
  count: number;
  value: number;
  weight: number;
}

export interface PipelineDeal {
  name: string;
  stage: string;
  value: number;
  probability: number;
  expectedClose: string;
  owner: string;
}

export interface PipelineSnapshot {
  asOf: string;
  summary: {
    totalPipeline: number;
    weightedPipeline: number;
    closedWonYTD: number;
    closedLostYTD: number;
    winRate: number;
    avgDealSize: number;
    avgCycleLength: number;
  };
  stages: PipelineStageData[];
  deals: PipelineDeal[];
}

// dealer-health.json
export interface DealerHealthEntry {
  name: string;
  score: number;
  trend: 'up' | 'down' | 'flat';
  lastOrder: string;
  issues: string[];
}

export interface DealerHealth {
  asOf: string;
  dealers: DealerHealthEntry[];
}

// dealer-calls.json
export interface DealerCall {
  day: string;
  time: string;
  dealer: string;
  status: string;
  notes: string;
}

export interface DealerCalls {
  week: string;
  calls: DealerCall[];
}

// spa-alerts.json
export interface SpaAlert {
  dealer: string;
  spa: string;
  expiresOn: string;
  severity: 'high' | 'medium' | 'low';
  action: string;
}

// forecast.json
export interface QuarterForecast {
  target: number;
  committed: number;
  bestCase: number;
  pipeline: number;
  weighted: number;
  gap: number;
  deals: ForecastDeal[];
}

export interface ForecastDeal {
  name: string;
  value: number;
  probability: number;
  category: string;
}

export interface Forecast {
  currentQuarter: string;
  nextQuarter: string;
  forecast: Record<string, QuarterForecast>;
}

// products-pricing.json
export interface Product {
  name: string;
  sku: string;
  category: string;
  description: string;
  cost: number;
  listPrice: number;
  dealerPrice: number | null;
  margin: number;
  status: string;
  billing: string | null;
}

export interface ProductsPricing {
  products: Product[];
  recentChanges: { date: string; change: string }[];
}

// competitive-intel.json
export interface Competitor {
  name: string;
  threat: 'high' | 'medium' | 'low';
  strengths: string[];
  weaknesses: string[];
  recentMoves: string[];
  ourResponse: string;
}

export interface BattleCard {
  scenario: string;
  response: string;
}

export interface CompetitiveIntel {
  lastUpdated: string;
  competitors: Competitor[];
  battleCards: BattleCard[];
}

// stale-items.json
export interface StaleItem {
  title: string;
  age: number;
  lastUpdate: string;
  suggestedAction: string;
}

// territory-map.json
export interface TerritoryDealer {
  name: string;
  location: string;
  type: string;
  status: string;
}

export interface TerritoryMap {
  territory: {
    name: string;
    description: string;
  };
  dealers: TerritoryDealer[];
}

// events-programs.json
export interface EventEntry {
  name: string;
  date: string;
  location: string;
  booth: boolean;
  budget: number;
  expectedLeads: number;
  status: string;
  notes: string;
}

export interface Program {
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  tiers: { threshold: string; rebate: string }[];
  notes: string;
}

export interface EventsPrograms {
  currentQuarter: string;
  nextQuarter: string;
  events: EventEntry[];
  programs: Program[];
}

// team-cap-table.json
export interface TeamMember {
  name: string;
  role: string;
  equity: number;
  startDate: string;
  vesting: string;
}

export interface FundingRound {
  name: string;
  shares: number;
  price: number | null;
  status: 'issued' | 'reserved' | 'planned';
  targetRaise: number | null;
  targetValuation: number | null;
  targetShares: number | null;
}

export interface TeamCapTable {
  members: TeamMember[];
  capTable: {
    authorized: number;
    rounds: FundingRound[];
  };
}
