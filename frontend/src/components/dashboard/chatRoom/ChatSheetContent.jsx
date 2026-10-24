"use client";

import { useToast } from "@/hooks/use-toast";
import {
  clearAllMessages,
  selectAllMsgsFetched,
  selectMessages,
  selectRecentMessages,
  setMessages,
  setAllMsgsFetched,
  setMessageFocusIndex,
  selectPageNo,
  setChatIdChanged,
  selectChatIdChanged,
  setPageNo,
  incrementPageNo,
  selectStatus,
  setStatus,
} from "@/lib/features/chat/message.slice";

import { selectPreferences } from "@/lib/features/preferences/preferences.slice";
import { useLazyGetMessagesQuery } from "@/lib/features/services/messageApi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { TriangleAlert, ListX, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import MessagesContainer from "./MessagesContainer";
import RecentMessagesContainer from "./RecentMessagesContainer";
import { Card } from "@/components/ui/card";
import { selectIsModalOpen } from "@/lib/features/chat/chat.slice";
const pageLimit = 6;

const ChatSheetContent = () => {
  const { inView, ref } = useInView();

  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [triggerGetMessages] = useLazyGetMessagesQuery();

  const messages = useAppSelector(selectMessages);
  const recentMessages = useAppSelector(selectRecentMessages);
  const isModalOpen = useAppSelector(selectIsModalOpen);
  const preferences = useAppSelector(selectPreferences);
  const allMsgsFetched = useAppSelector(selectAllMsgsFetched);
  const chatIdChanged = useAppSelector(selectChatIdChanged);
  const status = useAppSelector(selectStatus);
  const pageNo = useAppSelector(selectPageNo);

  const fetchMessages = async () => {
    try {
      dispatch(setStatus("loading"));

      const res = await triggerGetMessages({
        chatId: preferences?.selectedChat,
        pageNo,
        pageLimit,
        msgsBeforeDate: recentMessages[0]?.createdAt || "",
      }).unwrap();

      const fetchedMsgs = Array.from(res?.data);
      const recentIds = new Set(recentMessages.map((m) => m._id));
      const uniqueFetched = fetchedMsgs.filter(
        (msg) => !recentIds.has(msg._id)
      );

      dispatch(setMessages(uniqueFetched.reverse()));

      if (pageNo > 1 && fetchedMsgs.length === 0)
        dispatch(setAllMsgsFetched(true));

      dispatch(
        setMessageFocusIndex({
          messageType: "previous",
          index: Math.floor(
            pageNo * pageLimit + (pageLimit * 2 - 1) - res?.data.length
          ),
        })
      );

      dispatch(incrementPageNo());
      dispatch(setStatus("success"));
    } catch (error) {
      console.log(error);
      dispatch(setStatus("error"));

      toast({
        description: "Something went wrong!",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (
      (inView && !isModalOpen && !allMsgsFetched) ||
      (!isModalOpen && chatIdChanged)
    ) {
      fetchMessages();
      dispatch(setChatIdChanged(false));
    }
  }, [inView, chatIdChanged, isModalOpen]);

  return (
    <div className="overflow-y-auto pb-4 max-lg:pb-20 relative px-6 h-full w-full">
      <div
        ref={ref}
        className={`flex flex-col  w-full justify-center items-center  ${
          (messages.length === 0 && recentMessages.length === 0 && "h-full") ||
          (messages.length === 0 &&
            status === "loading" &&
            "justify-center items-center h-ful")
        } `}
      >
        {inView && status === "loading" && (
          <Loader2
            size={25}
            className="animate-spin text-primary text-center mt-1 sm:mt-2  "
          />
        )}
        {status === "success" &&
          messages.length === 0 &&
          recentMessages.length === 0 && (
            <div className="flex  items-center justify-center flex-col gap-2">
              <ListX size={80} className="text-primary" />
              <strong className="text-sm">No conversation yet!</strong>
            </div>
          )}
        {["error", "failed"].includes(status) && messages.length === 0 && (
          <div className="flex items-center justify-center flex-col gap-2">
            <TriangleAlert size={80} className="text-red-500" />
            <strong className="text-sm">Something went wrong!</strong>
          </div>
        )}
      </div>

      <MessagesContainer />

      {recentMessages.length > 0 && (
        <Card className=" w-14 rounded-md mx-auto mt-4 py-1 bg-muted text-primary ">
          <p className="text-center text-sm text-muted-foreground">Now</p>
        </Card>
      )}
      <RecentMessagesContainer />
    </div>
  );
};

export default ChatSheetContent;
