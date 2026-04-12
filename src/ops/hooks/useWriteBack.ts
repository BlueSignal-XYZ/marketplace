import { useCallback, useRef } from 'react';
import { auth } from '../firebase';
import { notifyRefresh } from './useFirebaseData';

const DB_URL = 'https://waterquality-trading-default-rtdb.firebaseio.com';

async function writeToRTDB(path: string, data: unknown): Promise<void> {
  const user = auth?.currentUser;
  if (!user) throw new Error('Not authenticated');

  const token = await user.getIdToken();
  const url = `${DB_URL}${path}.json?auth=${token}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RTDB write failed: ${res.status} ${text}`);
  }

  // Tell all useFirebaseData hooks watching this path to refetch
  notifyRefresh(path);
}

export function useWriteBack(path: string) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const write = useCallback(
    (data: unknown) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      return new Promise<void>((resolve, reject) => {
        timerRef.current = setTimeout(() => {
          writeToRTDB(path, data).then(resolve).catch(reject);
        }, 300);
      });
    },
    [path]
  );

  const writeImmediate = useCallback((data: unknown) => writeToRTDB(path, data), [path]);

  return { write, writeImmediate };
}
