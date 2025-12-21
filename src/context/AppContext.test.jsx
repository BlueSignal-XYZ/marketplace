import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { AppProvider, useAppContext } from './AppContext'
import React from 'react'

// Mock Firebase auth - use vi.fn() directly in the factory
vi.mock('../apis/firebase', () => ({
  auth: {},
  isFirebaseConfigured: true,
  firebaseConfigError: null,
}))

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}))

// Mock the UserAPI
vi.mock('../scripts/back_door', () => ({
  UserAPI: {
    account: {
      getUserFromUID: vi.fn(),
    },
  },
}))

import { UserAPI } from '../scripts/back_door'
import { onAuthStateChanged, signOut } from 'firebase/auth'

// Test component to access context
const TestComponent = () => {
  const { STATES, ACTIONS } = useAppContext()
  return (
    <div>
      <div data-testid="user-uid">{STATES.user?.uid || 'no-user'}</div>
      <div data-testid="is-loading">{STATES.isLoading ? 'loading' : 'loaded'}</div>
      <div data-testid="is-mobile">{STATES.isMobile ? 'mobile' : 'desktop'}</div>
      <div data-testid="sidebar-open">{STATES.sidebarOpen ? 'open' : 'closed'}</div>
      <button onClick={ACTIONS.handleSidebar}>Toggle Sidebar</button>
      <button onClick={ACTIONS.handleLogOut}>Logout</button>
      <button onClick={() => ACTIONS.logNotification('success', 'Test message')}>
        Notify
      </button>
    </div>
  )
}

