import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured, subscribeToConnectionState } from '../apis/firebase';
import { UserProfileAPI } from '../scripts/back_door';
import { clearDeviceCache } from '../hooks/useUserDevices';

const AppContext = createContext();

/**
 * Strip user object to non-sensitive fields for localStorage.
 * Avoids storing email/PII in plain text (CodeQL: clear-text-storage).
 */
const toSessionUser = (user) => {
  if (!user) return null;
  return {
    uid: user.uid,
    displayName: user.displayName,
    emailVerified: user.emailVerified,
    role: user.role,
    username: user.username,
    company: user.company,
    onboardingComplete: user.onboardingComplete,
  };
};

export const AppProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [routePath, setRoutePath] = useState('');
  const [showSubItems, setShowSubItems] = useState(false);
  const [notificationBarOpen, setNotificationBarOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [verificationUIOpen, setVerificationUIOpen] = useState(false);
  const [verificationData, setVerificationData] = useState({});
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('Profile Settings');
  const [confirmation, setConfirmation] = useState(null);
  const [result, setResult] = useState(null);
  const [notification, setNotification] = useState('');
  const [txPopupVisible, setTxPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Firebase RTDB connection state. Starts as `true` optimistically so
  // consumers don't show "offline" on first paint before the .info/connected
  // listener has reported.
  const [isOnline, setIsOnline] = useState(true);

  // Mobile detection
  useEffect(() => {
    const isMobileScreen = () => window.innerWidth <= 768;
    setIsMobile(isMobileScreen());
    const handler = () => setIsMobile(isMobileScreen());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Firebase Auth State Listener
  // Using popup auth, so we just need to listen for auth state changes
  useEffect(() => {
    // Skip auth listener if Firebase isn't configured
    // This prevents errors when env vars are missing
    if (!isFirebaseConfigured || !auth) {
      setAuthLoading(false);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User signed in — fetch full profile from the real /user/profile/get endpoint.
        // The backend returns a flat object: { uid, email, displayName, role, company, phone, onboardingComplete, ... }
        try {
          const profileData = await UserProfileAPI.get(firebaseUser.uid);

          if (profileData?.uid) {
            // Merge emailVerified from Firebase Auth (not stored in RTDB)
            const userdata = {
              ...profileData,
              emailVerified: firebaseUser.emailVerified,
            };
            localStorage.setItem('bluesignal_user', JSON.stringify(toSessionUser(userdata)));
            setUser(userdata);
          } else {
            // Firebase user exists but not in backend — use Firebase data
            // SECURITY: Do not assign default role client-side — role comes from server
            const fallbackUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              emailVerified: firebaseUser.emailVerified,
            };
            localStorage.setItem('bluesignal_user', JSON.stringify(toSessionUser(fallbackUser)));
            setUser(fallbackUser);
          }
        } catch {
          // Still set Firebase user so they're not stuck
          // SECURITY: Do not assign default role client-side
          const fallbackUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            emailVerified: firebaseUser.emailVerified,
          };
          localStorage.setItem('bluesignal_user', JSON.stringify(toSessionUser(fallbackUser)));
          setUser(fallbackUser);
        }
      } else {
        // User signed out
        localStorage.removeItem('bluesignal_user');
        setUser(null);
      }

      setAuthLoading(false);
      setIsLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Firebase connection state — surfaces RTDB .info/connected so the UI
  // can show an offline banner and callers can gate network-dependent actions.
  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;
    const unsub = subscribeToConnectionState((connected) => setIsOnline(connected));
    return () => {
      try {
        unsub();
      } catch (_e) {
        /* no-op */
      }
    };
  }, []);

  /**
   * Re-sync the user's local state after a mutation.
   *
   * This function does NOT write to the backend — callers must first call the
   * appropriate endpoint (UserProfileAPI.update, completeOnboarding, etc.) to
   * persist changes. This function's job is to pull authoritative state back
   * from the server so local state reflects what actually got written.
   *
   * The second argument is an optimistic overlay: it's applied immediately so
   * the UI can update without waiting for the refetch round-trip. When the
   * refetch returns, the server response wins (source of truth).
   *
   * If the refetch fails (offline, 5xx), the optimistic overlay persists so
   * the UI doesn't revert. Error is logged for observability.
   */
  const updateUser = async (uid, optimisticOverlay = {}) => {
    // 1. Apply optimistic overlay immediately (if caller provided full data).
    if (optimisticOverlay?.uid) {
      localStorage.setItem('bluesignal_user', JSON.stringify(toSessionUser(optimisticOverlay)));
      setUser(optimisticOverlay);
    }

    // 2. Refetch authoritative profile from backend.
    try {
      const freshUser = await UserProfileAPI.get(uid);
      if (freshUser?.uid) {
        localStorage.setItem('bluesignal_user', JSON.stringify(toSessionUser(freshUser)));
        setUser(freshUser);
        return true;
      }
    } catch (err) {
      console.warn('[AppContext] updateUser refetch failed:', err?.message || err);
      // Don't log a user-facing notification — the caller has already
      // reported success. A stale local overlay is acceptable until the
      // next refresh. Only log if we had no optimistic overlay either.
      if (!optimisticOverlay?.uid) {
        logNotification('error', 'Failed to refresh user data. Please reload.');
      }
    }
    return Boolean(optimisticOverlay?.uid);
  };

  /**
   * One-shot save helper: writes profile fields to the backend, then syncs
   * local state. Use this instead of the two-step `UserProfileAPI.update()
   * → ACTIONS.updateUser()` pattern where possible — it handles the
   * optimistic-overlay + refetch plumbing and returns a clear success flag.
   */
  const saveProfile = async (uid, profileData) => {
    try {
      await UserProfileAPI.update(uid, profileData);
      await updateUser(uid, { ...(user || {}), ...profileData });
      return { success: true };
    } catch (err) {
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
      return {
        success: false,
        error: serverMsg || err?.message || 'Failed to save profile.',
        details: err?.response?.data?.details,
      };
    }
  };

  const handleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleNotificationsBar = () => setNotificationBarOpen(!notificationBarOpen);
  const handleVerificationUI = () => setVerificationUIOpen(!verificationUIOpen);
  const handleSettingsMenu = () => setSettingsMenuOpen(!settingsMenuOpen);
  const handleSettingsTab = (tab) => {
    setSettingsTab(tab);
    setSettingsMenuOpen(true);
  };
  const toggleCalculator = () => setCalculatorOpen(!calculatorOpen);
  const logConfirmation = (message, action) => setConfirmation({ msg: message, action });
  const cancelConfirmation = (accepted) => {
    setConfirmation(null);
    if (!accepted) logNotification('error', 'Action Denied');
  };
  const logNotification = (type, message) => setNotification({ [type]: message });
  const clearNotification = () => setNotification({});

  // Universal logout function - signs out from Firebase and clears state
  const logout = async () => {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
      // Clear all cached user data
      localStorage.removeItem('bluesignal_user');
      clearDeviceCache(); // Clear device detection cache
      localStorage.removeItem('cloud_welcome_dismissed'); // Reset welcome banner
      setUser(null);
      window.location.href = '/';
    } catch {
      logNotification('error', 'Logout failed. Please try again.');
    }
  };

  // Legacy handleLogOut with confirmation dialog
  const handleLogOut = () => {
    logConfirmation('Are you sure you want to log out?', logout);
  };

  const toggleEnvironmentSubItems = () => setShowSubItems(!showSubItems);

  const APP = {
    STATES: {
      authLoading,
      isLoading,
      isOnline,
      isMobile,
      user,
      searchResults,
      routePath,
      sidebarOpen,
      notificationBarOpen,
      verificationUIOpen,
      verificationData,
      settingsMenuOpen,
      calculatorOpen,
      settingsTab,
      confirmation,
      notification,
      txPopupVisible,
      result,
      showSubItems,
    },
    ACTIONS: {
      setIsLoading,
      updateUser,
      saveProfile,
      setUser, // For direct user state updates
      setSearchResults,
      setRoutePath,
      handleSidebar,
      handleNotificationsBar,
      handleVerificationUI,
      setVerificationUIOpen,
      setVerificationData,
      handleSettingsMenu,
      handleSettingsTab,
      toggleCalculator,
      logConfirmation,
      clearNotification,
      setResult,
      setTxPopupVisible,
      cancelConfirmation,
      logNotification,
      logout,
      handleLogOut,
      toggleEnvironmentSubItems,
    },
  };

  return <AppContext.Provider value={APP}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
