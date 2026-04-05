import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AppProvider, useAppContext } from './AppContext';
import React from 'react';

// Mock Firebase auth - use vi.fn() directly in the factory
vi.mock('../apis/firebase', () => ({
  auth: {},
  isFirebaseConfigured: true,
  firebaseConfigError: null,
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}));

// Mock the UserProfileAPI (replaces legacy UserAPI.account.getUserFromUID)
vi.mock('../scripts/back_door', () => ({
  UserProfileAPI: {
    get: vi.fn(),
  },
}));

// Mock clearDeviceCache
vi.mock('../hooks/useUserDevices', () => ({
  clearDeviceCache: vi.fn(),
}));

import { UserProfileAPI } from '../scripts/back_door';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Test component to access context
const TestComponent = () => {
  const { STATES, ACTIONS } = useAppContext();
  return (
    <div>
      <div data-testid="user-uid">{STATES.user?.uid || 'no-user'}</div>
      <div data-testid="user-role">{STATES.user?.role || 'no-role'}</div>
      <div data-testid="user-email">{STATES.user?.email || 'no-email'}</div>
      <div data-testid="user-company">{STATES.user?.company || 'no-company'}</div>
      <div data-testid="user-onboarding">
        {STATES.user?.onboardingComplete ? 'complete' : 'incomplete'}
      </div>
      <div data-testid="user-email-verified">
        {STATES.user?.emailVerified ? 'verified' : 'unverified'}
      </div>
      <div data-testid="is-loading">{STATES.isLoading ? 'loading' : 'loaded'}</div>
      <div data-testid="is-mobile">{STATES.isMobile ? 'mobile' : 'desktop'}</div>
      <div data-testid="sidebar-open">{STATES.sidebarOpen ? 'open' : 'closed'}</div>
      <button onClick={ACTIONS.handleSidebar}>Toggle Sidebar</button>
      <button onClick={ACTIONS.handleLogOut}>Logout</button>
      <button onClick={() => ACTIONS.logNotification('success', 'Test message')}>Notify</button>
    </div>
  );
};

