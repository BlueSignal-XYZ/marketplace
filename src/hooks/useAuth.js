/**
 * useAuth Hook
 * Provides authentication state and actions for the BlueSignal application
 */

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import { ref, onValue, update } from "firebase/database";
import { auth, db, googleProvider } from "../apis/firebase";

// Create Auth Context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Wraps the app to provide authentication state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Subscribe to user profile in database
        const profileRef = ref(db, `users/${firebaseUser.uid}/profile`);
        const unsubProfile = onValue(
          profileRef,
          (snapshot) => {
            setProfile(snapshot.val());
            setLoading(false);
          },
          (error) => {
            console.error("Profile subscription error:", error);
            setLoading(false);
          }
        );

        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(async (email, password) => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Sign up with email and password
   */
  const signUp = useCallback(async (email, password, displayName = "") => {
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name if provided
      if (displayName) {
        await firebaseUpdateProfile(result.user, { displayName });
      }

      return result.user;
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Sign in with Google
   */
  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Sign out
   */
  const logout = useCallback(async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to sign out");
      throw err;
    }
  }, []);

  /**
   * Reset password
   */
  const resetPassword = useCallback(async (email) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    async (profileData) => {
      if (!user) throw new Error("Not authenticated");

      try {
        // Update Firebase Auth profile
        if (profileData.displayName) {
          await firebaseUpdateProfile(user, { displayName: profileData.displayName });
        }

        // Update database profile
        const profileRef = ref(db, `users/${user.uid}/profile`);
        await update(profileRef, {
          ...profileData,
          updatedAt: Date.now(),
        });
      } catch (err) {
        console.error("Update profile error:", err);
        throw new Error("Failed to update profile");
      }
    },
    [user]
  );

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback(
    (role) => {
      return profile?.role === role;
    },
    [profile]
  );

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!user;

  const value = {
    user,
    profile,
    loading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    updateProfile,
    hasRole,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 * Access authentication state and actions
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
function getAuthErrorMessage(errorCode) {
  const errorMessages = {
    "auth/email-already-in-use": "An account with this email already exists",
    "auth/invalid-email": "Invalid email address",
    "auth/operation-not-allowed": "Operation not allowed",
    "auth/weak-password": "Password is too weak. Use at least 6 characters",
    "auth/user-disabled": "This account has been disabled",
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/invalid-credential": "Invalid email or password",
    "auth/too-many-requests": "Too many attempts. Please try again later",
    "auth/popup-closed-by-user": "Sign in was cancelled",
    "auth/network-request-failed": "Network error. Please check your connection",
  };

  return errorMessages[errorCode] || "An error occurred. Please try again";
}

export default useAuth;
