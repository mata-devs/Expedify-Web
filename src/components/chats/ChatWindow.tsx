import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/useChat";
import type { CombinedChat } from "./ChatSidebar";
import { auth } from "../../firebase";
import { Timestamp } from "firebase/firestore";

interface Props {
  selectedClient: CombinedChat | null;
  onCallStart: () => void;
}

/** 🕒 Utility: Format Firestore timestamp into human-readable */
function formatTimestamp(timestamp: Timestamp | Date | null | undefined): string {
  if (!timestamp) return "";
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1)
    return `Yesterday ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  if (diffDay < 7)
    return `${date.toLocaleDateString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    })}`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    hour: "numeric",
    minute: "2-digit",
  });
}

const ChatWindow: React.FC<Props> = ({ selectedClient, onCallStart }) => {
  const bookingId = `${selectedClient?.clientID}${selectedClient?.photographerID}`;
  const otherUser = selectedClient?.otherUser;
  const { messages, text, setText, sendMessage } = useChat(bookingId); 
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
 

  if (!selectedClient) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a chat to start messaging.
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-white border-r">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <button onClick={onCallStart} className="text-yellow-500 text-xl">
            📞
          </button>
          <p className="font-semibold">{otherUser?.fullname}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((m, i) => {
          const isMine = m.senderId === auth.currentUser?.uid;
          const createdAt =
            (m.createdAt as any)?.toDate?.() ??
            (m.createdAt instanceof Date ? m.createdAt : null);

          return (
            <div
              key={i}
              onClick={() =>
                setSelectedMsgId(selectedMsgId === `${i}` ? null : `${i}`)
              }
              className={`my-2 flex flex-col ${
                isMine ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[60%] cursor-pointer transition ${
                  isMine
                    ? "bg-yellow-400 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {m.text}
              </div>

              {/* Show formatted date if clicked */}
              {selectedMsgId === `${i}` && createdAt && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimestamp(createdAt)}
                </p>
              )}
            </div>
          );
        })} 
      </div>

      {/* Input */}
      <div className="flex items-center border-t p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-yellow-400 text-white rounded-full px-4 py-2 font-semibold hover:bg-yellow-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
