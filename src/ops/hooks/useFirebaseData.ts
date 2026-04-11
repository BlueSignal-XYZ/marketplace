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
    const dbRef = ref(db, path);
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        setData(snapshot.val() as T | null);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [path]);

  return { data, loading, error };
}
