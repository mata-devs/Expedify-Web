import React, { useEffect, useState } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
  getDoc,
  doc,
  limit,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { ChatType, UserData, MessageType } from "../../utils/type";

export interface CombinedChat extends ChatType {
  otherUser?: UserData;
  lastMessage?: string;
  lastMessageTime?: Date | null;
}

interface Props {
  selectedClient: CombinedChat | null;
  setSelectedClient: (client: CombinedChat) => void;
}

const ChatSidebar: React.FC<Props> = ({ selectedClient, setSelectedClient }) => {
  const [chats, setChats] = useState<CombinedChat[]>([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const q = query(
      collection(db, "chats"),
      where("photographerID", "==", currentUser.uid)
    );

    const unsub = onSnapshot(q, async (snap) => {
      const chatDocs: CombinedChat[] = [];
      console.log(snap.size);
      for (const docSnap of snap.docs) {
        const chat = docSnap.data() as ChatType;
        const chatId = docSnap.id;

        const otherUserId =
          chat.clientID === currentUser.uid ? chat.photographerID : chat.clientID;

        // Fetch other user's info
        const otherUserRef = doc(db, "users", otherUserId);
        const otherUserSnap = await getDoc(otherUserRef);

        // Fetch latest message (limit 1)
        const msgQuery = query(
          collection(db, "chats", chatId, "messages"),
          orderBy("createdAt", "desc"),
          limit(1)
        );

        const msgSnap = await getDocs(msgQuery);
        let lastMessage = "";
        let lastMessageTime: Date | null = null;

        if (!msgSnap.empty) {
          const msg = msgSnap.docs[0].data() as MessageType;
          lastMessage = msg.text;
          if (msg.createdAt && (msg.createdAt as any).toDate)
            lastMessageTime = (msg.createdAt as any).toDate();
        }

        chatDocs.push({
          ...chat,
          otherUser: otherUserSnap.exists()
            ? (otherUserSnap.data() as UserData)
            : undefined,
          lastMessage,
          lastMessageTime,
        });
      }

      // Sort chats by last message time (newest first)
      chatDocs.sort(
        (a, b) =>
          (b.lastMessageTime?.getTime() || 0) -
          (a.lastMessageTime?.getTime() || 0)
      );

      setChats(chatDocs);
      setLoading(false);
    });

    return unsub;
  }, []);

  if (loading)
    return (
      <div className="w-[320px] flex items-center justify-center text-gray-500">
        Loading chats...
      </div>
    );

  return (
    <div className="w-[320px] bg-white border-x border-gray-300 flex flex-col">
      {/* 🔍 Search Bar */}
      <div className="p-4 border-b border-gray-300">
        <input
          type="text"
          placeholder="Search Chat"
          className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
        />
      </div>

      {/* 💬 Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length > 0 ? (
          chats.map((c) => (
            <div
              key={c.photographerID + c.clientID}
              onClick={() => setSelectedClient(c)}
              className={`flex items-center gap-3 p-3 cursor-pointer border-b hover:bg-yellow-50 ${selectedClient?.photographerID === c.photographerID &&
                  selectedClient?.clientID === c.clientID
                  ? "bg-yellow-100"
                  : ""
                }`}
            >
              <img
                src={c.otherUser?.photoURL || "/placeholder.png"}
                alt={c.otherUser?.fullname}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {c.otherUser?.fullname || "Unknown User"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {c.lastMessage || "No messages yet"}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                {c.lastMessageTime
                  ? new Date(c.lastMessageTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })
                  : ""}
              </p>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            No chats found
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
