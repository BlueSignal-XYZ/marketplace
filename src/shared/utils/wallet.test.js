import { describe, it, expect, beforeEach, vi } from 'vitest';
import { hasWalletProvider, connectAndSign, getConnectedAddress } from './wallet';

// Hoisted mock so each test can override the send/signMessage behavior.
const { mockSend, mockSignMessage, mockGetSigner } = vi.hoisted(() => ({
  mockSend: vi.fn(),
  mockSignMessage: vi.fn(),
  mockGetSigner: vi.fn(),
}));

vi.mock('ethers', () => {
  function BrowserProvider() {
    return {
      send: mockSend,
      getSigner: mockGetSigner,
    };
  }
  return { BrowserProvider };
});

describe('wallet utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clean up window.ethereum between tests
    delete window.ethereum;
    mockSend.mockReset();
    mockSignMessage.mockReset();
    mockGetSigner.mockReset();
    mockGetSigner.mockResolvedValue({ signMessage: mockSignMessage });
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
      mockSend.mockResolvedValue([]);

      await expect(connectAndSign()).rejects.toThrow(/No accounts returned/);
    });

    it('should throw when accounts array is null', async () => {
      window.ethereum = {};
      mockSend.mockResolvedValue(null);

      await expect(connectAndSign()).rejects.toThrow(/No accounts returned/);
    });

    it('should return address, signature, and message on success', async () => {
      window.ethereum = {};
      mockSend.mockResolvedValue(['0xDEADBEEF']);
      mockSignMessage.mockResolvedValue('0xsignature');

      const result = await connectAndSign();

      expect(result.address).toBe('0xDEADBEEF');
      expect(result.signature).toBe('0xsignature');
      expect(result.message).toMatch(/Sign this message to link your wallet/);
      expect(mockGetSigner).toHaveBeenCalledWith('0xDEADBEEF');
      expect(mockSignMessage).toHaveBeenCalledWith(result.message);
    });

    it('should propagate errors from signMessage (user rejection)', async () => {
      window.ethereum = {};
      mockSend.mockResolvedValue(['0xabc']);
      mockSignMessage.mockRejectedValue(new Error('User rejected'));

      await expect(connectAndSign()).rejects.toThrow('User rejected');
    });
  });
});
