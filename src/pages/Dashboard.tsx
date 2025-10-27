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
import MenuLayout from "../components/menu/MenuLayout";
import useUserCalls from "../hooks/useUserCalls";
import ChatCallOverlay from "../components/chats/ChatCallOverlay";
import { acceptCall } from "../utils/acceptCall";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

const Dashboard: React.FC = () => {
    const {
        userData,
        location,
        nearbyBookings,
        mybookings,
        bookings,
        RushBooking,
        activeTab, setActiveTab,
        currentTab, setCurrentTabs,
        setShowCall, showCall
    } = useExpedifyStore();
    const navigate = useNavigate();
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
    const destMarkerRef = useRef<mapboxgl.Marker | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const [mapLoaded, setMapLoaded] = useState(false);

    const callManager = useUserCalls();
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const handleLogout = async () => {
        await logout();
        navigate("/signin");
    };

    // 🗺️ Initialize Map Once
    useEffect(() => {
        if (mapRef.current || !location) return;

        const map = new mapboxgl.Map({
            container: "maps",
            style: "mapbox://styles/mapbox/streets-v12",
            center: [location.lng, location.lat],
            zoom: 13,
            attributionControl: false,
        });

        mapRef.current = map;

        map.on("load", () => {
            console.log("🗺️ Map fully loaded!");
            setMapLoaded(true);
        });

        map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "bottom-right");

        const userMarker = new mapboxgl.Marker({ color: "#f59e0b" })
            .setLngLat([location.lng, location.lat])
            .addTo(map);
        userMarkerRef.current = userMarker;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [location]);


    // 📍 Smoothly update user position when it changes
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !location) return;

        // Update marker position
        if (userMarkerRef.current) {
            userMarkerRef.current.setLngLat([location.lng, location.lat]);
        }

        // Smooth follow user
        map.easeTo({
            center: [location.lng, location.lat],
            duration: 800,
        });
    }, [location]);

    useEffect(() => {
        if (callManager[0]) {
            setCurrentTabs("chat");
            setShowCall(true);
        }else{
            
            setShowCall(false);
        }
    }, [callManager, navigate])
    // 🚗 Update route when RushBooking changes
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapLoaded || !RushBooking?.location || !location) return;

        const { longitude, latitude } = RushBooking.location[0].location;
        if (longitude === undefined || latitude === undefined) return;

        const getRoute = async () => {
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${location.lng},${location.lat};${longitude},${latitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
            const response = await fetch(url);
            const data = await response.json();
            if (!data.routes?.length) return;

            const route = {
                type: "Feature",
                geometry: data.routes[0].geometry,
                properties: {},
            };

            if (map.getSource("route")) {
                (map.getSource("route") as mapboxgl.GeoJSONSource).setData(route);
            } else {
                map.addSource("route", { type: "geojson", data: route });
                map.addLayer({
                    id: "route-line",
                    type: "line",
                    source: "route",
                    layout: { "line-join": "round", "line-cap": "round" },
                    paint: { "line-color": "#2563eb", "line-width": 5 },
                });
            }

            if (!destMarkerRef.current) {
                destMarkerRef.current = new mapboxgl.Marker({ color: "#CC0000" })
                    .setLngLat([longitude, latitude])
                    .addTo(map);
            } else {
                destMarkerRef.current.setLngLat([longitude, latitude]);
            }

            const bounds = new mapboxgl.LngLatBounds();
            route.geometry.coordinates.forEach((coord: [number, number]) => bounds.extend(coord));
            map.fitBounds(bounds, { padding: 60 });
        };

        getRoute();
    }, [RushBooking, mapLoaded]);


    // 📍 Update nearby booking markers
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !nearbyBookings) return;

        // Clear previous markers
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        // Add new ones
        nearbyBookings.forEach((booking) => {
            if (!booking.location) return;

            const marker = new mapboxgl.Marker({ color: "#f32a0b" })
                .setLngLat([booking.location[0].location.longitude, booking.location[0].location.latitude])
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
    }, [nearbyBookings]);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* 📸 Sidebar */}
            <div className="w-80 bg-white flex flex-col justify-between">
                <div className="flex flex-col  p-4 mt-2">
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

                    <button className="bg-amber-500 text-white font-semibold text-sm rounded-full p-2 ">
                        Edit Details
                    </button>
                </div>

                <div className="flex flex-col bg-amber-500/80 gap-3 flex-1 px-4">
                    <div className="flex flex-col gap-3 mt-8 px-4">
                        <button
                            onClick={() => setCurrentTabs("current")}
                            className={`flex items-center gap-3 border border-white/60 rounded-lg py-2 px-4 hover:bg-white/10 ${currentTab == "current" && "bg-white"
                                }`}
                        >
                            <span>🖼️</span> Current
                        </button>
                        <button
                            onClick={() => setCurrentTabs("bookings")}
                            className={`flex items-center gap-3 border border-white/60 rounded-lg py-2 px-4 hover:bg-white/10 ${currentTab == "bookings" && "bg-white"
                                }`}
                        >
                            <span>🔔</span> Bookings
                        </button>
                        <button
                            onClick={() => setCurrentTabs("chat")}
                            className={`flex items-center gap-3 border border-white/60 rounded-lg py-2 px-4 hover:bg-white/10 ${currentTab == "chat" && "bg-white"
                                }`}
                        >
                            <span>💬</span> Chat
                        </button>
                        <button
                            onClick={() => setCurrentTabs("menu")}
                            className={`flex items-center gap-3 border border-white/60 rounded-lg py-2 px-4 hover:bg-white/10 ${currentTab == "menu" && "bg-white"
                                }`}
                        >
                            <span>☰</span> Menu
                        </button>

                        {userData?.userType == "Manager" &&
                            <button
                                onClick={() => setCurrentTabs("Requests")}
                                className={`flex items-center gap-3 border border-white/60 rounded-lg py-2 px-4 hover:bg-white/10 ${currentTab == "menu" && "bg-white"
                                    }`}
                            >
                                <span>☰</span> Requests
                            </button>
                        }

                    </div>
                </div>
            </div>
            {/* 🗺️ Main Map (always mounted) */}
            <div className="flex-1 relative">
                {location ? (
                    <div id="maps" className="absolute inset-0 w-full h-full" />
                ) : (
                    <LoadingScreen />
                )}

                {/* Filter Bar (visible only on current tab) */}
                {currentTab === "current" && (
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-5 py-2 flex items-center w-[60%] max-w-xl z-20">
                        <span className="mr-3 text-expedify-gold text-lg">🔍</span>
                        <input
                            type="text"
                            placeholder="Filter Location"
                            className="flex-1 outline-none text-gray-700 bg-transparent"
                        />
                    </div>
                )}

                {/* Current Tab Overlay */}
                {currentTab === "current" && (
                    <>
                        {RushBooking ? (
                            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-2xl px-8 py-6 flex flex-col items-center text-center w-96 z-20">
                                <h2 className="text-xl font-semibold mb-2">Ongoing Booking</h2>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={RushBooking.Client?.photoURL || mascot}
                                        alt="Client"
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <span className="text-lg font-light">
                                        {RushBooking.Client?.fullname}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        setCurrentTabs("bookings");
                                        setActiveTab("On Going");
                                    }}
                                    className="bg-expedify-gold text-black rounded-full px-6 py-2 font-semibold hover:scale-105 transition"
                                >
                                    View Detailed
                                </button>
                            </div>
                        ) : nearbyBookings?.length ? (
                            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 rounded-2xl px-8 py-6 flex flex-col items-center text-center w-[65%] z-20">
                                <CardCarousel
                                    mapRef={mapRef}
                                    setSelectedBooking={setSelectedBooking}
                                    cards={[...nearbyBookings]}
                                />
                            </div>
                        ) : (
                            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-2xl px-8 py-6 flex flex-col items-center text-center w-96 z-20">
                                <img src={mascot} alt="Expedify mascot" className="w-16 h-auto mb-3" />
                                <h2 className="text-lg font-semibold mb-2">No Ongoing Booking</h2>
                                <button className="bg-expedify-gold text-black rounded-full px-6 py-2 font-semibold hover:scale-105 transition">
                                    Search Clients
                                </button>
                            </div>
                        )}

                        {/* Booking Request Modal */}
                        {selectedBooking && (
                            <div
                                onClick={() => setSelectedBooking(null)}
                                className="absolute inset-0 bg-black/80 flex items-center justify-center z-30"
                            >
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex flex-col items-center text-center"
                                >
                                    <BookingRequestCard
                                        booking={selectedBooking}
                                        MAPBOX_TOKEN={MAPBOX_TOKEN}
                                        onAccept={() => setSelectedBooking(null)}
                                        onClose={() => setSelectedBooking(null)}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* 📖 Bookings Panel */}
                <div
                    className={`absolute inset-0 bg-white overflow-y-auto transition-opacity duration-300 z-20 ${currentTab === "bookings" ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                >
                    <MyBookings
                        bookings={bookings}
                    />
                </div>

                {/* 💬 Chat Panel */}
                <div
                    className={`absolute inset-0 bg-white transition-opacity duration-300 z-20 ${currentTab === "chat" ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                >
                    <ChatLayout />
                </div>

                {/* ☰ Menu Panel */}
                <div
                    className={`absolute inset-0 bg-white transition-opacity duration-300 z-20 ${currentTab === "menu" ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                >
                    <MenuLayout>

                    </MenuLayout>
                </div>

                {showCall && (
                    <ChatCallOverlay
                        client={callManager[0]} 
                        onEnd={() => setShowCall(false)}
                        onClose={() => setShowCall(false)}
                    />
                )}
            </div>

        </div>
    );
};

export default Dashboard;
