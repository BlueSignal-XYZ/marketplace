// useFormSubmit - Hook for submitting forms to Firestore
import { useState } from 'react';
import { isFirebaseConfigured, getFirestoreInstance } from '../../../apis/firebase';

/**
 * Hook for submitting form data to Firestore
 * @param {string} collectionName - The Firestore collection to write to
 * @returns {Object} - { formState, submitForm, reset }
 */
const useFormSubmit = (collectionName) => {
  const [formState, setFormState] = useState({
    status: 'idle', // 'idle' | 'submitting' | 'success' | 'error'
    error: null,
  });

  const submitForm = async (data) => {
    if (!isFirebaseConfigured) {
      setFormState({
        status: 'error',
        error: 'Form submission is currently unavailable. Please try again later.',
      });
      return false;
    }

    setFormState({ status: 'submitting', error: null });

    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const db = await getFirestoreInstance();
      if (!db) {
        throw new Error(
          'Firestore is not available — Firebase may not be configured. Check VITE_FIREBASE_* env vars.'
        );
      }
      await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        source: window.location.pathname,
        userAgent: navigator.userAgent,
      });

      setFormState({ status: 'success', error: null });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      console.error(
        `[useFormSubmit] Error writing to Firestore collection "${collectionName}":`,
        err.code || '',
        message
      );
      setFormState({ status: 'error', error: message });
      return false;
    }
  };

  const reset = () => setFormState({ status: 'idle', error: null });

  return { formState, submitForm, reset };
};

export default useFormSubmit;
