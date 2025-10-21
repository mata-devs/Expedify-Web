import React, { useEffect, useState } from "react";
import type { Booking, ChatType } from "../../utils/type";



interface Props {
  client: ChatType | null;
  onClose: () => void;
}

const ChatCallOverlay: React.FC<Props> = ({ client, onClose }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <button onClick={onClose} className="absolute top-5 left-5 text-white text-2xl">
        ✕
      </button>
      <img
        src={client?.Client?.photoURL}
        alt={client?.Client?.fullname}
        className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-yellow-400"
      />
      <p className="text-white text-lg font-semibold">{client?.Client?.fullname}</p>
      <p className="text-gray-300 text-sm mt-1">{formatTime(seconds)}</p>
      <div className="flex gap-6 mt-8">
        <button className="bg-red-600 text-white rounded-full p-4 text-xl">📞</button>
        <button className="bg-gray-600 text-white rounded-full p-4">🎤</button>
        <button className="bg-gray-600 text-white rounded-full p-4">🔇</button>
      </div>
    </div>
  );
};

export default ChatCallOverlay;
