import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import axios from 'axios';

// Mock firebase auth
const mockGetIdToken = vi.fn(() => Promise.resolve('mock-token-123'));
vi.mock('../apis/firebase', () => ({
  auth: {
    currentUser: {
      getIdToken: (...args) => mockGetIdToken(...args),
    },
  },
}));

vi.mock('../services/v2/client', () => ({
  AUTH_SESSION_EXPIRED_EVENT: 'auth-session-expired',
}));

vi.mock('../../configs', () => ({
  default: { server_url: 'http://localhost:5001' },
}));

vi.mock('axios', () => {
  const mockAxios = {
    post: vi.fn(() => Promise.resolve({ data: {} })),
    get: vi.fn(() => Promise.resolve({ data: {} })),
  };
  return { default: mockAxios };
});

// Import the exported UserAPI which uses authPost internally
import { UserAPI } from './back_door.js';

describe('Authenticated API calls (authPost)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetIdToken.mockResolvedValue('mock-token-123');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should include Authorization header from Firebase token', async () => {
    axios.post.mockResolvedValueOnce({
      data: { userData: { uid: 'user-1', username: 'testuser' } },
    });

    await UserAPI.account.getUserFromUID('user-1');

    expect(mockGetIdToken).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/db/user/get/from/uid'),
      expect.objectContaining({ userUID: 'user-1' }),
      expect.objectContaining({
        headers: { Authorization: 'Bearer mock-token-123' },
        timeout: 30000,
      })
    );
  });

  it('should retry on 401 with force-refreshed token', async () => {
    const error401 = new Error('Unauthorized');
    error401.response = { status: 401 };

    // First call fails with 401, second succeeds
    axios.post.mockRejectedValueOnce(error401).mockResolvedValueOnce({
      data: { userData: { uid: 'user-1' } },
    });

    mockGetIdToken.mockResolvedValueOnce('old-token').mockResolvedValueOnce('fresh-token');

    await UserAPI.account.getUserFromUID('user-1');

    // Should have retried with force refresh (true param)
    expect(mockGetIdToken).toHaveBeenCalledWith(true);
    expect(axios.post).toHaveBeenCalledTimes(2);
  });

  it('should propagate non-401 errors', async () => {
    const error500 = new Error('Server Error');
    error500.response = { status: 500 };
    axios.post.mockRejectedValueOnce(error500);

    await expect(UserAPI.account.getUserFromUID('user-1')).rejects.toThrow('Server Error');
  });

  it('should set request timeout to 30 seconds', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    await UserAPI.account.getUserFromUID('user-1');

    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      expect.objectContaining({ timeout: 30000 })
    );
  });
});
