import {
    collection,
    query,
    orderBy,
    startAt,
    endAt,
    onSnapshot,
    doc,
    getDoc,
  } from "firebase/firestore";
  import { db } from "../firebase";
  import * as geofire from "geofire-common"; 
import type { Booking, UserData } from "../utils/type";
  
  /**
   * Subscribe in real time to nearby Rush bookings (within 5 km)
   */
  export function subscribeNearbyRushBookings(
    lat: number,
    lng: number,
    callback: (bookings: Booking[]) => void,
    radiusInM = 500 // 5 km
  ) {
    const center = [lat, lng] as geofire.Geopoint;
    const bounds = geofire.geohashQueryBounds(center, radiusInM);
  
    const unsubscribers: (() => void)[] = [];
  
    bounds.forEach((b) => {
      const q = query(
        collection(db, "bookings"),
        orderBy("geohash"),
        startAt(b[0]),
        endAt(b[1])
      );
  
      const unsub = onSnapshot(q, async (snapshot) => {
        const nearbyRushBookings: Booking[] = [];
  
        for (const docSnap of snapshot.docs) {
          const data = docSnap.data() as Booking;
  
          // filter Rush + pending
          if (data.type !== "Rush" || data.status !== "pending") continue;
  
          const lat = data.location?.latitude;
          const lng = data.location?.longitude;
  
          if (lat != null && lng != null) {
            const distanceKm = geofire.distanceBetween(center, [lat, lng]);
            const distanceM = distanceKm * 1000;
  
            if (distanceM <= radiusInM) {
              // attach Client info
              let Client: UserData | undefined;
              if (data.clientId) {
                const clientRef = doc(db, "users", data.clientId);
                const clientDoc = await getDoc(clientRef);
                if (clientDoc.exists()) {
                  Client = { ...clientDoc.data(), uid: clientDoc.id } as UserData;
                }
              }
  
              nearbyRushBookings.push({
                ...data,
                id: docSnap.id,
                Client, 
                distanceKm
              });
            }
          }
        }
  
        callback(nearbyRushBookings);
      });
  
      unsubscribers.push(unsub);
    });
  
    // cleanup function
    return () => unsubscribers.forEach((unsub) => unsub());
  }
  