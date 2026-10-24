import ChatStoreProvider from "@/app/store/ChatStoreProvider";
import ChatRoomContainer from "@/components/dashboard/chatRoom/ChatRoomContainer";
import SocketProvider from "@/context/SocketProvider";

const ConversationPage = () => {
  return (
    <SocketProvider>
      <ChatStoreProvider>
        <ChatRoomContainer mode={"conversation"} />
      </ChatStoreProvider>
    </SocketProvider>
  );
};

export default ConversationPage;
