import React, { useEffect, useRef, useState } from "react";
import type { CallType } from "../../utils/type";
import { acceptCall } from "../../utils/acceptCall";
import { endCall } from "../../utils/endCall";
import { declineCall } from "../../utils/declineCall";

interface Props {
  client: CallType | null;
  onClose: () => void;
  onEnd?: () => void;
}

const ChatCallOverlay: React.FC<Props> = ({ client, onClose, onEnd }) => {
  const [seconds, setSeconds] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

  // ⏱️ Timer only runs when call is ongoing
  useEffect(() => {
    if (client?.status !== "ongoing") return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [client?.status]);
  const handleAccept = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const { pc, remoteStream } = await acceptCall(client.id!, localStream);
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
  };

  const handleEnd = async () => {
    peerConnection?.close();
    localStream?.getTracks().forEach((t) => t.stop());
    if (client?.id)
      await endCall({
        callId: client?.id,
        pc: peerConnection,
        localStream,
      });
    onEnd?.();
  };
  const handleDecline = async () => {
    if (!client?.id) return;
    await declineCall(client.id);
    onClose(); // hide overlay
  };
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // 🧩 Conditional UI
  const renderContent = () => {
    if (!client) return null;

    switch (client.status) {
      case "calling":
        return (
          <>
            <p className="text-gray-300 text-sm mb-8">
              Incoming {client.method} Call...
            </p>
            <div className="flex gap-8">
              <button
                onClick={handleAccept}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full p-6 text-2xl shadow-lg"
              >
                ✅
              </button>
              <button
                onClick={handleDecline}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-6 text-2xl shadow-lg"
              >
                ❌
              </button>
            </div>
          </>
        );

      case "ongoing":
        return (
          <>
            <p className="text-gray-300 text-sm mt-1">{formatTime(seconds)}</p>
            <div className="flex gap-6 mt-8">
              <button
                onClick={handleEnd}
                className="bg-red-600 text-white rounded-full p-5 text-xl shadow-md"
              >
                📞
              </button>
              <button className="bg-gray-600 text-white rounded-full p-5 shadow-md">
                🎤
              </button>
              <button className="bg-gray-600 text-white rounded-full p-5 shadow-md">
                🔇
              </button>
            </div>
          </>
        );

      case "ended":
        return (
          <>
            <p className="text-gray-300 text-sm mb-8">Call Ended</p>
            <button
              onClick={onClose}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg shadow-md"
            >
              Close
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 text-center">
      <button
        onClick={handleDecline}
        className="absolute top-5 left-5 text-white text-2xl"
      >
        ✕
      </button>

      {/* Remote Video (Full Screen) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Local Video (Small PIP window) */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="absolute bottom-6 right-6 w-32 h-40 rounded-lg border-2 border-yellow-400 object-cover shadow-lg"
      />

      {/* Overlay content */}
      <div className="relative z-10 mt-auto mb-10">
        {client?.target?.photoURL && client.status === "calling" && (
          <img
            src={client.target.photoURL}
            alt={client.target.fullname}
            className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-yellow-400"
          />
        )}
        <p className="text-white text-lg font-semibold">
          {client?.target?.fullname}
        </p>
        {renderContent()}
      </div>
    </div>
  );
};

export default ChatCallOverlay;
