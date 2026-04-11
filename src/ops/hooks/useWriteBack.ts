import { useCallback, useRef } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';

export function useWriteBack(path: string) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const write = useCallback(
    (data: unknown) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      return new Promise<void>((resolve, reject) => {
        timerRef.current = setTimeout(() => {
          set(ref(db, path), data).then(resolve).catch(reject);
        }, 300);
      });
    },
    [path]
  );

  const writeImmediate = useCallback((data: unknown) => set(ref(db, path), data), [path]);

  return { write, writeImmediate };
}
