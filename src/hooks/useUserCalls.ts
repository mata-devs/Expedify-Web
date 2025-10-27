import { useEffect, useState } from "react"; 
import type { CallType } from "../utils/type";
import { auth } from "../firebase";
import { listenToUserCalls } from "../services/listenToUserCalls ";

export default function useUserCalls() {
  const [calls, setCalls] = useState<CallType[]>([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const unsubscribe = listenToUserCalls(userId, (data) => {
      setCalls(data);
    });

    return () => unsubscribe();
  }, []);

  return calls;
}
