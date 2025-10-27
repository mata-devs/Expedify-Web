import React, { useMemo, useState } from "react";
import BookingTabs from "./booking/BookingTabs";
import BookingList from "./booking/BookingList";
import BookingMap from "./booking/BookingMap";
import BookingDetailsCard from "./booking/BookingDetailsCard";
import type { Booking, BookingStatus } from "../utils/type";
import { useExpedifyStore } from "../utils/useExpedifyStore";
import CalendarSchedule from "./booking/CalendarSchedule";
import { addDoc, collection, doc, getFirestore, serverTimestamp, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
export type StatusBooking = "Request" | "Scheduled" | "On Going" | "Completed" | "Canceled";
const MyBookings: React.FC<{ bookings: Booking[] | null; }> = ({ bookings }) => {
  const { activeTab, setActiveTab } = useExpedifyStore();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const statusMap: Record<string, BookingStatus> = {
    Request: "pending",
    Scheduled: "accepted",
    "On Going": "active",
    Completed: "complete",
    Canceled: "cancel",
  };

  const filtered = useMemo(() => {
    if (!bookings) return [];

    // Map UI tab → Firestore booking status
    const targetStatus = statusMap[activeTab] || "pending";
    const res = bookings.filter((b) => {
      if (b.status !== targetStatus) return false;

      const d1 = b.dateSchedule?.toDate();
      const d2 = selectedDate;
      return (
        d1 &&
        d2 &&
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );

    });

    return res;
  }, [activeTab, bookings, selectedDate]);
  const db = getFirestore();

  const updateExpiredBookings = async (bookings: any[]) => {
    const now = new Date();

    for (const booking of bookings) {
      const date = booking.dateSchedule.toDate(); // Firestore Timestamp → JS Date
      if (date <= now && booking.status !== "active") {
        try {
          const bookingRef = doc(db, "bookings", booking.id);
          await updateDoc(bookingRef, { status: "active" });
          console.log(`✅ Booking ${booking.id} updated to active`);
        } catch (error) {
          console.error(`❌ Error updating booking ${booking.id}:`, error);
        }
      }
    }
  };
  const filteredRequest = useMemo(() => {
    if (!bookings) return [];

    // Map UI tab → Firestore booking status

    const targetStatus = statusMap[activeTab] || "pending";
    updateExpiredBookings(bookings);
    const res = bookings.filter((b) => b.status === targetStatus);
    return res;
  }, [activeTab, bookings]);
  return (
    <div className="flex max-h-screen w-full bg-gray-50 font-inter">
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

        <BookingTabs activeTab={activeTab} setActiveTab={setActiveTab} bookings={bookings}/>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            <div className="flex-1 flex">
              <CalendarSchedule setSelectedBooking={setSelectedBooking} setSelectedDate={setSelectedDate} selectedDate={selectedDate} bookings={filteredRequest} onSelectBooking={setSelectedBooking} selectedBooking={selectedBooking}></CalendarSchedule>

            </div>
            <div className="flex-1 flex">
              <BookingMap selectedBooking={selectedBooking} />
            </div>
          </div>
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
