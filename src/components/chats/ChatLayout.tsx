import React, { useState } from "react";
import ChatSidebar, { type CombinedChat } from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import ChatProfileInfo from "./ChatProfileInfo";
import ChatCallOverlay from "./ChatCallOverlay"; 
import type { Booking, ChatType } from "../../utils/type";

const ChatLayout: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<CombinedChat | null>(null);
  const [showCall, setShowCall] = useState(false);

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <ChatSidebar selectedClient={selectedClient} setSelectedClient={setSelectedClient} />
      <ChatWindow
        selectedClient={selectedClient}
        onCallStart={() => setShowCall(true)}
      />
      <ChatProfileInfo selectedClient={selectedClient} />
      {showCall && (
        <ChatCallOverlay
          client={selectedClient}
          onClose={() => setShowCall(false)}
        />
      )}
    </div>
  );
};

export default ChatLayout;
