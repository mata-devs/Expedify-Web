import {
  collection, doc, updateDoc, addDoc, onSnapshot, getDoc
} from "firebase/firestore";
import { db } from "../firebase";

export async function acceptCall(callId: string, localStream: MediaStream) {
  const callRef = doc(db, "rooms", callId);

  const pc = new RTCPeerConnection({
    iceServers: [{
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ]
    }],
    iceCandidatePoolSize: 10,
    
  });

  // Add local tracks
  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  // Prepare remote stream
  const remoteStream = new MediaStream();
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
  };

  // ICE exchange
  const answerCandidatesRef = collection(db, `rooms/${callId}/calleeCandidates`);
  const offerCandidatesRef = collection(db, `rooms/${callId}/callerCandidates`);

  pc.onicecandidate = async (event) => {
    if (event.candidate) await addDoc(answerCandidatesRef, event.candidate.toJSON());
  };

  onSnapshot(offerCandidatesRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const candidate = new RTCIceCandidate(change.doc.data());
        pc.addIceCandidate(candidate);
      }
    });
  });

  // Load offer
  const callSnap = await getDoc(callRef);
  const callData = callSnap.data();
  if (!callData?.offer) throw new Error("No offer found");
  await pc.setRemoteDescription(new RTCSessionDescription(callData.offer));

  // Create + upload answer
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  await updateDoc(callRef, {
    answer: { type: answer.type, sdp: answer.sdp },
    status: "ongoing",
  });

  return { pc, remoteStream };
}