describe('AppContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    sessionStorage.clear();
    // Reset window.innerWidth to desktop size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Mock Firebase auth to immediately call callback with null (no user)
    onAuthStateChanged.mockImplementation((auth, callback) => {
      // Call callback immediately with no user by default
      setTimeout(() => callback(null), 0);
      // Return unsubscribe function
      return vi.fn();
    });

    signOut.mockResolvedValue(undefined);
  });

  describe('Provider Initialization', () => {
    it('should render children', () => {
      render(
        <AppProvider>
          <div data-testid="child">Test Child</div>
        </AppProvider>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should initialize with default state', () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('user-uid')).toHaveTextContent('no-user');
      expect(screen.getByTestId('sidebar-open')).toHaveTextContent('closed');
    });

    it('should detect desktop by default', () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('is-mobile')).toHaveTextContent('desktop');
    });

    it('should detect mobile when window width <= 768', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('is-mobile')).toHaveTextContent('mobile');
    });
  });

  describe('User Authentication', () => {
    it('should hydrate user profile from UserProfileAPI.get on auth', async () => {
      const mockProfile = {
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'buyer',
        company: 'Acme Corp',
        phone: '+1555123',
        onboardingComplete: true,
      };

      // Mock Firebase to return a logged-in user
      onAuthStateChanged.mockImplementation((auth, callback) => {
        setTimeout(
          () =>
            callback({
              uid: 'test-uid-123',
              email: 'test@example.com',
              displayName: 'Test User',
              emailVerified: true,
            }),
          0
        );
        return vi.fn();
      });

      UserProfileAPI.get.mockResolvedValue(mockProfile);

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      await waitFor(
        () => {
          expect(screen.getByTestId('user-uid')).toHaveTextContent('test-uid-123');
        },
        { timeout: 2000 }
      );

      expect(UserProfileAPI.get).toHaveBeenCalledWith('test-uid-123');
      expect(screen.getByTestId('user-role')).toHaveTextContent('buyer');
      expect(screen.getByTestId('user-company')).toHaveTextContent('Acme Corp');
      expect(screen.getByTestId('user-onboarding')).toHaveTextContent('complete');
      expect(screen.getByTestId('user-email-verified')).toHaveTextContent('verified');
    });

    it('should populate user role from profile API after Firebase auth', async () => {
      const mockProfile = {
        uid: 'seller-uid',
        email: 'seller@example.com',
        displayName: 'Seller User',
        role: 'seller',
        onboardingComplete: true,
      };

      onAuthStateChanged.mockImplementation((auth, callback) => {
        setTimeout(
          () =>
            callback({
              uid: 'seller-uid',
              email: 'seller@example.com',
              displayName: 'Seller User',
              emailVerified: false,
            }),
          0
        );
        return vi.fn();
      });

      UserProfileAPI.get.mockResolvedValue(mockProfile);

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      await waitFor(
        () => {
          expect(screen.getByTestId('user-role')).toHaveTextContent('seller');
        },
        { timeout: 2000 }
      );

      expect(screen.getByTestId('user-email-verified')).toHaveTextContent('unverified');
    });

    it('should not load user when no Firebase auth user', async () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('loaded');
      });

      expect(UserProfileAPI.get).not.toHaveBeenCalled();
      expect(screen.getByTestId('user-uid')).toHaveTextContent('no-user');
    });

    it('should fallback to Firebase data when profile API returns no uid', async () => {
      onAuthStateChanged.mockImplementation((auth, callback) => {
        setTimeout(
          () =>
            callback({
              uid: 'new-user-uid',
              email: 'new@example.com',
              displayName: 'New User',
              emailVerified: false,
            }),
          0
        );
        return vi.fn();
      });

      // Profile API returns empty/null (user not yet in backend)
      UserProfileAPI.get.mockResolvedValue(null);

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      await waitFor(
        () => {
          expect(screen.getByTestId('user-uid')).toHaveTextContent('new-user-uid');
        },
        { timeout: 2000 }
      );

      // Should use Firebase fallback — no role assigned
      expect(screen.getByTestId('user-role')).toHaveTextContent('no-role');
      expect(screen.getByTestId('user-email')).toHaveTextContent('new@example.com');
    });

    it('should fallback to Firebase data when profile API errors', async () => {
      onAuthStateChanged.mockImplementation((auth, callback) => {
        setTimeout(
          () =>
            callback({
              uid: 'error-uid',
              email: 'error@example.com',
              displayName: 'Error User',
              emailVerified: true,
            }),
          0
        );
        return vi.fn();
      });

      UserProfileAPI.get.mockRejectedValue(new Error('Network error'));

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      await waitFor(
        () => {
          expect(screen.getByTestId('user-uid')).toHaveTextContent('error-uid');
        },
        { timeout: 2000 }
      );

      // Should use Firebase fallback — no role assigned
      expect(screen.getByTestId('user-role')).toHaveTextContent('no-role');
      expect(screen.getByTestId('user-email')).toHaveTextContent('error@example.com');
      expect(screen.getByTestId('user-email-verified')).toHaveTextContent('verified');
    });
  });

  describe('Sidebar Actions', () => {
    it('should toggle sidebar state', async () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('sidebar-open')).toHaveTextContent('closed');

      const toggleButton = screen.getByText('Toggle Sidebar');
      await act(async () => {
        toggleButton.click();
      });

      expect(screen.getByTestId('sidebar-open')).toHaveTextContent('open');

      await act(async () => {
        toggleButton.click();
      });

      expect(screen.getByTestId('sidebar-open')).toHaveTextContent('closed');
    });
  });

  describe('Logout Functionality', () => {
    it('should clear user and sessionStorage on logout confirmation', async () => {
      const mockProfile = { uid: 'test-uid-123', email: 'test@example.com', role: 'buyer' };

      // Mock Firebase to return a logged-in user
      onAuthStateChanged.mockImplementation((auth, callback) => {
        setTimeout(
          () => callback({ uid: 'test-uid-123', email: 'test@example.com', emailVerified: true }),
          0
        );
        return vi.fn();
      });

      UserProfileAPI.get.mockResolvedValue(mockProfile);

      // Mock window.location.href
      delete window.location;
      window.location = { href: vi.fn() };

      const TestWithConfirmation = () => {
        const { STATES, ACTIONS } = useAppContext();

        React.useEffect(() => {
          // Auto-accept confirmation when it appears
          if (STATES.confirmation) {
            ACTIONS.cancelConfirmation(true);
            STATES.confirmation.action();
          }
        }, [STATES.confirmation]);

        return <TestComponent />;
      };

      render(
        <AppProvider>
          <TestWithConfirmation />
        </AppProvider>
      );

      await waitFor(
        () => {
          expect(screen.getByTestId('user-uid')).toHaveTextContent('test-uid-123');
        },
        { timeout: 2000 }
      );

      const logoutButton = screen.getByText('Logout');
      await act(async () => {
        logoutButton.click();
      });

      await waitFor(
        () => {
          expect(sessionStorage.getItem('user')).toBeNull();
        },
        { timeout: 2000 }
      );
    });
  });

  describe('Notification System', () => {
    it('should set notification when logNotification is called', async () => {
      const TestWithNotification = () => {
        const { STATES, ACTIONS } = useAppContext();
        return (
          <div>
            <button onClick={() => ACTIONS.logNotification('success', 'Test message')}>
              Notify
            </button>
            <div data-testid="notification">
              {STATES.notification?.success || 'no-notification'}
            </div>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestWithNotification />
        </AppProvider>
      );

      const notifyButton = screen.getByText('Notify');
      await act(async () => {
        notifyButton.click();
      });

      expect(screen.getByTestId('notification')).toHaveTextContent('Test message');
    });

    it('should clear notification when clearNotification is called', async () => {
      const TestWithNotification = () => {
        const { STATES, ACTIONS } = useAppContext();
        return (
          <div>
            <button onClick={() => ACTIONS.logNotification('error', 'Error message')}>
              Notify Error
            </button>
            <button onClick={() => ACTIONS.clearNotification()}>Clear</button>
            <div data-testid="notification">{STATES.notification?.error || 'no-notification'}</div>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestWithNotification />
        </AppProvider>
      );

      const notifyButton = screen.getByText('Notify Error');
      await act(async () => {
        notifyButton.click();
      });

      expect(screen.getByTestId('notification')).toHaveTextContent('Error message');

      const clearButton = screen.getByText('Clear');
      await act(async () => {
        clearButton.click();
      });

      expect(screen.getByTestId('notification')).toHaveTextContent('no-notification');
    });
  });

  describe('updateUser Action', () => {
    it('should update user state by re-fetching profile from backend', async () => {
      const mockProfile = { uid: 'new-user-123', email: 'new@example.com', role: 'installer' };
      UserProfileAPI.get.mockResolvedValue(mockProfile);

      const TestWithUpdate = () => {
        const { STATES, ACTIONS } = useAppContext();
        return (
          <div>
            <button onClick={async () => await ACTIONS.updateUser('new-user-123')}>
              Update User
            </button>
            <div data-testid="user-uid">{STATES.user?.uid || 'no-user'}</div>
            <div data-testid="user-role">{STATES.user?.role || 'no-role'}</div>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestWithUpdate />
        </AppProvider>
      );

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByTestId('user-uid')).toHaveTextContent('no-user');
      });

      const updateButton = screen.getByText('Update User');
      await act(async () => {
        updateButton.click();
      });

      await waitFor(
        () => {
          expect(screen.getByTestId('user-uid')).toHaveTextContent('new-user-123');
        },
        { timeout: 2000 }
      );

      expect(screen.getByTestId('user-role')).toHaveTextContent('installer');
      expect(sessionStorage.getItem('user')).toContain('new-user-123');
    });

    it('should update user with provided userdata object', async () => {
      const mockUser = { uid: 'direct-user-456', email: 'direct@example.com', role: 'seller' };

      const TestWithUpdate = () => {
        const { STATES, ACTIONS } = useAppContext();
        return (
          <div>
            <button onClick={() => ACTIONS.updateUser('ignored-uid', mockUser)}>
              Update User Direct
            </button>
            <div data-testid="user-uid">{STATES.user?.uid || 'no-user'}</div>
            <div data-testid="user-role">{STATES.user?.role || 'no-role'}</div>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestWithUpdate />
        </AppProvider>
      );

      // Wait for initial render to complete
      await waitFor(() => {
        expect(screen.getByTestId('user-uid')).toHaveTextContent('no-user');
      });

      const updateButton = screen.getByText('Update User Direct');
      await act(async () => {
        updateButton.click();
      });

      await waitFor(
        () => {
          expect(screen.getByTestId('user-uid')).toHaveTextContent('direct-user-456');
        },
        { timeout: 2000 }
      );

      expect(screen.getByTestId('user-role')).toHaveTextContent('seller');

      // Should not call API when userdata is provided
      expect(UserProfileAPI.get).not.toHaveBeenCalled();
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should update isMobile on window resize', async () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('is-mobile')).toHaveTextContent('desktop');

      // Simulate resize to mobile
      await act(async () => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 500,
        });
        window.dispatchEvent(new Event('resize'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('is-mobile')).toHaveTextContent('mobile');
      });
    });
  });

  describe('Context Hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = console.error;
      console.error = vi.fn();

      expect(() => {
        render(<TestComponent />);
      }).toThrow();

      console.error = consoleError;
    });
  });
});
