/**
 * Credit lifecycle service types — /v2/credits/* endpoints.
 * Submit, approve, reject, list, purchase, retire, portfolio.
 */

import type { Timestamped, GeoLocation } from './common';
import type { NutrientType, VerificationLevel } from './market';

// ── Credit Status ─────────────────────────────────────────

export type CreditStatus =
  | 'pending-review'   // Submitted by non-BS seller, awaiting admin
  | 'approved'         // Admin approved, ready to mint
  | 'minted'           // On-chain, not yet listed
  | 'listed'           // Active marketplace listing
  | 'sold'             // Purchased by buyer
  | 'retired'          // Burned on-chain
  | 'rejected';        // Admin rejected with reason

// ── Credit ────────────────────────────────────────────────

export interface Credit extends Timestamped {
  id: string;
  nutrientType: NutrientType;
  quantity: number;          // kg removed
  status: CreditStatus;
  verificationLevel: VerificationLevel;
  region: string;
  watershed?: string;
  vintage: string;
  programId: string;
  /** Owner — userId or wallet address */
  ownerId: string;
  /** Source device (if sensor-verified) */
  deviceId?: string;
  /** On-chain data */
  tokenId?: string;          // ERC-1155 token ID
  contractAddress?: string;
  transactionHash?: string;
  blockNumber?: number;
  /** Rejection data */
  rejectionReason?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  /** Retirement data */
  retirementReason?: string;
  retiredAt?: string;
  retirementTxHash?: string;
  /** Location of the improvement project */
  location?: GeoLocation;
}

// ── Credit Lineage ────────────────────────────────────────

export type LineageEventType =
  | 'generated'
  | 'submitted'
  | 'verified'
  | 'minted'
  | 'listed'
  | 'purchased'
  | 'transferred'
  | 'retired';

export interface LineageEvent {
  type: LineageEventType;
  timestamp: string;
  actor?: string;
  txHash?: string;
  metadata?: Record<string, string>;
}

export interface CreditLineage {
  creditId: string;
  events: LineageEvent[];
}

// ── Submit Credit (/v2/credits/submit) ────────────────────

export interface CreditSubmission {
  nutrientType: NutrientType;
  quantity: number;
  region: string;
  watershed?: string;
  vintage: string;
  programId: string;
  /** Organization/project info */
  organizationName: string;
  organizationType: string;
  projectDescription: string;
  improvementType: string;
  location: GeoLocation;
  /** Evidence uploads (file URLs after upload) */
  evidence: EvidenceFile[];
}

export interface EvidenceFile {
  url: string;
  type: 'lab-report' | 'monitoring-data' | 'verification-letter' | 'photo' | 'other';
  name: string;
  uploadedAt: string;
}

// ── Approve / Reject ──────────────────────────────────────

export interface CreditApprovalRequest {
  creditId: string;
  adminNotes?: string;
}

export interface CreditRejectionRequest {
  creditId: string;
  reason: string;
  adminNotes?: string;
}

// ── List Credit (/v2/credits/list) ────────────────────────

export interface CreateListingRequest {
  creditId: string;
  pricePerCredit: number;
  description?: string;
  expiresAt?: string;
}

// ── Purchase (/v2/credits/purchase) ───────────────────────

export type PaymentMethod = 'stripe' | 'wallet';

export interface PurchaseRequest {
  listingId: string;
  quantity: number;
  paymentMethod: PaymentMethod;
  /** For wallet payments */
  walletAddress?: string;
  /** Stripe payment intent (created client-side) */
  stripePaymentIntentId?: string;
}

export interface PurchaseResult {
  purchaseId: string;
  listingId: string;
  creditId: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  transactionHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: string;
}

// ── Retire (/v2/credits/retire) ───────────────────────────

export interface RetireRequest {
  creditId: string;
  reason: string;
  /** Optional beneficiary (for offset claims) */
  beneficiary?: string;
}

export interface RetireResult {
  creditId: string;
  transactionHash: string;
  burnBlockNumber: number;
  retiredAt: string;
  impactReport?: ImpactSummary;
}

// ── Portfolio (/v2/credits/portfolio) ─────────────────────

export interface PortfolioHolding {
  creditId: string;
  nutrientType: NutrientType;
  quantity: number;
  currentValue: number;
  region: string;
  vintage: string;
  status: CreditStatus;
  acquiredAt: string;
  listingId?: string;
}

export interface PortfolioTransaction {
  id: string;
  type: 'purchase' | 'sale' | 'retirement';
  creditId: string;
  nutrientType: NutrientType;
  quantity: number;
  price: number;
  counterparty?: string;
  transactionHash?: string | null;
  timestamp: string;
}

/** @deprecated Use PortfolioTransaction instead */
export type TransactionHistory = PortfolioTransaction;

export interface PortfolioSummary {
  activeCredits: number;
  listedCredits: number;
  retiredCredits: number;
  totalPurchases: number;
  totalSales: number;
}

export interface PortfolioResponse {
  userId: string;
  holdings: PortfolioHolding[];
  totalValue: number;
  totalNitrogenRemoved: number;   // kg
  totalPhosphorusRemoved: number; // kg
  summary: PortfolioSummary;
  transactions: PortfolioTransaction[];
}

/** @deprecated Use PortfolioResponse instead */
export type Portfolio = Omit<PortfolioResponse, 'transactions'>;

export interface ImpactSummary {
  totalNitrogenRemoved: number;
  totalPhosphorusRemoved: number;
  creditsRetired: number;
  equivalencies: {
    label: string;
    value: string;
    description: string;
  }[];
}