describe('AppContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    sessionStorage.clear()
    // Reset window.innerWidth to desktop size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    // Mock Firebase auth to immediately call callback with null (no user)
    onAuthStateChanged.mockImplementation((auth, callback) => {
      // Call callback immediately with no user by default
      setTimeout(() => callback(null), 0)
      // Return unsubscribe function
      return vi.fn()
    })

    signOut.mockResolvedValue(undefined)
  })

  describe('Provider Initialization', () => {
    it('should render children', () => {
      render(
        <AppProvider>
          <div data-testid="child">Test Child</div>
        </AppProvider>
      )
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('should initialize with default state', () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      )

      expect(screen.getByTestId('user-uid')).toHaveTextContent('no-user')
      expect(screen.getByTestId('sidebar-open')).toHaveTextContent('closed')
    })

    it('should detect desktop by default', () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      )

      expect(screen.getByTestId('is-mobile')).toHaveTextContent('desktop')
    })

    it('should detect mobile when window width <= 768', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      )

      expect(screen.getByTestId('is-mobile')).toHaveTextContent('mobile')
    })
  })

  describe('User Authentication', () => {
    it('should load user from sessionStorage on mount', async () => {
      const mockUser = { uid: 'test-uid-123', email: 'test@example.com' }

      // Mock Firebase to return a logged-in user
      onAuthStateChanged.mockImplementation((auth, callback) => {
        setTimeout(() => callback({ uid: 'test-uid-123', email: 'test@example.com' }), 0)
        return vi.fn()
      })

      UserAPI.account.getUserFromUID.mockResolvedValue({
        userdata: mockUser,
      })

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user-uid')).toHaveTextContent('test-uid-123')
      }, { timeout: 2000 })

      expect(UserAPI.account.getUserFromUID).toHaveBeenCalledWith('test-uid-123')
    })

    it('should not load user when sessionStorage is empty', async () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('loaded')
      })

      expect(UserAPI.account.getUserFromUID).not.toHaveBeenCalled()
      expect(screen.getByTestId('user-uid')).toHaveTextContent('no-user')
    })

    it('should handle getUserFromUID errors gracefully', async () => {
      const mockUser = { uid: 'test-uid-123' }
      sessionStorage.setItem('user', JSON.stringify(mockUser))

      UserAPI.account.getUserFromUID.mockRejectedValue(
        new Error('Network error')
      )

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('loaded')
      })

      // User should not be set on error
      expect(screen.getByTestId('user-uid')).toHaveTextContent('no-user')
    })
  })

  describe('Sidebar Actions', () => {
    it('should toggle sidebar state', async () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      )

      expect(screen.getByTestId('sidebar-open')).toHaveTextContent('closed')

      const toggleButton = screen.getByText('Toggle Sidebar')
      await act(async () => {
        toggleButton.click()
      })

      expect(screen.getByTestId('sidebar-open')).toHaveTextContent('open')

      await act(async () => {
        toggleButton.click()
      })

      expect(screen.getByTestId('sidebar-open')).toHaveTextContent('closed')
    })
  })

  describe('Logout Functionality', () => {
    it('should clear user and sessionStorage on logout confirmation', async () => {
      const mockUser = { uid: 'test-uid-123', email: 'test@example.com' }

      // Mock Firebase to return a logged-in user
      onAuthStateChanged.mockImplementation((auth, callback) => {
        setTimeout(() => callback({ uid: 'test-uid-123', email: 'test@example.com' }), 0)
        return vi.fn()
      })

      UserAPI.account.getUserFromUID.mockResolvedValue({
        userdata: mockUser,
      })

      // Mock window.location.href
      delete window.location
      window.location = { href: vi.fn() }

      const TestWithConfirmation = () => {
        const { STATES, ACTIONS } = useAppContext()

        React.useEffect(() => {
          // Auto-accept confirmation when it appears
          if (STATES.confirmation) {
            ACTIONS.cancelConfirmation(true)
            STATES.confirmation.action()
          }
        }, [STATES.confirmation])

        return <TestComponent />
      }

      render(
        <AppProvider>
          <TestWithConfirmation />
        </AppProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user-uid')).toHaveTextContent('test-uid-123')
      }, { timeout: 2000 })

      const logoutButton = screen.getByText('Logout')
      await act(async () => {
        logoutButton.click()
      })

      await waitFor(() => {
        expect(sessionStorage.getItem('user')).toBeNull()
      }, { timeout: 2000 })
    })
  })

  describe('Notification System', () => {
    it('should set notification when logNotification is called', async () => {
      const TestWithNotification = () => {
        const { STATES, ACTIONS } = useAppContext()
        return (
          <div>
            <button onClick={() => ACTIONS.logNotification('success', 'Test message')}>
              Notify
            </button>
            <div data-testid="notification">
              {STATES.notification?.success || 'no-notification'}
            </div>
          </div>
        )
      }

      render(
        <AppProvider>
          <TestWithNotification />
        </AppProvider>
      )

      const notifyButton = screen.getByText('Notify')
      await act(async () => {
        notifyButton.click()
      })

      expect(screen.getByTestId('notification')).toHaveTextContent('Test message')
    })

    it('should clear notification when clearNotification is called', async () => {
      const TestWithNotification = () => {
        const { STATES, ACTIONS } = useAppContext()
        return (
          <div>
            <button onClick={() => ACTIONS.logNotification('error', 'Error message')}>
              Notify Error
            </button>
            <button onClick={() => ACTIONS.clearNotification()}>
              Clear
            </button>
            <div data-testid="notification">
              {STATES.notification?.error || 'no-notification'}
            </div>
          </div>
        )
      }

      render(
        <AppProvider>
          <TestWithNotification />
        </AppProvider>
      )

      const notifyButton = screen.getByText('Notify Error')
      await act(async () => {
        notifyButton.click()
      })

      expect(screen.getByTestId('notification')).toHaveTextContent('Error message')

      const clearButton = screen.getByText('Clear')
      await act(async () => {
        clearButton.click()
      })

      expect(screen.getByTestId('notification')).toHaveTextContent('no-notification')
    })
  })

  describe('updateUser Action', () => {
    it('should update user state with new user data', async () => {
      const mockUser = { uid: 'new-user-123', email: 'new@example.com' }
      UserAPI.account.getUserFromUID.mockResolvedValue({
        userdata: mockUser,
      })

      const TestWithUpdate = () => {
        const { STATES, ACTIONS } = useAppContext()
        return (
          <div>
            <button onClick={async () => await ACTIONS.updateUser('new-user-123')}>
              Update User
            </button>
            <div data-testid="user-uid">{STATES.user?.uid || 'no-user'}</div>
          </div>
        )
      }

      render(
        <AppProvider>
          <TestWithUpdate />
        </AppProvider>
      )

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByTestId('user-uid')).toHaveTextContent('no-user')
      })

      const updateButton = screen.getByText('Update User')
      await act(async () => {
        updateButton.click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('user-uid')).toHaveTextContent('new-user-123')
      }, { timeout: 2000 })

      expect(sessionStorage.getItem('user')).toContain('new-user-123')
    })

    it('should update user with provided userdata object', async () => {
      const mockUser = { uid: 'direct-user-456', email: 'direct@example.com' }

      const TestWithUpdate = () => {
        const { STATES, ACTIONS } = useAppContext()
        return (
          <div>
            <button onClick={() => ACTIONS.updateUser('ignored-uid', mockUser)}>
              Update User Direct
            </button>
            <div data-testid="user-uid">{STATES.user?.uid || 'no-user'}</div>
          </div>
        )
      }

      render(
        <AppProvider>
          <TestWithUpdate />
        </AppProvider>
      )

      // Wait for initial render to complete
      await waitFor(() => {
        expect(screen.getByTestId('user-uid')).toHaveTextContent('no-user')
      })

      const updateButton = screen.getByText('Update User Direct')
      await act(async () => {
        updateButton.click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('user-uid')).toHaveTextContent('direct-user-456')
      }, { timeout: 2000 })

      // Should not call API when userdata is provided
      expect(UserAPI.account.getUserFromUID).not.toHaveBeenCalled()
    })
  })

  describe('Mobile Responsiveness', () => {
    it('should update isMobile on window resize', async () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      )

      expect(screen.getByTestId('is-mobile')).toHaveTextContent('desktop')

      // Simulate resize to mobile
      await act(async () => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 500,
        })
        window.dispatchEvent(new Event('resize'))
      })

      await waitFor(() => {
        expect(screen.getByTestId('is-mobile')).toHaveTextContent('mobile')
      })
    })
  })

  describe('Context Hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = console.error
      console.error = vi.fn()

      expect(() => {
        render(<TestComponent />)
      }).toThrow()

      console.error = consoleError
    })
  })
})
