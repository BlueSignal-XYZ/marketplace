import { describe, it, expect, beforeEach, vi } from 'vitest';
import { hasWalletProvider, connectAndSign, getConnectedAddress } from './wallet';

describe('wallet utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clean up window.ethereum between tests
    delete window.ethereum;
  });

  describe('hasWalletProvider', () => {
    it('should return false when window.ethereum is not defined', () => {
      expect(hasWalletProvider()).toBe(false);
    });

    it('should return true when window.ethereum is defined', () => {
      window.ethereum = {};
      expect(hasWalletProvider()).toBe(true);
    });
  });

  describe('getConnectedAddress', () => {
    it('should return null when no wallet provider exists', async () => {
      const result = await getConnectedAddress();
      expect(result).toBeNull();
    });

    it('should return the first connected account', async () => {
      window.ethereum = {
        request: vi.fn().mockResolvedValue(['0xabc123']),
      };

      const result = await getConnectedAddress();
      expect(result).toBe('0xabc123');
      expect(window.ethereum.request).toHaveBeenCalledWith({
        method: 'eth_accounts',
      });
    });

    it('should return null when no accounts are connected', async () => {
      window.ethereum = {
        request: vi.fn().mockResolvedValue([]),
      };

      const result = await getConnectedAddress();
      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      window.ethereum = {
        request: vi.fn().mockRejectedValue(new Error('Provider error')),
      };

      const result = await getConnectedAddress();
      expect(result).toBeNull();
    });
  });

  describe('connectAndSign', () => {
    it('should throw when MetaMask is not installed', async () => {
      await expect(connectAndSign()).rejects.toThrow('MetaMask is not installed');
    });

    it('should throw when no accounts are returned', async () => {
      window.ethereum = {};

      // Mock BrowserProvider via ethers
      vi.doMock('ethers', () => ({
        BrowserProvider: vi.fn().mockImplementation(() => ({
          send: vi.fn().mockResolvedValue([]),
        })),
      }));

      // Re-import after mock
      const { connectAndSign: freshConnect } = await import('./wallet');
      await expect(freshConnect()).rejects.toThrow();
    });
  });
});
