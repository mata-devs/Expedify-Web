import React, { useState } from "react";
import type { Booking, ChatType } from "../../utils/type";
import type { CombinedChat } from "./ChatSidebar";
import geko from "../../assets/gecko.png";

const ChatProfileInfo: React.FC<{ selectedClient: CombinedChat | null; setUploading: (val: boolean) => void }> = ({
  selectedClient,
  setUploading
}) => {
  // const [isUploading, setUploading] = useState<boolean>(false);
  if (!selectedClient)
    return (
      <div className="w-[300px] bg-yellow-50 border-l flex items-center justify-center text-gray-400">
        No Client Selected
      </div>
    );

  const { otherUser, price, level } = selectedClient;

  return (
    <div className="w-[300px] bg-[#FFF4CF] border-l p-5 flex flex-col">
      <div className="flex flex-col items-center">
        {otherUser?.photoURL ?
          <img
            src={otherUser?.photoURL}
            alt={otherUser?.fullname}
            className="w-24 h-24 rounded-full object-cover"
          /> :

          <img
            src={geko}
            alt={geko}
            className="w-24 h-24 rounded-full object-cover"
          />}
        <p className="mt-3 font-semibold text-gray-800">{otherUser?.fullname}</p>
        <p className="text-gray-500 text-sm">{otherUser?.phoneNumber}</p>
      </div>

      <div className="mt-5 space-y-2 text-center">
        <div>
          <p className="text-xs font-semibold text-gray-600">Tier Availed</p>
          <p className="text-yellow-600 text-sm">{level?.name || "Mid Photographer"}</p>
        </div>
        <div className="">
          <p className="text-xs font-semibold text-gray-600">Status</p>
          <p className="text-sm  p-3 rounded-xl font-bold bg-[#FFFFFF]  text-[#B56600]">Ongoing Session</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600">Location</p>
          <p className="text-sm  p-3 rounded-xl font-light bg-[#FFFFFF] text-gray-700">78 Rizal Blvd, Cebu City</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600">Schedule</p>
          <p className="text-sm  p-3 rounded-xl font-light bg-[#FFFFFF] text-gray-700">September 1, 10:20 pm</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600">Price</p>
          <p className="text-lg p-3 rounded-xl font-light bg-[#FFFFFF] text-gray-700">₱{price?.toLocaleString() || "2,000"}</p>
        </div>
      </div>

      <div className="mt-auto">
        <div className="relative bg-white p-2 rounded-2xl mx-5 text-center text-[#D68501] font-bold">
          <div  className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#D68501] pt-1 text-center h-8 w-8 rounded-full text-white">!</div>
          Pending Photos</div>
        <button onClick={() => { setUploading(true); }} className="w-full bg-yellow-500 text-white rounded-full py-2 mt-4 font-semibold hover:bg-yellow-600">
          Upload Photos
        </button>
      </div>
    </div>
  );
};

export default ChatProfileInfo;
