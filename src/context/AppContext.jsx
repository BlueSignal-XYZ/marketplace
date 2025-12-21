import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../apis/firebase";
import { UserAPI } from "../scripts/back_door";

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
        // User signed in - fetch full user data from backend
        try {
          const userdata = (await UserAPI.account.getUserFromUID(firebaseUser.uid))?.userdata;

          if (userdata?.uid) {
            sessionStorage.setItem("user", JSON.stringify(userdata));
            setUser(userdata);
          } else {
            // Firebase user exists but not in backend - use Firebase data
            // SECURITY: Do not assign default role client-side - role comes from server
            const fallbackUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
            };
            sessionStorage.setItem("user", JSON.stringify(fallbackUser));
            setUser(fallbackUser);
          }
        } catch (error) {
          // Still set Firebase user so they're not stuck
          // SECURITY: Do not assign default role client-side
          const fallbackUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          };
          sessionStorage.setItem("user", JSON.stringify(fallbackUser));
          setUser(fallbackUser);
        }
      } else {
        // User signed out
        sessionStorage.removeItem("user");
        setUser(null);
      }

      setAuthLoading(false);
      setIsLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
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
        return true;
      }
    } catch (error) {
      logNotification("error", "Failed to update user data. Please try again.");
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
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
      sessionStorage.removeItem("user");
      setUser(null);
      window.location.href = "/";
    } catch (error) {
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
