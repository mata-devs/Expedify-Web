import React from "react";

const BookingTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: "Scheduled" | "On Going" | "Completed"| "Canceled") => void;
}) => {
  const tabs = ["Scheduled", "On Going", "Completed","Canceled"] as const;

  return (
    <div className="flex space-x-6 px-4 py-3 border-b bg-white">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`font-medium ${
            activeTab === tab
              ? "text-yellow-500 border-b-2 border-yellow-500"
              : "text-gray-500 hover:text-yellow-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default BookingTabs;
