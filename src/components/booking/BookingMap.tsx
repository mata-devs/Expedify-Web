import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

const BookingMap: React.FC<{ selectedBooking: any }> = ({ selectedBooking }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null); // 👈 Track the current marker

  // Initialize map once
  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [123.8854, 10.3157],
        zoom: 12,
      });
    }
  }, []);

  // Update marker on booking change
  useEffect(() => {
    if (!selectedBooking?.location || !mapRef.current) return;

    const { latitude, longitude } = selectedBooking.location;

    // 🧹 Remove previous marker if exists
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // 🗺️ Smooth fly to new location
    mapRef.current.flyTo({
      center: [longitude, latitude],
      zoom: 14,
      speed: 1.2,
      curve: 1.5,
      essential: true,
    });

    // 📍 Add new marker and save reference
    const newMarker = new mapboxgl.Marker({ color: "#FBBF24" })
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);

    markerRef.current = newMarker;
  }, [selectedBooking]);

  return <div ref={mapContainer} className="flex-1  " />;
};

export default BookingMap;
