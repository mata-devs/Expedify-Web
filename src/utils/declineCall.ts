import {
    doc,
    collection,
    getDocs,
    deleteDoc,
  } from "firebase/firestore";
  import { db } from "../firebase";
  
  /**
   * Completely declines a call — deletes the room and its subcollections.
   */
  export async function declineCall(callId: string) {
    try {
      console.log("🚫 Declining and deleting call:", callId);
  
      const callRef = doc(db, "rooms", callId);
  
      // 🔹 Delete all ICE candidates subcollections first
      const subcollections = ["callerCandidates", "calleeCandidates"];
      for (const sub of subcollections) {
        const colRef = collection(db, `rooms/${callId}/${sub}`);
        const snapshot = await getDocs(colRef);
        const deletions = snapshot.docs.map((d) => deleteDoc(d.ref));
        await Promise.all(deletions);
      }
  
      // 🔹 Delete the main room document
      await deleteDoc(callRef);
  
      console.log("✅ Call declined and fully deleted from Firestore.");
    } catch (error) {
      console.error("❌ Error declining call:", error);
    }
  }
  