import MessageCard from "@/components/cards/MessageCard";
import { selectRecentMessages } from "@/lib/features/chat/message.slice";
import { useAppSelector } from "@/lib/hooks/hooks";
import { memo } from "react";

const RecentMessagesContainer = () => {
  const recentMessages = useAppSelector(selectRecentMessages);
  return (
    <>
      {recentMessages?.map((message) => (
        <div
          className="flex max-lg:pb-10 w-full gap-4 flex-col mt-4  z-50"
          key={message?._id}
        >
          <MessageCard
            isUserMessage={true}
            message={message?.message}
            messageId={message?._id}
            aiFeedback={message?.aiFeedback}
          />
          <MessageCard
            IsUserMessage={false}
            tabIndex={recentMessages.length}
            message={message?.aiResponse}
            messageId={message?._id}
            messageType="recent"
          />
        </div>
      ))}
    </>
  );
};

export default memo(RecentMessagesContainer);
