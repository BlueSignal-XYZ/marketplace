import { collection, query, onSnapshot } from "firebase/firestore";
import { getFirestoreInstance } from "../apis/firebase";

export const listenToEvent = async (eventKey, callback) => {
  const db = await getFirestoreInstance();
  if (!db) {
    console.error("[listenToEvent] Firestore not available — skipping listener for:", eventKey);
    return () => {};
  }
  const q = query(collection(db, eventKey));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const resultEvents = [];
    querySnapshot.forEach((doc) => {
      resultEvents.push(doc.data());
    });
    callback?.(resultEvents);
  }, (error) => {
    console.error(`[listenToEvent] Snapshot error for "${eventKey}":`, error.code, error.message);
  });

  return unsubscribe;
};
