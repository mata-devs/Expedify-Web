import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Booking } from "../../utils/type";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

const BookingMap: React.FC<{ selectedBooking: Booking | null }> = ({ selectedBooking }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<mapboxgl.Marker[]>([]); // ✅ Always an array (no null)

  // Initialize the map once
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

  // Update markers when booking changes
  useEffect(() => {

    if(!selectedBooking){

      markerRef.current.forEach((marker) => marker.remove());
      markerRef.current = [];
    }
    if (!selectedBooking?.location || !mapRef.current) return;

    // 🧹 Remove all existing markers

    // 🗺️ Add markers for the new booking
    selectedBooking.location.forEach((point) => {
      const { latitude, longitude } = point.location;

      // Fly to first location only 
      mapRef.current?.flyTo({
        center: [longitude, latitude],
        zoom: 14,
        speed: 1.2,
        curve: 1.5,
        essential: true,
      });
      const newMarker = new mapboxgl.Marker({ color: "#FBBF24" })
        .setLngLat([longitude, latitude])
        .addTo(mapRef.current!);

      markerRef.current.push(newMarker);
    });
  }, [selectedBooking]);

  return <div ref={mapContainer} className="flex-1" />;
};

export default BookingMap;
