import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mapImage from "../assets/map_mock.png"; // ⬅️ placeholder for your circular map image
import { useExpedifyStore } from "../utils/useExpedifyStore";

const Permissions: React.FC = () => { 
    const navigate = useNavigate();

    const {
        setLocationPermission,
        setNotifPermission,
        locationPermission,
        notifPermission,
      } = useExpedifyStore();
    // Ask for location permission
    const handleLocation = async () => {
        try {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        setLocationPermission("granted"); 
                    },
                    (err) => {
                        setLocationPermission("denied")
                    }
                );
            } else {
                alert("Geolocation is not supported by your browser.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Ask for notification permission
    const handleNotifications = async () => {
        if ("Notification" in window) {
            const perm = await Notification.requestPermission();
            setNotifPermission(perm as "granted" | "denied" | "default");
        } else {
            alert("Notifications are not supported by this browser.");
        }
    };

    const skip = () => {
        navigate("/dashboard");
    };

    const handleNext = () => {
        if (locationPermission && notifPermission) {
            navigate("/dashboard");
        } else {
            alert("Please allow at least one permission to continue, or click 'Not now'.");
        }
    };
    useEffect(() => {
        if (locationPermission && notifPermission) {
            handleNext();
        }
    }, [locationPermission, notifPermission])
    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white px-6">
            {/* Left: Circular map preview */}
            <div className="w-64 h-64 rounded-full overflow-hidden mb-8 md:mb-0 md:mr-12 shadow-lg border border-gray-200">
                <img src={mapImage} alt="Map preview" className="object-cover w-full h-full" />
            </div>

            {/* Right: Permission options */}
            <div className="text-center md:text-left max-w-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Turn on your location</h2>
                <p className="text-gray-600 mb-6">
                    Turn on your location for a seamless booking experience.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleLocation}
                        className={`rounded-full px-6 py-2 font-semibold transition ${locationPermission
                                ? "bg-green-500 text-white"
                                : "bg-expedify-gold text-black hover:scale-105"
                            }`}
                    >
                        {locationPermission ? "Location Enabled ✓" : "Turn on location service"}
                    </button>

                    <button
                        onClick={handleNotifications}
                        className={`rounded-full px-6 py-2 font-semibold transition ${notifPermission
                                ? "bg-green-600 text-white"
                                : "bg-gray-900 text-white hover:scale-105"
                            }`}
                    >
                        {notifPermission ? "Notifications Enabled ✓" : "Enable Notification"}
                    </button>
                </div>

                <p
                    onClick={skip}
                    className="mt-6 text-gray-600 text-sm cursor-pointer hover:underline"
                >
                    Not now
                </p>
            </div>
        </div>
    );
};

export default Permissions;
