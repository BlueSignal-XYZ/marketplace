/**
 * useApi — Generic hook for API data fetching with loading/error/data pattern.
 * Provides consistent state management for any async API call.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi(() => getPortfolio(userId), [userId]);
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export function useApi(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const callIdRef = useRef(0);

  const fetchData = useCallback(async () => {
    const id = ++callIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const result = await apiFn();
      if (mountedRef.current && id === callIdRef.current) {
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current && id === callIdRef.current) {
        setError(err?.message || 'An error occurred');
      }
    } finally {
      if (mountedRef.current && id === callIdRef.current) {
        setLoading(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => { mountedRef.current = false; };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
