import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

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
    if (!db) {
      console.error('[ops-rtdb] Database not initialized');
      setError(new Error('Database not initialized'));
      setLoading(false);
      return;
    }
    console.log('[ops-rtdb] Subscribing to:', path);
    const dbRef = ref(db, path);
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        let val = snapshot.val();
        console.log(
          '[ops-rtdb]',
          path,
          val === null ? 'NULL' : typeof val,
          val === null
            ? ''
            : Array.isArray(val)
              ? `array(${val.length})`
              : typeof val === 'object'
                ? `keys: ${Object.keys(val).slice(0, 3).join(',')}...`
                : val
        );
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
    return unsubscribe;
  }, [path]);

  return { data, loading, error };
}
