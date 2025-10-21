import { useEffect, useState } from "react";
import { useExpedifyStore } from "../utils/useExpedifyStore";

interface Location {
  lat: number;
  lng: number;
}

export default function useRealtimeLocation() {
  const { notifPermission } = useExpedifyStore();
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    if (notifPermission == "denied") {
      console.error("Geolocation is access denied in this browser.");
      return;
    }
    // Start watching the user's position
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Location error:", err);
      },
      {
        enableHighAccuracy: true, // use GPS if available
        maximumAge: 1000,         // cache for 1s
        timeout: 10000,           // wait up to 10s
      }
    );

    // Cleanup when the component unmounts
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return location;
}
