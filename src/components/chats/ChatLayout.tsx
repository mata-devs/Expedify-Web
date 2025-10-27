import React, { useRef, useState } from "react";
import ChatSidebar, { type CombinedChat } from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import ChatProfileInfo from "./ChatProfileInfo";
import ChatCallOverlay from "./ChatCallOverlay";
import type { Booking, ChatType } from "../../utils/type";
import gekoProfile from "../../assets/gecko.png";
import imageUpload from "../../assets/image-upload.png";
import { useExpedifyStore } from "../../utils/useExpedifyStore";
const ChatLayout: React.FC = () => {
  const { selectedClient, setSelectedClient,  setShowCall } = useExpedifyStore();
 
  const filePickerRef = useRef(null);
  const [isUploading, setUploading] = useState<boolean>(false);
  const openUploading = (val: boolean) => {
    setUploading(val);
  }
  
  const openFilePicker = () => {
    filePickerRef.current?.click();
  }
  return (
    <div className="flex w-full h-screen bg-gray-50">
      <ChatSidebar selectedClient={selectedClient} setSelectedClient={setSelectedClient} />
      <ChatWindow
        selectedClient={selectedClient}
        onCallStart={() => setShowCall(true)}
      />
      <ChatProfileInfo selectedClient={selectedClient} setUploading={openUploading} />

      <div onClick={(e) => { openUploading(false); e.stopPropagation() }}
        className={`${isUploading ? 'flex' : 'hidden'} items-center justify-center fixed w-full h-full bg-gray-900/50 left-0 top-0 p-5 z-30`}>
        <div onClick={(e) => { e.stopPropagation() }} className="flex flex-col bg-white p-5 rounded-xl w-[60%]">

          <div className="flex flex-row">
            <span className="flex-1">Client</span>
            <span >x</span>
          </div>
          <div className=" flex flex-row items-center justify-center">
            <div className=" p-5">
              <img src={selectedClient?.otherUser?.photoURL || gekoProfile} className="rounded-full h-20 w-20 z-40"></img>
            </div>
            <div className="flex-1 ">
              <p className="font-bold">{selectedClient?.otherUser?.fullname || "No Name"}</p>
              <p className="">{selectedClient?.otherUser?.phoneNumber || "No Number"}</p>
            </div>
          </div>

          <div className="flex-1 flex-col">

            <div className="flex-1 ">
              <p className="font-bold">Tier Availed</p>
              <p className="text-[#B56600]">Mid Photographer</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">

            <div className="flex-1 ">
              <p className="font-bold text-center">No Available Photos</p>
              <div onClick={openFilePicker} onDragEnd={() => { }} className="flex bg-[#F0F0F0] m-5 flex-col items-center justify-center border-dashed border-2 p-10 rounded-xl border-[#EDB03B]">
                <img src={imageUpload} className="w-20 h-20"></img>
                <p>Drag and drop image or browse device</p>
                <button className="bg-[#1E1E1E] text-white py-2 px-8 mt-3 rounded-xl">Upload Image</button>
              </div>
            </div>
            <input type="file" className="hidden" ref={filePickerRef} accept="image/png, image/jpeg" ></input>
            <button className="bg-[#F7AA01] text-white py-2 px-8 mt-3 rounded-full">Upload Photos</button>

          </div>
        </div>
      </div>

    </div>
  );
};

export default ChatLayout;
