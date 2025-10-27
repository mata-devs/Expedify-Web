import React from "react";
import type { StatusBooking } from "../MyBookings";
import type { Booking } from "../../utils/type";

const BookingTabs = ({
  activeTab,
  setActiveTab,
  bookings,
}: {
  activeTab: string;
  setActiveTab: (tab: StatusBooking) => void;
  bookings: Booking[] | null;
}) => {
  const tabs = ["Request", "Scheduled", "On Going", "Completed", "Canceled"] as const;

  // Map tabs to booking statuses
  const statusMap: Record<typeof tabs[number], string[] | string> = {
    Request: ["pending"],
    Scheduled: ["accepted"],
    "On Going": ["active2"],
    Completed: ["complete2"],
    Canceled: ["cancel2", "declined2"],
  };

  return (
    <div className="flex space-x-6 px-4 py-3 border-b bg-white">
      {tabs.map((tab) => {
        const statuses = statusMap[tab];

        const count = bookings?.filter((b) => {
          const matchStatus = Array.isArray(statuses)
            ? statuses.includes(b.status)
            : b.status === statuses;

          const unseen = b.dateSeen === undefined;

          return matchStatus && unseen;
        }).length;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative font-medium pb-2 ${activeTab === tab
              ? "text-yellow-500 border-b-2 border-yellow-500"
              : "text-gray-500 hover:text-yellow-500"
              }`}
          >
            {tab}
            {count && count > 0 && (
              <span className="absolute -top-3 -right-3 flex items-center justify-center bg-yellow-500 text-white text-xs font-bold rounded-full w-5 h-5">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BookingTabs;
