import {
    collection,
    doc,
    addDoc,
    query,
    orderBy,
    limit,
    onSnapshot,
    startAfter,
    getDocs,
    serverTimestamp,
    updateDoc,
    type DocumentData,
    type QueryDocumentSnapshot,
    getFirestore,
    getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { sendPush } from "../utils/sendPush";
import type { ChatType, MessageType } from "../utils/type";

const PAGE_SIZE = 20;

/**
 * React Hook for real-time chat functionality
 * - Listens to messages in real-time
 * - Sends messages with push notifications
 * - Supports pagination (load older messages)
 */
export function useChat(chatId?: string) {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [chatData, setChatData] = useState<ChatType | null>(null);
    const [lastVisible, setLastVisible] =
        useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [text, setText] = useState("");

    const db = getFirestore();
    const auth = getAuth();
    const unsubRef = useRef<() => void | null>(null);

    // 🧠 Fetch chat metadata (clientID, photographerID, etc.)
    useEffect(() => {
        if (!chatId) return;

        const unsub = onSnapshot(doc(db, "chats", chatId), (snap) => {
            if (snap.exists()) {
                setChatData(snap.data() as ChatType);
            } else {
                setChatData(null);
            }
        });

        return unsub;
    }, [chatId]);

    /** ✉️ Send Message + Push Notification */
    const sendMessage = async () => {
        if (!text.trim() || !chatId) return;

        const currentUser = auth.currentUser;
        if (!currentUser) return;

        // Add message to Firestore subcollection
        const msgRef = collection(db, "chats", chatId, "messages");
        await addDoc(msgRef, {
            text,
            senderId: currentUser.uid,
            createdAt: serverTimestamp(),
        });

        // Update main chat for sidebar sorting
        await updateDoc(doc(db, "chats", chatId), {
            lastMessage: text,
            lastMessageTime: serverTimestamp(),
        });

        // 🔔 Send push notification to other participant
        try {
            const otherUserId =
                chatData?.clientID === currentUser.uid
                    ? chatData?.photographerID
                    : chatData?.clientID;

            if (otherUserId) {
                // Fetch other user info to get FCM token 
                const clientRef = doc(db, "users", otherUserId);
                const clientSnap = await getDoc(clientRef);
                const fcmToken = clientSnap?.data()?.fcmToken;
                const fullname = clientSnap?.data()?.fullname || "New Message";

                console.log(fcmToken);
                if (fcmToken) {
                    await sendPush(fcmToken, fullname, text);
                }
            }
        } catch (err) {
            console.error("Push send error:", err);
        }

        setText("");
    };

    /** 📥 Real-time listener for latest 20 messages */
    useEffect(() => {
        if (!chatId) return;

        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("createdAt", "desc"), limit(PAGE_SIZE));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const fetched: MessageType[] = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        text: data.text ?? "",
                        senderId: data.senderId ?? "",
                        createdAt: data.createdAt?.toDate?.() ?? "",
                    };
                });

                const ordered = fetched.reverse();
                setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
                setMessages(ordered);
            } else {
                setMessages([]);
            }
        });

        unsubRef.current = unsubscribe;
        return () => unsubscribe();
    }, [chatId]);

    /** 📜 Load older messages (pagination) */
    const loadMoreMessages = async () => {
        if (!chatId || !lastVisible || !hasMore || loadingMore) return;

        setLoadingMore(true);
        try {
            const q = query(
                collection(db, "chats", chatId, "messages"),
                orderBy("createdAt", "desc"),
                startAfter(lastVisible),
                limit(PAGE_SIZE)
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const fetched: MessageType[] = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        text: data.text ?? "",
                        senderId: data.senderId ?? "",
                        createdAt: data.createdAt?.toDate?.() ?? "",
                    };
                });

                setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
                setMessages((prev) => [...fetched.reverse(), ...prev]);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Load more error:", error);
        }
        setLoadingMore(false);
    };

    return {
        chatData,
        messages,
        text,
        setText,
        sendMessage,
        loadMoreMessages,
        hasMore,
        loadingMore,
    };
}
