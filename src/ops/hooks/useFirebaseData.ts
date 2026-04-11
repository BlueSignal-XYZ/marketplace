import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';

interface FirebaseDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFirebaseData<T>(path: string): FirebaseDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db || !auth) {
      setError(new Error('Firebase not initialized'));
      setLoading(false);
      return;
    }

    // Wait for auth token to be ready before subscribing to RTDB.
    // Without this, onValue fires immediately with null because
    // the RTDB connection doesn't have the auth token yet.
    let unsubscribeDb: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Clean up previous RTDB subscription if any
      if (unsubscribeDb) {
        unsubscribeDb();
        unsubscribeDb = null;
      }

      if (!user) {
        setData(null);
        setLoading(false);
        return;
      }

      const dbRef = ref(db, path);
      unsubscribeDb = onValue(
        dbRef,
        (snapshot) => {
          let val = snapshot.val();
          // Firebase RTDB converts arrays to objects with numeric keys.
          // Convert back to arrays when all keys are sequential integers.
          if (val && typeof val === 'object' && !Array.isArray(val)) {
            const keys = Object.keys(val);
            const isNumericKeys = keys.every((k) => /^\d+$/.test(k));
            if (isNumericKeys && keys.length > 0) {
              val = keys.sort((a, b) => Number(a) - Number(b)).map((k) => val[k]);
            }
          }
          setData(val as T | null);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('[ops-rtdb] ERROR on', path, err.message);
          setError(err);
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDb) unsubscribeDb();
    };
  }, [path]);

  return { data, loading, error };
}
