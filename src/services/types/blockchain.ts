/**
 * Blockchain service types — /v2/blockchain/* and /v2/wallet/* endpoints.
 * ERC-1155 minting, retirement, certificate verification, wallet linking.
 */

import type { NutrientType } from './market';

// ── Mint (/v2/blockchain/mint) ────────────────────────────

export interface MintRequest {
  creditId: string;
  /** Wallet address to mint to (backend is sole minter, but assigns to owner) */
  recipientAddress: string;
  /** Metadata for the token */
  metadata: TokenMetadata;
}

export interface MintResult {
  tokenId: string;
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  /** Polling endpoint until confirmed */
  status: 'pending' | 'confirmed' | 'failed';
  metadataUri: string;
}

// ── Token Metadata (ERC-1155) ─────────────────────────────

export interface TokenMetadata {
  name: string;
  description: string;
  /** IPFS or Firebase-hosted JSON URI */
  externalUrl: string;
  attributes: TokenAttribute[];
}

export interface TokenAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'number' | 'date' | 'string';
}

// ── Verify (/v2/blockchain/verify/:hash) ──────────────────

export interface VerificationResult {
  valid: boolean;
  certificateId: string;
  creditId: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: string;
  network: 'polygon' | 'polygon-amoy';
  contractAddress: string;
  tokenId: string;
  /** Polygonscan URL */
  explorerUrl: string;
  /** Credit metadata */
  credit: {
    nutrientType: NutrientType;
    quantity: number;
    region: string;
    vintage: string;
    status: 'active' | 'retired';
  };
}

// ── Retire / Burn (/v2/blockchain/retire) ─────────────────

export interface BlockchainRetireRequest {
  tokenId: string;
  reason: string;
  beneficiary?: string;
}

export interface BlockchainRetireResult {
  transactionHash: string;
  blockNumber: number;
  burnedAt: string;
  status: 'pending' | 'confirmed' | 'failed';
}

// ── Certificate (/v2/blockchain/certificate/:id) ──────────

export interface Certificate {
  id: string;
  creditId: string;
  tokenId: string;
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  mintedAt: string;
  network: 'polygon' | 'polygon-amoy';
  explorerUrl: string;
  metadataUri: string;
  /** Full credit details */
  credit: {
    nutrientType: NutrientType;
    quantity: number;
    region: string;
    watershed?: string;
    vintage: string;
    verificationLevel: string;
    status: string;
  };
  /** Owner info */
  owner: {
    address: string;
    displayName?: string;
  };
  /** If retired */
  retirement?: {
    reason: string;
    beneficiary?: string;
    burnTxHash: string;
    retiredAt: string;
  };
  /** QR code data for sharing */
  qrCodeData: string;
}

// ── Wallet (/v2/wallet/*) ─────────────────────────────────

export interface LinkWalletRequest {
  userId: string;
  walletAddress: string;
  /** Signed message proving ownership */
  signature: string;
  /** The message that was signed */
  message: string;
}

export interface LinkWalletResult {
  success: boolean;
  userId: string;
  walletAddress: string;
  linkedAt: string;
}

export interface VerifyWalletRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface VerifyWalletResult {
  valid: boolean;
  walletAddress: string;
  userId?: string;
}

export interface WalletBalance {
  walletAddress: string;
  credits: WalletCreditBalance[];
  totalValue: number;
}

export interface WalletCreditBalance {
  tokenId: string;
  creditId: string;
  nutrientType: NutrientType;
  quantity: number;
  currentValue: number;
}
