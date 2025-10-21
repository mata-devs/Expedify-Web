import React, { useMemo, useState } from "react";
import BookingTabs from "./booking/BookingTabs";
import BookingList from "./booking/BookingList";
import BookingMap from "./booking/BookingMap";
import BookingDetailsCard from "./booking/BookingDetailsCard";
import type { Booking, BookingStatus } from "../utils/type";
export type StatusBooking = "Scheduled" | "On Going" | "Completed" | "Canceled";
const MyBookings: React.FC<{ bookings: Booking[] | null; activeTab: StatusBooking; setActiveTab: React.Dispatch<React.SetStateAction<StatusBooking>> }> = ({ bookings, activeTab, setActiveTab }) => {

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    if (!bookings) return [];

    // Map UI tab → Firestore booking status
    const statusMap: Record<string, BookingStatus> = {
      Scheduled: "accepted",
      "On Going": "active",
      Completed: "complete",
      Canceled: "cancel",
    };

    const targetStatus = statusMap[activeTab] || "accepted";

    const res = bookings.filter((b) => b.status === targetStatus);
    return res;
  }, [activeTab, bookings]);


  return (
    <div className="flex h-screen w-full bg-gray-50 font-inter">
      {/* Left Section */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h1 className="text-xl font-semibold">My Bookings</h1>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search Client"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none"
            />
            <button className="p-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500">
              🔍
            </button>
          </div>
        </div>

        <BookingTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <BookingMap selectedBooking={selectedBooking} />
          {filtered &&
            <BookingList
              bookings={filtered}
              setSelectedBooking={setSelectedBooking}
              selectedBooking={selectedBooking}
            />}
        </div>
      </div>

      {/* Right Section */}
      <BookingDetailsCard selectedBooking={selectedBooking} />
    </div>
  );
};

export default MyBookings;
