/**
 * Wallet connection utilities — MetaMask + ethers.js v6.
 * Handles connect, sign message, and wallet state.
 */

import { BrowserProvider } from 'ethers';

const SIGN_MESSAGE =
  'Sign this message to link your wallet to BlueSignal.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.';

/**
 * Check if MetaMask (or compatible provider) is available.
 */
export function hasWalletProvider() {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

/**
 * Connect to MetaMask and return the wallet address.
 * Throws if user rejects or MetaMask is not installed.
 */
export async function connectWallet() {
  if (!hasWalletProvider()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
  }

  const provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);

  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts returned. Please unlock MetaMask and try again.');
  }

  return accounts[0];
}

/**
 * Request the user to sign a message proving wallet ownership.
 * Returns { address, signature, message }.
 */
export async function signWalletMessage(address) {
  if (!hasWalletProvider()) {
    throw new Error('MetaMask is not installed.');
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner(address);
  const signature = await signer.signMessage(SIGN_MESSAGE);

  return {
    address,
    signature,
    message: SIGN_MESSAGE,
  };
}

/**
 * Full wallet connect + sign flow.
 * Returns { address, signature, message } on success.
 */
export async function connectAndSign() {
  const address = await connectWallet();
  return signWalletMessage(address);
}

/**
 * Get the currently connected wallet address (if any).
 * Does NOT prompt — just checks if already connected.
 */
export async function getConnectedAddress() {
  if (!hasWalletProvider()) return null;

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts?.[0] || null;
  } catch {
    return null;
  }
}
