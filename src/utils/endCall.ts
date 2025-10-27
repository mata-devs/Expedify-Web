import {
    doc,
    deleteDoc,
    getDocs,
    collection,
    updateDoc,
  } from "firebase/firestore";
  import { db } from "../firebase";
  
  /**
   * Ends the WebRTC call by closing peer connection,
   * stopping streams, and cleaning up Firestore.
   */
  export async function endCall({
    callId,
    pc,
    localStream,
  }: {
    callId: string;
    pc?: RTCPeerConnection | null;
    localStream?: MediaStream | null;
  }) {
    try {
      console.log("📞 Ending call...");
  
      // 1️⃣ Stop local media tracks
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
  
      // 2️⃣ Close peer connection
      if (pc) {
        pc.ontrack = null;
        pc.onicecandidate = null;
        pc.onconnectionstatechange = null;
        pc.close();
      }
  
      // 3️⃣ Update Firestore call status
      const callRef = doc(db, "rooms", callId);
      await updateDoc(callRef, { status: "ended" });
  
      // 4️⃣ Optional cleanup: delete ICE candidates
      const callerCandidates = await getDocs(
        collection(db, `rooms/${callId}/callerCandidates`)
      );
      const calleeCandidates = await getDocs(
        collection(db, `rooms/${callId}/calleeCandidates`)
      );
  
      const deletions = [
        ...callerCandidates.docs.map((d) => deleteDoc(d.ref)),
        ...calleeCandidates.docs.map((d) => deleteDoc(d.ref)),
      ];
      await Promise.all(deletions);
  
      console.log("✅ Call ended and cleaned up.");
    } catch (err) {
      console.error("❌ Error ending call:", err);
    }
  }
  