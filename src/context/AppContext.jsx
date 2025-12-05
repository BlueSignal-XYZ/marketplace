import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut, getRedirectResult } from "firebase/auth";
import { auth } from "../apis/firebase";
import { UserAPI } from "../scripts/back_door";
import { getAppMode } from "../utils/modeDetection";
import { getDefaultDashboardRoute } from "../utils/roleRouting";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [routePath, setRoutePath] = useState("");
  const [showSubItems, setShowSubItems] = useState(false);
  const [notificationBarOpen, setNotificationBarOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [verificationUIOpen, setVerificationUIOpen] = useState(false);
  const [verificationData, setVerificationData] = useState({});
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("Profile Settings");
  const [confirmation, setConfirmation] = useState(null);
  const [result, setResult] = useState(null);
  const [notification, setNotification] = useState("");
  const [txPopupVisible, setTxPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mobile detection
  useEffect(() => {
    const isMobileScreen = () => window.innerWidth <= 768;
    setIsMobile(isMobileScreen());
    const handler = () => setIsMobile(isMobileScreen());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Helper to load user data from Firebase user
  const loadUserData = async (firebaseUser) => {
    if (!firebaseUser) {
      sessionStorage.removeItem("user");
      return null;
    }

    try {
      const userdata = (await UserAPI.account.getUserFromUID(firebaseUser.uid))?.userdata;

      if (userdata?.uid) {
        sessionStorage.setItem("user", JSON.stringify(userdata));
        console.log("✅ User loaded:", userdata.uid, "| Role:", userdata.role || "none");
        return userdata;
      } else {
        // Firebase user exists but not in backend - use Firebase data
        const fallbackUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: "buyer", // default fallback
        };
        sessionStorage.setItem("user", JSON.stringify(fallbackUser));
        console.log("⚠️ User loaded from Firebase (backend fallback):", fallbackUser.uid);
        return fallbackUser;
      }
    } catch (error) {
      console.error("❌ Failed to fetch user data:", error);
      // Still set Firebase user so they're not stuck
      const fallbackUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        role: "buyer",
      };
      sessionStorage.setItem("user", JSON.stringify(fallbackUser));
      return fallbackUser;
    }
  };

  // CRITICAL: Firebase Auth Initialization
  // Handle redirect result AND set up auth listener
  useEffect(() => {
    console.log("🔐 Initializing Firebase auth...");
    let unsubscribe = null;
    let redirectHandled = false;

    const initAuth = async () => {
      // Step 1: Check for pending redirect result FIRST
      // This must complete before we process onAuthStateChanged
      try {
        console.log("🔄 Checking for redirect result...");
        const redirectResult = await getRedirectResult(auth);

        if (redirectResult?.user) {
          console.log("✅ Redirect auth success:", redirectResult.user.uid);
          redirectHandled = true;

          // Load user data
          const userData = await loadUserData(redirectResult.user);

          if (userData) {
            setUser(userData);
            setAuthLoading(false);
            setIsLoading(false);

            // CRITICAL: Navigate immediately using window.location
            // React Router navigate() can have timing issues with state updates
            const mode = getAppMode();
            const route = getDefaultDashboardRoute(userData, mode);
            console.log("🚀 Redirect complete, navigating to:", route);

            // Use replace to avoid back-button issues
            window.location.replace(route);
            return; // Stop execution, page is navigating
          }
        }
      } catch (error) {
        console.error("🔄 Redirect result error:", error?.code || error?.message || "unknown");
        // Continue to auth state listener even if redirect fails
      }

      // Step 2: Set up normal auth state listener
      // This handles: existing sessions, popup auth, and normal page loads
      console.log("🔐 Setting up auth state listener...");
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        console.log("🔐 Auth state changed:", firebaseUser?.uid || "signed out");

        // Skip if we already handled redirect (prevents double processing)
        if (redirectHandled && firebaseUser) {
          console.log("🔄 Skipping - already handled by redirect");
          return;
        }

        if (firebaseUser) {
          const userData = await loadUserData(firebaseUser);
          setUser(userData);
        } else {
          sessionStorage.removeItem("user");
          setUser(null);
          console.log("🚪 User signed out");
        }

        setAuthLoading(false);
        setIsLoading(false);
      });
    };

    initAuth();

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Manual user update (for registration or profile edits)
  const updateUser = async (uid, _userdata = {}) => {
    try {
      var userdata;
      if (_userdata?.uid) {
        userdata = _userdata;
      } else {
        userdata = (await UserAPI.account.getUserFromUID(uid))?.userdata;
      }
      if (userdata?.uid) {
        sessionStorage.setItem("user", JSON.stringify(userdata));
        setUser(userdata);
        console.log("✅ User manually updated:", userdata.uid, "| Role:", userdata.role);
        return true;
      }
    } catch (error) {
      logNotification("error", error.message);
      console.error("❌ updateUser failed:", error);
    }
    return null;
  };

  const handleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleNotificationsBar = () =>
    setNotificationBarOpen(!notificationBarOpen);
  const handleVerificationUI = () => setVerificationUIOpen(!verificationUIOpen);
  const handleSettingsMenu = () => setSettingsMenuOpen(!settingsMenuOpen);
  const handleSettingsTab = (tab) => {
    setSettingsTab(tab);
    setSettingsMenuOpen(true);
  };
  const toggleCalculator = () => setCalculatorOpen(!calculatorOpen);
  const logConfirmation = (message, action) =>
    setConfirmation({ msg: message, action });
  const cancelConfirmation = (accepted) => {
    setConfirmation(null);
    if (!accepted) logNotification("error", "Action Denied");
  };
  const logNotification = (type, message) =>
    setNotification({ [type]: message });
  const clearNotification = () => setNotification({});

  // Universal logout function - signs out from Firebase and clears state
  const logout = async () => {
    console.log("🔓 Logging out...");
    try {
      await signOut(auth);
      sessionStorage.removeItem("user");
      setUser(null);
      console.log("🔓 User logged out successfully");
      window.location.href = "/";
    } catch (error) {
      console.error("❌ Logout failed:", error);
      logNotification("error", "Logout failed. Please try again.");
    }
  };

  // Legacy handleLogOut with confirmation dialog
  const handleLogOut = () => {
    logConfirmation("Are you sure you want to log out?", logout);
  };

  const toggleEnvironmentSubItems = () => setShowSubItems(!showSubItems);

  const APP = {
    STATES: {
      authLoading,
      isLoading,
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
      setUser, // ADDED: For direct user state updates (used by LoginForm)
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
      logout, // Universal logout - signs out from Firebase
      handleLogOut, // Legacy logout with confirmation
      toggleEnvironmentSubItems,
    },
  };

  return <AppContext.Provider value={APP}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
