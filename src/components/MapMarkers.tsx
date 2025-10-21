import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl"; 
import type { Booking } from "../utils/type";

interface MapMarkersProps {
  map: mapboxgl.Map | null;
  nearbyBookings: Booking[];
}

const MapMarkers: React.FC<MapMarkersProps> = ({ map, nearbyBookings }) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!map) return;

    // ✅ Clear existing markers first
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // ✅ Add new markers
    nearbyBookings.forEach((booking) => {
      if (!booking.location) return;

      const marker = new mapboxgl.Marker({ color: "#f32a0b" })
        .setLngLat([
          booking.location.longitude,
          booking.location.latitude,
        ])
        .setPopup(
          new mapboxgl.Popup({ offset: 12 }).setHTML(`
            <div class="text-sm font-medium">
              📸 <strong>${booking.Client?.fullname || "Unknown"}</strong><br/>
              ₱${booking.price?.toLocaleString("en-PH")}<br/>
              ${booking.distanceKm?.toFixed(2)} km away
            </div>
          `)
        )
        .addTo(map);

      markersRef.current.push(marker);
    });

    // ✅ Cleanup when component unmounts or before re-render
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [nearbyBookings, map]);

  return null; // component doesn’t render UI
};

export default MapMarkers;
