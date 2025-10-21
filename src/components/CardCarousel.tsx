import React, { useEffect, useState } from "react";
import type { Booking } from "../utils/type";
import type { LngLatLike, Map } from "mapbox-gl";

interface CardCarouselProps {
    cards: Booking[];
    mapRef: React.RefObject<Map | null>;
    setSelectedBooking: React.Dispatch<React.SetStateAction<Booking | null>>;
}

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

const CardCarousel: React.FC<CardCarouselProps> = ({
    cards,
    setSelectedBooking,
    mapRef
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [addresses, setAddresses] = useState<Record<string, string>>({});

    const nextCard = () => {
        setActiveIndex((prev) => (prev + 1) % cards.length);
    };
    useEffect(() => {

        const lat = cards[activeIndex].location?.latitude;
        const lon = cards[activeIndex].location?.longitude;

        if (lat && lon) {
            mapRef.current?.easeTo({
                center: [lon, lat],
                duration: 300, // in ms (1 second)
                zoom: mapRef.current?.getZoom() ?? 14,
                easing: (t) => t, // linear easing (you can customize)
            });
        }
    }, [activeIndex]);
    const prevCard = () => {
        setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const fetchAddress = async (booking: Booking) => {
        try {
            const lat = booking.location?.latitude;
            const lon = booking.location?.longitude;
            if (!lat || !lon) return "Unknown location";

            const res = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_TOKEN}`
            );
            const data = await res.json();
            const place = data.features?.[0]?.place_name || "Address not found";
            return place;
        } catch (e) {
            console.error(e);
            return "Address unavailable";
        }
    };

    // ✅ Load addresses once
    useEffect(() => {
        const loadAddresses = async () => {
            const newAddresses: Record<string, string> = {};
            for (const card of cards) {
                const addr = await fetchAddress(card);
                if (card.id) newAddresses[card.id] = addr;
            }
            setAddresses(newAddresses);
        };
        if (cards.length > 0) loadAddresses();
    }, [cards]);

    return (
        <div className="relative w-full flex justify-center items-center h-80 overflow-hidden select-none">
            <div className="relative flex items-center justify-center w-full">
                {cards.map((card, index) => {
                    const offset = index - activeIndex;
                    const adjustedOffset = offset < 0 ? offset + cards.length : offset;

                    const isActive = index === activeIndex;

                    const transformStyle =
                        adjustedOffset === 0
                            ? "translate-x-0 z-20 "
                            : adjustedOffset === 1
                                ? "translate-x-[50%] scale-90 opacity-80 z-10"
                                : adjustedOffset === cards.length - 1
                                    ? "-translate-x-[50%] scale-90 opacity-80 z-10"
                                    : "opacity-0 scale-75 z-0";

                    return (
                        <div
                            key={`${card.id}-${index}`}
                            onClick={() => {
                                if (adjustedOffset === 0) setSelectedBooking(card);
                                if (adjustedOffset === 1) nextCard();
                                if (adjustedOffset === cards.length - 1) prevCard();
                            }}
                            className={`absolute transition-all duration-500 ease-in-out transform ${transformStyle}`}
                        >
                            <div
                                className={`w-84 h-60 rounded-2xl shadow-lg overflow-hidden bg-white ${isActive ? "z-20" : "z-10"
                                    }`}
                            >
                                <div className="bg-yellow-500/50 py-3 rounded-xl flex text-left pl-3">
                                    <div className="flex flex-col flex-1">
                                        <span className="font-bold">Booked</span>
                                        <span className="text-sm"> {card.dateSchedule
                                            ? new Date(card.dateSchedule.toDate()).toLocaleString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true,
                                            })
                                            : "No schedule"}</span>
                                    </div>
                                    <div className="flex-1 font-semibold text-gray-800 text-2xl align-center self-center text-center">
                                        {card.price
                                            ? new Intl.NumberFormat("en-PH", {
                                                style: "currency",
                                                currency: "PHP",
                                                minimumFractionDigits: 2,
                                            }).format(card.price)
                                            : "₱0.00"}
                                    </div>

                                </div>
                                <div className="flex flex-col px-4">
                                    <div className="flex">
                                        <div className="px-2 pt-7 flex flex-col">
                                            <div className="w-5 h-6 z-50 bg-yellow-500 rounded-full"></div>
                                            <div className="w-1 -mt-2 bg-black h-full mx-auto "></div>

                                        </div>
                                        <div className="flex-1 px-2 pt-4 text-center font-semibold text-gray-700">
                                            {addresses[card.id ?? ""] || "Loading..."}
                                            <hr className="mt-4"></hr>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="px-2 mb-7 flex flex-col">
                                            <div className="w-1 -mt-2 bg-black h-full mx-auto "></div>
                                            <div className="w-5 h-6 z-50 bg-yellow-500 rounded-full"></div>

                                        </div>
                                        <div className="flex-1 p-4 text-center font-semibold text-gray-700">
                                            {addresses[card.id ?? ""] || "Loading..."}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevCard}
                className="absolute left-2 bg-gray-700 text-white rounded-full p-2 opacity-80 hover:opacity-100"
            >
                ◀
            </button>
            <button
                onClick={nextCard}
                className="absolute right-2 bg-gray-700 text-white rounded-full p-2 opacity-80 hover:opacity-100"
            >
                ▶
            </button>
        </div>
    );
};

export default CardCarousel;
