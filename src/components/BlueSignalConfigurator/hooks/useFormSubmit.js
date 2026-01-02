// useFormSubmit - Hook for submitting forms to Firestore
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore, isFirebaseConfigured } from '../../../apis/firebase';

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
    // Check if Firestore is configured
    if (!isFirebaseConfigured || !firestore) {
      console.warn('Firebase not configured - form submission disabled');
      setFormState({
        status: 'error',
        error: 'Form submission is currently unavailable. Please try again later.',
      });
      return false;
    }

    setFormState({ status: 'submitting', error: null });

    try {
      await addDoc(collection(firestore, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        source: window.location.pathname,
        userAgent: navigator.userAgent,
      });

      setFormState({ status: 'success', error: null });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      console.error('Form submission error:', err);
      setFormState({ status: 'error', error: message });
      return false;
    }
  };

  const reset = () => setFormState({ status: 'idle', error: null });

  return { formState, submitForm, reset };
};

export default useFormSubmit;
