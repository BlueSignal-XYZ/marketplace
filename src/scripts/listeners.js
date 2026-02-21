import { collection, query, onSnapshot } from "firebase/firestore";

// Example: Listen to real-time updates for {event: string}
export const listenToEvent = (eventKey, callback) => {
  const q = query(collection(db, eventKey));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const resultEvents = [];
    querySnapshot.forEach((doc) => {
      resultEvents.push(doc.data());
    });
    // result events updated
    // Update your UI with the new events
    callback?.(resultEvents)
  });

  return unsubscribe; // Call unsubscribe() to stop listening when component unmounts
};
