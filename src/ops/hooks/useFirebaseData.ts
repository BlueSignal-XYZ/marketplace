import { useState, useEffect } from 'react';
import { auth } from '../firebase';

const DB_URL = 'https://waterquality-trading-default-rtdb.firebaseio.com';

interface FirebaseDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Global event emitter so edits (via useWriteBack) can trigger refetches
// in all useFirebaseData hooks watching the same path.
type Listener = () => void;
const listeners: Map<string, Set<Listener>> = new Map();

export function notifyRefresh(path: string) {
  listeners.get(path)?.forEach((fn) => fn());
}

export function useFirebaseData<T>(path: string): FirebaseDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const user = auth?.currentUser;
        if (!user) {
          setData(null);
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();
        const url = `${DB_URL}${path}.json?auth=${token}`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`RTDB fetch failed: ${res.status} ${res.statusText}`);
        }

        let val = await res.json();

        // Firebase RTDB converts arrays to objects with numeric keys.
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          const keys = Object.keys(val);
          const isNumericKeys = keys.every((k) => /^\d+$/.test(k));
          if (isNumericKeys && keys.length > 0) {
            val = keys.sort((a, b) => Number(a) - Number(b)).map((k) => val[k]);
          }
        }

        if (!cancelled) {
          setData(val as T | null);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        console.error('[ops-rtdb] Error fetching', path, err);
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    }

    fetchData();

    // Register listener for this path
    const refresh = () => {
      if (!cancelled) fetchData();
    };
    if (!listeners.has(path)) listeners.set(path, new Set());
    listeners.get(path)!.add(refresh);

    return () => {
      cancelled = true;
      listeners.get(path)?.delete(refresh);
    };
  }, [path]);

  return { data, loading, error };
}
