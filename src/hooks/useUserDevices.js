// /src/hooks/useUserDevices.js
/**
 * Hook for detecting if user has registered devices.
 * Used for returning user flow - directs users with devices to Dashboard,
 * new users to Onboarding.
 *
 * Uses localStorage cache for instant initial render, with backend/mock API
 * as source of truth.
 */

import { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import CloudMockAPI from "../services/cloudMockAPI";
import { DeviceAPI } from "../scripts/back_door";

// Cache key for localStorage
const CACHE_KEY = "bluesignal_has_devices";
const CACHE_COUNT_KEY = "bluesignal_device_count";

// Use mock API in development, real API in production
const USE_MOCK_API = import.meta.env.DEV || import.meta.env.VITE_USE_MOCK_API === "true";

/**
 * Clear the device cache (call on logout)
 */
export const clearDeviceCache = () => {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_COUNT_KEY);
};

/**
 * Hook to check if user has devices
 * @returns {{ devices: Array, hasDevices: boolean, deviceCount: number, isLoading: boolean, error: Error|null, refetch: Function }}
 */
export function useUserDevices() {
  const { STATES } = useAppContext();
  const { user } = STATES || {};

  // Read cache for instant initial state (avoids flash of wrong UI)
  const cachedHasDevices = localStorage.getItem(CACHE_KEY);
  const cachedCount = localStorage.getItem(CACHE_COUNT_KEY);

  const [devices, setDevices] = useState([]);
  const [hasDevices, setHasDevices] = useState(cachedHasDevices === "true");
  const [deviceCount, setDeviceCount] = useState(
    cachedCount ? parseInt(cachedCount, 10) : 0
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch devices from API and update state + cache
   */
  const fetchDevices = useCallback(async () => {
    if (!user?.uid) {
      setIsLoading(false);
      setDevices([]);
      setHasDevices(false);
      setDeviceCount(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let deviceList = [];

      if (USE_MOCK_API) {
        // Use mock API for development
        deviceList = await CloudMockAPI.devices.getAll();
      } else {
        // Use real backend API
        const response = await DeviceAPI.getDevices();
        deviceList = response?.devices || response || [];
      }

      // Ensure deviceList is an array
      if (!Array.isArray(deviceList)) {
        deviceList = [];
      }

      const count = deviceList.length;
      const userHasDevices = count > 0;

      setDevices(deviceList);
      setHasDevices(userHasDevices);
      setDeviceCount(count);

      // Update cache
      localStorage.setItem(CACHE_KEY, String(userHasDevices));
      localStorage.setItem(CACHE_COUNT_KEY, String(count));
    } catch (err) {
      console.error("Error fetching user devices:", err);
      setError(err);
      // Don't clear existing state on error - keep showing cached data
      // Only set hasDevices to false if we had no cache
      if (cachedHasDevices === null) {
        setHasDevices(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, cachedHasDevices]);

  // Fetch on mount and when user changes
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    hasDevices,
    deviceCount,
    isLoading,
    error,
    refetch: fetchDevices,
  };
}

export default useUserDevices;
