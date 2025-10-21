import React from "react";
import type { Booking } from "../../utils/type";

interface Props {
  bookings: Booking[];
  selectedBooking: Booking | null;
  setSelectedBooking: React.Dispatch<React.SetStateAction<Booking | null>>;
}

const BookingList: React.FC<Props> = ({ bookings, selectedBooking, setSelectedBooking }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white border-l">
      {bookings.map((b) => (
        <div
          key={b.id}
          onClick={() => setSelectedBooking(b)}
          className={`flex items-center justify-between p-4 cursor-pointer border-b hover:bg-yellow-50 ${
            selectedBooking?.id === b.id ? "bg-yellow-100" : ""
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
            <p className="text-sm text-gray-500">
              {b.dateSchedule ? new Date(b.dateSchedule.toDate()).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              }) : ""}
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
