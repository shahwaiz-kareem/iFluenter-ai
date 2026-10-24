import ChatStoreProvider from "@/app/store/ChatStoreProvider";
import ChatRoomContainer from "@/components/dashboard/chatRoom/ChatRoomContainer";
import SocketProvider from "@/context/SocketProvider";

const CorrectionPage = () => {
  return (
    <SocketProvider>
      <ChatStoreProvider>
        <ChatRoomContainer mode={"correction"} />
      </ChatStoreProvider>
    </SocketProvider>
  );
};

export default CorrectionPage;
