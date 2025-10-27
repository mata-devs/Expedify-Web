import React from "react";
import { Levels, type Booking } from "../../utils/type";
import CalendarSchedule from "./CalendarSchedule";
import { doc, getFirestore, serverTimestamp, updateDoc } from "firebase/firestore";

interface Props {
  bookings: Booking[];
  selectedBooking: Booking | null;
  setSelectedBooking: React.Dispatch<React.SetStateAction<Booking | null>>;
}
export const to12HourFormat = (time24: string | null): string => {
  if (!time24) return `Undefined`;
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // convert 0 → 12
  return `${hour}:${minute} ${ampm}`;
};

const BookingList: React.FC<Props> = ({ bookings, selectedBooking, setSelectedBooking }) => {
  const db = getFirestore();
  async function updateBookingDateSeen(bookingId: string | undefined) {
    if (!bookingId) return;
    const bookingRef = doc(db, "bookings", bookingId);

    await updateDoc(bookingRef, {
      dateSeen: serverTimestamp(), // sets Firestore timestamp to now
    });

    console.log("✅ dateSeen updated to today!");
  }
  return (
    <div className=" overflow-y-scroll h-98 bg-white border-l">
      {bookings.map((b) => (
        <div
          key={b.id}
          onClick={() => { setSelectedBooking(b); updateBookingDateSeen(b.id); }}
          className={`flex  items-center justify-between  p-5 cursor-pointer border-b hover:bg-yellow-50 ${selectedBooking?.id === b.id ? "bg-yellow-100" : ""
            }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={b.Client?.photoURL || "/placeholder.png"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">{b.Client?.fullname}</p>
              <p className="text-xs text-gray-500">78 Rizal Blvd, Cebu City</p>
            </div>
          </div>
          <div className="text-right">

            <p className="text-sm text-gray-500 flex">
              <img src={Levels.find((lvl) => lvl.level == b?.tier)?.Image} className="w-5 mx-2"></img>

              {b.dateSchedule ? `${new Date(b.dateSchedule.toDate()).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
              })} ${to12HourFormat(b.startTime)} - ${to12HourFormat(b.endTime)}` : ""}
            </p>
            <p className="text-yellow-600 font-semibold text-sm">
              ₱{b.price?.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
