import MessageCard from "@/components/cards/MessageCard";
import { Card } from "@/components/ui/card";
import { selectMessages } from "@/lib/features/chat/message.slice";
import { useAppSelector } from "@/lib/hooks/hooks";
import { memo } from "react";

const MessagesContainer = () => {
  const messages = useAppSelector(selectMessages);
  const dateArr = messages.map((message) =>
    new Date(message?.createdAt).toDateString().split(" ").slice(1).join(" ")
  );
  // const uniqueDates = Array.from(new Set(dateArr));

  return (
    <>
      {messages?.map((message, msgIndex) => {
        const msgDate = new Date(message?.createdAt)
          .toDateString()
          .split(" ")
          .slice(1)
          .join(" ");
        const msgDateIndex = dateArr.indexOf(msgDate);

        return (
          <div
            className="flex w-full gap-2 flex-col mt-4 lg:mt-5  z-50 "
            key={message?._id}
          >
            {dateArr.includes(msgDate) && msgIndex === msgDateIndex && (
              <Card className=" rounded-md mx-auto my-1 p-1 bg-muted ">
                <p className="text-center text-sm text-muted-foreground">
                  {msgDate}
                </p>
              </Card>
            )}
            <div className="flex w-full gap-4 flex-col ">
              <MessageCard
                isUserMessage={true}
                message={message?.message}
                messageId={message?._id}
                aiFeedback={message?.aiFeedback}
                tabIndex={msgIndex + messages.length}
                messageType="previous"
              />
              <MessageCard
                IsUserMessage={false}
                message={message?.aiResponse}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default memo(MessagesContainer);
