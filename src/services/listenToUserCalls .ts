import {
    collection,
    query,
    where,
    onSnapshot,
    or,
    getDoc,
    doc,
  } from "firebase/firestore";
  import type { CallType } from "../utils/type";
  import type { UserData } from "../utils/type";
  import { db } from "../firebase";
  
  /**
   * Listen to all calls where the current user is either the owner or the target,
   * and populate the "target" user field with full user data.
   */
  export const listenToUserCalls = (
    currentUserId: string,
    callback: (calls: CallType[]) => void
  ) => {
    const callsRef = collection(db, "rooms");
  
    const q = query(
      callsRef,
      or(
        where("ownerID", "==", currentUserId),
        where("targetID", "==", currentUserId)
      )
    );
  
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const callPromises = snapshot.docs.map(async (docSnap) => {
        const callData = docSnap.data() as CallType;
        const callId = docSnap.id;
  
        // 🔍 Fetch target user info
        let targetUser: UserData | undefined;
        if (callData.targetID) {
          const targetRef = doc(db, "users", callData.targetID);
          const targetSnap = await getDoc(targetRef);
          if (targetSnap.exists()) {
            targetUser = targetSnap.data() as UserData;
          }
        }
  
        // 🔍 Fetch owner user info
        let ownerUser: UserData | undefined;
        if (callData.ownerID) {
          const ownerRef = doc(db, "users", callData.ownerID);
          const ownerSnap = await getDoc(ownerRef);
          if (ownerSnap.exists()) {
            ownerUser = ownerSnap.data() as UserData;
          }
        }
  
        return {
          id: callId,
          ...callData,
          target: targetUser,
          owner: ownerUser,
        } as CallType;
      });
  
      const calls = await Promise.all(callPromises);
      callback(calls);
    });
  
    return unsubscribe;
  };
  