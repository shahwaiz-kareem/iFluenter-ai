"use client";
import { useToast } from "@/hooks/use-toast";
import {
  selectAllChatsFetched,
  selectChats,
  setAllChatsFetched,
  setChats,
} from "@/lib/features/chat/chat.slice";
import { selectPreferences } from "@/lib/features/preferences/preferences.slice";
import { useLazyGetChatsQuery } from "@/lib/features/services/chatApi";
import { useAppSelector } from "@/lib/hooks/hooks";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch } from "react-redux";
import ChatDisplayElement from "./ChatDisplayElement";
import { usePathname } from "next/navigation";
let pageNo = 2; // 2 because pageNo=1 is already exist in redux persistent

const ChatsScrollLoad = ({
  parentScrolling,
  newTopic,
  setNewTopic,
  chatCrudType,
  setChatCrudType,
}) => {
  const { inView, ref } = useInView();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [triggerGetChats] = useLazyGetChatsQuery();
  const [status, setStatus] = useState("");
  const chats = useAppSelector(selectChats);
  const preferences = useAppSelector(selectPreferences);
  const allChatsFetched = useAppSelector(selectAllChatsFetched);
  const pathname = usePathname();
  const chatMode = pathname.split("/").slice(-1)[0];

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setStatus("loading");
        const res = await triggerGetChats({
          pageNo,
          pageLimit: 5,
          chatMode,
          excludeList: preferences.recentChats[chatMode].map(
            (chat) => chat._id
          ),
        }).unwrap();

        dispatch(setChats(res?.chats));
        setStatus("success");
        if (pageNo > 2 && res?.chats.length === 0)
          dispatch(setAllChatsFetched(true));
        pageNo++;
      } catch (error) {
        console.log(error);
        toast({
          description: "Something went wrong!",
          variant: "destructive",
        });
      }
    };

    if (inView && !allChatsFetched && !parentScrolling) fetchChats();
  }, [inView, parentScrolling]);

  return (
    <>
      {chats?.map((chat, chatIndex) => (
        <ChatDisplayElement
          chat={chat}
          key={chat._id}
          newTopic={newTopic}
          setNewTopic={setNewTopic}
          isRecentChat={false}
          chatIndex={chatIndex}
          chatCrudType={chatCrudType}
          setChatCrudType={setChatCrudType}
        />
      ))}

      <div
        ref={ref}
        className={`flex flex-col w-full py-2  justify-center items-center  ${
          chats.length === 0 &&
          status === "loading" &&
          "justify-center items-center h-full"
        } `}
      >
        {inView && status === "loading" && (
          <Loader
            size={25}
            className="animate-spin text-primary text-center mt-4 sm:mt-2  "
          />
        )}
      </div>
    </>
  );
};

export default ChatsScrollLoad;
