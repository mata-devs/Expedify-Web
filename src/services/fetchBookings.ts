import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Booking, UserData } from "../utils/type";
 

export const fetchBookingsRealtime = (
  userId: string,
  role: "photographer" | "client",
  onUpdate: (bookings: Booking[]) => void,
  onError?: (error: any) => void
) => {
  try {
    // ✅ Choose the right Firestore field
    const field = role === "photographer" ? "photographerId" : "clientId";

    const q = query(collection(db, "bookings"), where(field, "==", userId));

    // 🔄 Realtime listener
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const bookings: Booking[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Booking, "id">),
          }));

          // 🔍 Fetch client user data for each booking
          const bookingsWithClient = await Promise.all(
            bookings.map(async (booking) => {
              try {
                if(!booking.clientId){

                  return {...booking};
                }
                const clientRef = doc(db, "users", booking.clientId);
                const clientSnap = await getDoc(clientRef);

                if (clientSnap.exists()) {
                  const clientData = clientSnap.data() as UserData;
                  return {
                    ...booking,
                    Client: { id: clientSnap.id, ...clientData },
                  };
                } else {
                  return { ...booking, Client: null };
                }
              } catch (err) {
                console.error("Error fetching client:", err);
                return { ...booking, Client: null };
              }
            })
          );

          onUpdate(bookingsWithClient);
        } catch (err) {
          console.error("❌ Error mapping bookings:", err);
          onError?.(err);
        }
      },
      (error) => {
        console.error("❌ Firestore booking listener error:", error);
        onError?.(error);
      }
    );

    return unsubscribe; // clean up on unmount
  } catch (error) {
    console.error("❌ Failed to initialize booking listener:", error);
    onError?.(error);
    return () => {}; // safe fallback cleanup
  }
};
