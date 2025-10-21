import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import mascot from "../assets/gecko.png";
import "mapbox-gl/dist/mapbox-gl.css";
import { useExpedifyStore } from "../utils/useExpedifyStore";
import { logout } from "../utils/logout";
import { useNavigate } from "react-router-dom";
import { radius } from "../App";
import CardCarousel, { MAPBOX_TOKEN } from "../components/CardCarousel";
import { type Booking } from "../utils/type";
import BookingRequestCard from "../components/booking/BookingRequestCard";
import LoadingScreen from "../components/LoadingScreen";
import MyBookings, { type StatusBooking } from "../components/MyBookings";
import ChatLayout from "../components/chats/ChatLayout";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

const createCircle = (center: [number, number], radiusMeters: number, points = 64) => {
    const coords = { latitude: center[1], longitude: center[0] };
    const km = radiusMeters / 1000;
    const ret = [];
    const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
    const distanceY = km / 110.574;

    for (let i = 0; i < points; i++) {
        const theta = (i / points) * (2 * Math.PI);
        const x = distanceX * Math.cos(theta);
        const y = distanceY * Math.sin(theta);
        ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]); // close loop
    return {
        type: "Feature",
        geometry: { type: "Polygon", coordinates: [ret] },
    };
};

const Dashboard: React.FC = () => {
    const { userData, location, nearbyBookings, mybookings, bookings, RushBooking } = useExpedifyStore();
    const navigate = useNavigate();
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [activeTab, setActiveTab] = useState<StatusBooking>("Scheduled");
    const [currentTab, setCurrentTabs] = useState<"current" | "bookings" | "chat" | "menu">("current");
    const handleLogout = async () => {
        await logout();
        navigate("/signin");
    };

    // ✅ Initialize Map

    useEffect(() => {
        if (!location || !RushBooking?.location) return;
        if (currentTab !== "current") return;

        let map = mapRef.current;

        if (!map) {
            map = new mapboxgl.Map({
                container: "maps",
                style: "mapbox://styles/mapbox/streets-v12",
                center: [location.lng, location.lat],
                zoom: 13,
                attributionControl: false,
            });
            mapRef.current = map;
        }

        // 📍 User marker
        const userMarker = new mapboxgl.Marker({ color: "#f59e0b" })
            .setLngLat([location.lng, location.lat])
            .addTo(map);

        // 🎯 Destination marker
        const destMarker = new mapboxgl.Marker({ color: "#CC0000" })
            .setLngLat([
                RushBooking.location.longitude,
                RushBooking.location.latitude,
            ])
            .addTo(map);

        // 🧭 Controls
        const nav = new mapboxgl.NavigationControl({ showCompass: true });
        map.addControl(nav, "bottom-right");

        // 📡 Fetch driving route from Mapbox Directions API
        const getRoute = async () => {
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${location.lng},${location.lat};${RushBooking.location.longitude},${RushBooking.location.latitude}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;

            const response = await fetch(url);
            const data = await response.json();

            if (!data.routes || data.routes.length === 0) return;
            const route = data.routes[0].geometry;

            // Add the route as a GeoJSON line
            const routeData = {
                type: "Feature",
                properties: {},
                geometry: route,
            };

            // Add or update route source
            if (map.getSource("route")) {
                (map.getSource("route") as mapboxgl.GeoJSONSource).setData(routeData);
            } else {
                map.addSource("route", {
                    type: "geojson",
                    data: routeData,
                    mapbox_logo:false,
                });

                map.addLayer({
                    id: "route-line",
                    type: "line",
                    source: "route",
                    layout: {
                        "line-join": "round",
                        "line-cap": "round",
                    },
                    paint: {
                        "line-color": "#2563eb",
                        "line-width": 5,
                    },
                });
            }

            // Fit map bounds around the route
            const bounds = new mapboxgl.LngLatBounds();
            route.coordinates.forEach((coord: [number, number]) => bounds.extend(coord));
            map.fitBounds(bounds, { padding: 60 });
        };

        map.on("load", getRoute);

        return () => {
            const map = mapRef.current;
            if (!map) return;

            // 🔹 Remove route layer first (order matters)
            if (map.getLayer("route-line")) {
                map.removeLayer("route-line");
            }

            // 🔹 Then remove the route source
            if (map.getSource("route")) {
                map.removeSource("route");
            }

            // 🔹 Optional: remove markers you created manually
            // (only if you stored them in refs)
            // userMarkerRef.current?.remove();
            // destMarkerRef.current?.remove();

            // 🔹 Finally remove the map instance
            map.remove();
            mapRef.current = null;
        };

    }, [location, currentTab, RushBooking]);


    // ✅ Add & cleanup booking markers
    useEffect(() => {
        if (currentTab != "current") return;
        const map = mapRef.current;
        if (!map) return;

        // 🧹 Remove existing markers
        const getsetMap = () => {

            markersRef.current.forEach((m) => m.remove());
            markersRef.current = [];

            // 🆕 Add new ones
            nearbyBookings?.forEach((booking) => {
                if (!booking.location) return;

                const marker = new mapboxgl.Marker({ color: "#f32a0b" })
                    .setLngLat([booking.location.longitude, booking.location.latitude])
                    .setPopup(
                        new mapboxgl.Popup({ offset: 10 }).setHTML(`
            <div class="text-sm font-medium">
              ⚡ <strong>${booking.Client?.fullname || "Unknown"}</strong><br/>
              ₱${booking.price?.toLocaleString("en-PH")}<br/>
              ${booking.distanceKm?.toFixed(2)} km away
            </div>
          `)
                    )
                    .addTo(map);

                markersRef.current.push(marker);
            });

            return () => {
                markersRef.current.forEach((m) => m.remove());
                markersRef.current = [];
            };
        }
        getsetMap();
    }, [nearbyBookings, currentTab]);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* 📸 Left Sidebar */}
            <div className="w-80 bg-white flex flex-col justify-between">
                <div className="flex flex-col mb-6 flex-1 p-4 mt-10">
                    <img
                        src={userData?.photoURL || "https://via.placeholder.com/120"}
                        alt="profile"
                        className="rounded-full mx-auto w-32 h-32 object-cover mb-3 border-4 border-white"
                    />
                    <h3 className="text-lg font-semibold py-2 capitalize">
                        {userData?.fullname || "Photographer name"}
                    </h3>
                    <p className="text-sm opacity-80 py-2">
                        {userData?.phoneNumber
                            ? `+63 ${userData.phoneNumber
                                .replace(/^0/, "")
                                .replace(/(\d{3})(\d{3})(\d{4})/, "$1 - $2 - $3")}`
                            : "+63 --- --- ----"}
                    </p>
                    <p className="text-sm opacity-80 py-2">
                        Price Range:{" "}
                        {userData?.portfolio?.priceMin
                            ? new Intl.NumberFormat("en-PH", {
                                style: "currency",
                                currency: "PHP",
                            }).format(userData.portfolio.priceMin)
                            : "₱0.00"}{" "}
                        -{" "}
                        {userData?.portfolio?.priceMax
                            ? new Intl.NumberFormat("en-PH", {
                                style: "currency",
                                currency: "PHP",
                            }).format(userData.portfolio.priceMax)
                            : "₱0.00"}
                    </p>

                    <button className="bg-amber-500 text-white font-semibold text-sm rounded-full p-2 mt-6">
                        Edit Details
                    </button>
                </div>

                <div className="flex flex-col bg-amber-500/80 gap-3 flex-1 p-4">
                    <div className="flex flex-col gap-3 my-auto p-4">
                        <button onClick={() => setCurrentTabs("current")} className={`flex items-center gap-3 border border-white/60 rounded-lg py-2 px-4 hover:bg-white/10 ${currentTab == "current" && 'bg-white'}`}>
                            <span>🖼️</span> Current
                        </button>
                        <button onClick={() => setCurrentTabs("bookings")} className={`flex items-center gap-3 border border-white/60 rounded-lg py-2 px-4 hover:bg-white/10  ${currentTab == "bookings" && 'bg-white'}`}>
                            <span>🔔</span> Bookings
                        </button>
                        <button onClick={() => setCurrentTabs("chat")} className={`flex items-center gap-3 border border-white/60 rounded-lg py-2 px-4 hover:bg-white/10  ${currentTab == "chat" && 'bg-white'}`}>
                            <span>💬</span> Chat
                        </button>
                        <button onClick={() => setCurrentTabs("menu")} className={`flex items-center gap-3 border border-white/60 rounded-lg py-2 px-4 hover:bg-white/10  ${currentTab == "menu" && 'bg-white'}`}>
                            <span>☰</span> Menu
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 border border-white/60 rounded-lg py-2 px-4 hover:bg-white/10"
                        >
                            <span>🚪</span> Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* 🗺️ Map section */}
            {currentTab == "current" ?

                <div className="flex-1 relative">
                    {location != null ?

                        <div id="maps" className="absolute inset-0 w-full h-full" />
                        : <LoadingScreen></LoadingScreen>
                    }

                    {/* Filter bar */}
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-5 py-2 flex items-center w-[60%] max-w-xl">
                        <span className="mr-3 text-expedify-gold text-lg">🔍</span>
                        <input
                            type="text"
                            placeholder="Filter Location"
                            className="flex-1 outline-none text-gray-700 bg-transparent"
                        />
                    </div>

                    {/* No ongoing booking card */}
                    {RushBooking ?

                        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-2xl px-8 py-6 flex flex-col items-center text-center w-96">

                            <h2 className="text-xl font-semibold mb-2">Ongoing Booking</h2>
                            <div className="flex align-middle self-center items-center">
                                <img src={RushBooking.Client?.photoURL || mascot} alt="Expedify mascot" className="w-16 h-auto mb-3 rounded-full" />
                                <span className="text-lg font-light mb-2">{RushBooking.Client?.fullname}</span>

                            </div>
                            <button
                                onClick={() => { setCurrentTabs("bookings"); setActiveTab("On Going") }}
                                className="bg-expedify-gold text-black rounded-full px-6 py-2 font-semibold hover:scale-105 transition">
                                View Detailed
                            </button>
                        </div>
                        : nearbyBookings?.length == 0 && !RushBooking ?

                            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-2xl px-8 py-6 flex flex-col items-center text-center w-96">
                                <img src={mascot} alt="Expedify mascot" className="w-16 h-auto mb-3" />
                                <h2 className="text-lg font-semibold mb-2">No Ongoing Booking</h2>
                                <button className="bg-expedify-gold text-black rounded-full px-6 py-2 font-semibold hover:scale-105 transition">
                                    Search Clients
                                </button>
                            </div>
                            : nearbyBookings && nearbyBookings?.length != 0 && !RushBooking ?
                                < div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 rounded-2xl px-8 py-6 flex flex-col items-center text-center w-[65%]">
                                    <CardCarousel mapRef={mapRef} setSelectedBooking={setSelectedBooking} cards={[...nearbyBookings, ...nearbyBookings, ...nearbyBookings]}></CardCarousel>
                                </div>
                                :
                                <div>
                                </div>
                    }
                    {selectedBooking &&
                        <div
                            onClick={() => setSelectedBooking(null)} className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-black/80 flex flex-col items-center text-center w-full h-full">

                            <div onClick={(e) => { e.stopPropagation() }} className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center text-center">
                                <BookingRequestCard booking={selectedBooking} MAPBOX_TOKEN={MAPBOX_TOKEN} onAccept={() => { setSelectedBooking(null) }} onClose={() => setSelectedBooking(null)}></BookingRequestCard>
                            </div>
                        </div>
                    }
                </div> : currentTab == "bookings" ?
                    <div className="flex-1 relative">
                        <MyBookings bookings={bookings} activeTab={activeTab} setActiveTab={setActiveTab}></MyBookings>
                    </div >
                    : currentTab == "chat" ?
                        <div className="flex-1 relative">
                            <ChatLayout></ChatLayout>
                        </div >
                        :
                        <></>

            }
        </div >
    );
};

export default Dashboard;
