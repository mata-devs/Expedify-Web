import React, { useEffect, useState } from "react";
import { Levels, type Booking } from "../../utils/type";
import { MAPBOX_TOKEN } from "../../services/getAddressName";
import callicon from "../../assets/icons/call-icon.png";
import chaticon from "../../assets/icons/chat-icon.png";
import { useExpedifyStore } from "../../utils/useExpedifyStore";
import type { CombinedChat } from "../chats/ChatSidebar";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
const BookingDetailsCard: React.FC<{ selectedBooking: Booking | null }> = ({
  selectedBooking,
}) => {
  if (!selectedBooking)
    return (
      <div className="w-[300px] bg-white border-l flex items-center justify-center text-gray-400">
        No Booking Selected
      </div>
    );

  const { setCurrentTabs, setSelectedClient, setShowCall } = useExpedifyStore();
  const [address, setAddress] = useState<string>("Loading address...");
  const { Client, level, status, price, dateSchedule, location, tier } = selectedBooking;

  const db = getFirestore();
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const loc = location?.[0].location
        const lat = loc?.latitude;
        const lon = loc?.longitude;
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

  const AccepBooking = async (bookingId: string) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);

      await updateDoc(bookingRef, {
        status: "accepted", // ✅ only update this field
      });

      console.log("✅ Booking status updated successfully!");
    } catch (error) {
      console.error("❌ Error updating booking status:", error);
    }
  };
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
        <p className="text-yellow-600 font-bold text-sm mb-3 p-3 rounded-xl bg-white mx-5 flex items-center justify-center">
          <img src={Levels.find((lvl) => lvl.level == tier)?.Image} className="w-10"></img>
        </p>

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
          <button onClick={() => { setCurrentTabs("chat"); setShowCall(true); setSelectedClient({ otherUser: selectedBooking.Client, lastMessage: '', lastMessageTime: new Date() } as CombinedChat) }} className="p-2 bg-[#EDB03B] rounded-xl w-12 ">
            <img src={callicon}></img>
          </button>
          <button onClick={() => { setCurrentTabs("chat"); setSelectedClient({ otherUser: selectedBooking.Client, lastMessage: '', lastMessageTime: new Date() } as CombinedChat) }} className="p-2 bg-[#EDB03B] rounded-xl w-12 ">
            <img src={chaticon}></img>
          </button>
        </div>

        <div className="flex space-x-2 items-center flex-1 justify-center">
          {
            status == "pending" &&

            <button onClick={() => selectedBooking.id && AccepBooking(selectedBooking.id)}
              className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-full transition"
            > Accept
            </button>
          }
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsCard;
