import React, { useEffect, useState } from "react";
import { Levels, type Booking } from "../../utils/type";

import geko from "../../assets/gecko.png";
interface BookingRequestCardProps {
  booking: Booking;
  MAPBOX_TOKEN: string;
  onAccept?: () => void;
  onClose?: () => void;
}

export const BookingRequestCard: React.FC<BookingRequestCardProps> = ({
  booking,
  MAPBOX_TOKEN,
  onAccept,
  onClose,
}) => {
  const [address, setAddress] = useState<string>("Loading address...");

  // 🔍 Reverse-geocode photographer’s or booking location
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const lat = booking.location?.latitude;
        const lon = booking.location?.longitude;
        if (!lat || !lon) return setAddress("Unknown location");

        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_TOKEN}`
        );
        const data = await res.json(); 
        const place = data.features?.[0]?.place_name || "Address not found";
        setAddress(place);
      } catch (e) {
        console.error(e);
        setAddress("Address unavailable");
      }
    };

    fetchAddress();
  }, [booking.location, MAPBOX_TOKEN]);

  const photographer = booking.Client;
  const levelInfo = Levels.find((l) => l.level === booking.level?.level);

  return (
    <div className="relative bg-white rounded-3xl w-[360px] p-6 shadow-lg font-inter text-gray-800">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-black"
        onClick={onClose}
      >
        ✕
      </button>

      {/* Profile */}
      <div className="flex items-center space-x-4">
        <img
          src={photographer?.photoURL || geko}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold text-lg">
            {photographer?.fullname || "Unknown Photographer"}
          </h2> 
        </div>
      </div>

      {/* Tier */}
      <div className="mt-5">
        <p className="text-sm font-semibold">Tier Availed</p>
        <div className="flex items-center self-center align-center space-x-2 mt-1 flex-1">
          {booking.type == "Rush" ?
            <div className="flex flex-col space-x-2 space-y-2 mx-auto ">
              <div className="flex space-x-2 mx-auto ">

                <img src={Levels[0].Image} alt="Tier" className="w-6 h-6" />
                <span className="text-yellow-600 font-medium text-sm">
                  {Levels[0]?.name || "N/A"}
                </span>

              </div>

              <div className="flex space-x-2 mx-auto ">
                <img src={Levels[1].Image} alt="Tier" className="w-6 h-6" />
                <span className="text-yellow-600 font-medium text-sm">
                  {Levels[1]?.name || "N/A"}
                </span>
              </div>
            </div>
            : levelInfo && (
              <>

                <img src={levelInfo.Image} alt="Tier" className="w-6 h-6" />
                <span className="text-yellow-600 font-medium text-sm">
                  {levelInfo?.name || "N/A"}
                </span></>
            )

          }
        </div>
      </div>

      {/* Request Details */}
      <div className="mt-5">
        <p className="text-sm font-semibold">Request</p>
        <div className="bg-yellow-100 rounded-lg flex justify-between items-center px-4 py-3 mt-2">
          <span className="text-sm text-gray-700">
            {booking.dateSchedule
              ? new Date(booking.dateSchedule.toDate()).toLocaleString()
              : "No schedule"}
          </span>
          <span className="text-xl font-bold text-gray-800">
            ₱{booking.price?.toLocaleString() || "0"}
          </span>
        </div>
      </div>

      {/* Locations */}
      <div className="mt-5">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <p className="font-semibold text-sm">Pickup Location</p>
        </div>
        <p className="ml-4 text-gray-600 text-sm">{address}</p>
      </div>

      {/* Notes */}
      {booking.notes && (
        <div className="mt-5">
          <p className="text-sm font-semibold mb-1">Notes</p>
          <div className="bg-gray-100 text-sm text-gray-600 p-3 rounded-lg">
            {booking.notes}
          </div>
        </div>
      )}

      {/* Accept Button */}
      <button
        onClick={onAccept}
        className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-full transition"
      >
        Accept
      </button>
    </div>
  );
};

export default BookingRequestCard;
