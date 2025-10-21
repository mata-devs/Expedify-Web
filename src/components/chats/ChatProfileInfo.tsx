import React from "react";
import type { Booking, ChatType } from "../../utils/type";
import type { CombinedChat } from "./ChatSidebar";
import geko from "../../assets/gecko.png";

const ChatProfileInfo: React.FC<{ selectedClient: CombinedChat | null }> = ({
  selectedClient,
}) => {
  if (!selectedClient)
    return (
      <div className="w-[300px] bg-yellow-50 border-l flex items-center justify-center text-gray-400">
        No Client Selected
      </div>
    );

  const { otherUser,price,level } = selectedClient;

  return (
    <div className="w-[300px] bg-yellow-50 border-l p-5 flex flex-col">
      <div className="flex flex-col items-center">
        {otherUser?.photoURL?
        <img
          src={otherUser?.photoURL}
          alt={otherUser?.fullname}
          className="w-24 h-24 rounded-full object-cover"
        />:
        
        <img
          src={geko}
          alt={geko}
          className="w-24 h-24 rounded-full object-cover"
        />}
        <p className="mt-3 font-semibold text-gray-800">{otherUser?.fullname}</p>
        <p className="text-gray-500 text-sm">{otherUser?.phoneNumber}</p>
      </div>

      <div className="mt-5 space-y-2">
        <div>
          <p className="text-xs font-semibold text-gray-600">Tier Availed</p>
          <p className="text-yellow-600 text-sm">{level?.name || "Mid Photographer"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600">Status</p>
          <p className="text-sm text-gray-700">Ongoing Session</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600">Location</p>
          <p className="text-sm text-gray-700">78 Rizal Blvd, Cebu City</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600">Schedule</p>
          <p className="text-sm text-gray-700">September 1, 10:20 pm</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600">Price</p>
          <p className="text-lg font-semibold text-gray-800">₱{price?.toLocaleString() || "2,000"}</p>
        </div>
      </div>

      <div className="mt-auto">
        <button className="w-full bg-yellow-500 text-white rounded-full py-2 mt-4 font-semibold hover:bg-yellow-600">
          Upload Photos
        </button>
      </div>
    </div>
  );
};

export default ChatProfileInfo;
