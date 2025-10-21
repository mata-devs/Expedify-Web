import React, { useEffect, useState } from "react";
import type { Booking } from "../../utils/type";
import { MAPBOX_TOKEN } from "../../services/getAddressName";
import callicon from "../../assets/icons/call-icon.png";
import chaticon from "../../assets/icons/chat-icon.png";
const BookingDetailsCard: React.FC<{ selectedBooking: Booking | null }> = ({
  selectedBooking,
}) => {
  if (!selectedBooking)
    return (
      <div className="w-[300px] bg-white border-l flex items-center justify-center text-gray-400">
        No Booking Selected
      </div>
    );

  const [address, setAddress] = useState<string>("Loading address...");
  const { Client, level, status, price, dateSchedule, location } = selectedBooking;
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const lat = location?.latitude;
        const lon = location?.longitude;
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
  }, [location, MAPBOX_TOKEN]);

  return (
    <div className="w-[300px] bg-[#FFF4CF] border-lflex flex-col text-center">
      <h2 className="text-sm font-bold text-gray-600   p-5 ">Client</h2>
      <div className="flex items-center gap-3 mb-3  p-5  text-left bg-white">
        <img
          src={Client?.photoURL || "/placeholder.png"}
          alt=""
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{Client?.fullname}</p>
          <p className="text-xs text-gray-600">{Client?.phoneNumber}</p>
        </div>
      </div>

      <div className="w-[300px] bg-[#FFF4CF] border-lflex flex-col text-center">
        <p className="text-sm font-bold text-gray-600 mb-1">Tier Availed</p>
        <p className="text-yellow-600 font-bold text-sm mb-3 p-3 rounded-xl bg-white mx-5">{level?.name || "N/A"}</p>

        <p className="text-sm font-bold text-gray-600 mb-1">Status</p>
        <p className="text-sm mb-3 p-3 rounded-xl bg-white mx-5">{status}</p>
        <p className="text-sm font-bold text-gray-600 mb-1">Location</p>
        <p className="text-sm mb-3 p-3 rounded-xl bg-white mx-5">{address}</p>

        <p className="text-sm font-bold text-gray-600 mb-1">Schedule</p>
        <p className="text-sm mb-3 p-3 rounded-xl bg-white mx-5">
          {dateSchedule
            ? new Date(dateSchedule.toDate()).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
            : "N/A"}
        </p>

        <p className="text-sm font-bold text-gray-600 mb-1">Price</p>
        <p className="text-sm mb-3   text-gray-800 p-3 rounded-xl bg-white mx-5">
          ₱{price?.toLocaleString()}
        </p>
        <div className="flex space-x-2 items-center flex-1 justify-center">
          <button className="p-2 bg-[#EDB03B] rounded-xl w-12 ">
            <img src={callicon}></img>
          </button>
          <button className="p-2 bg-[#EDB03B] rounded-xl w-12 ">
            <img src={chaticon}></img>
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingDetailsCard;
