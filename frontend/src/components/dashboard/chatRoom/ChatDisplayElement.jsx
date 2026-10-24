import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckSquare, Loader2, X } from "lucide-react";
import ChatCrudDropdown from "./ChatCrudDropdown";
import { useToast } from "@/hooks/use-toast";
import {
  useDeleteChatMutation,
  useUpsertChatMutation,
} from "@/lib/features/services/chatApi";
import { useState } from "react";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectChats, setChats } from "@/lib/features/chat/chat.slice";
import {
  selectPreferences,
  setChatType,
  setPreferences,
} from "@/lib/features/preferences/preferences.slice";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";

const ChatDisplayElement = ({
  chat,
  isRecentChat,
  chatIndex,
  chatCrudType,
  setChatCrudType,
}) => {
  const [newTopic, setNewTopic] = useState("");
  const [upsertChat, { isLoading: isRenaming }] = useUpsertChatMutation();
  const [deleteChat, { isLoading: isDeleting }] = useDeleteChatMutation();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const preferences = useAppSelector(selectPreferences);
  const isSelectedChat = preferences.selectedChat === chat._id;
  const fetchedChats = useAppSelector(selectChats);
  const pathname = usePathname();
  const chatMode = pathname.split("/").slice(-1)[0];
  const recentChats = preferences?.recentChats[chatMode];
  // console.log(chatMode);

  const handleMutations = async (e) => {
    e.preventDefault();
    try {
      if (isDeleting || isRenaming) return;
      let response;
      if (chatCrudType === "rename") {
        const res = await upsertChat({
          chatId: chat?._id,
          topic: newTopic,
          chatMode,
        }).unwrap();
        response = res;

        const chats = Array.from(isRecentChat ? recentChats : fetchedChats);
        chats[chatIndex] = {
          ...chats[chatIndex],
          topic: newTopic,
        };
        dispatch(
          isRecentChat
            ? setPreferences({
                recentChats: {
                  ...structuredClone(preferences.recentChats),
                  [chatMode]: chats,
                },
              })
            : setChats({ chats })
        );
      } else if (chatCrudType === "delete") {
        const res = await deleteChat({ chatId: chat?._id }).unwrap();
        response = res;

        const chats = Array.from(isRecentChat ? recentChats : fetchedChats);
        chats.splice(chatIndex, 1);
        dispatch(
          isRecentChat
            ? setPreferences({
                recentChats: {
                  ...structuredClone(preferences.recentChats),
                  [chatMode]: chats,
                },
              })
            : setChats({ chats })
        );
        const selectChatId =
          recentChats && recentChats.length > 0 && chatIndex === 0
            ? recentChats[1]?._id
            : recentChats[0]?._id;

        if (!selectChatId) {
          dispatch(setChatType("new"));
        }

        dispatch(setPreferences({ selectedChat: selectChatId || "" }));
      }

      toast({
        description: response.message || "operation successful!",
        variant: "default",
      });

      setNewTopic("");
      setChatCrudType("");
    } catch (error) {
      console.log(error);
      toast({
        description:
          error?.data?.message || error.message || "Operation Failed!",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      onClick={() => {
        dispatch(setPreferences({ selectedChat: chat?._id }));
        !isSelectedChat && setChatCrudType("");
      }}
      className={`group flex relative h-12 w-full rounded-lg gap-2 items-center transition-all border
    ${
      isSelectedChat && !chatCrudType
        ? "bg-sidebar-accent border-sidebar-primary shadow-sm"
        : "bg-muted/60 hover:bg-sidebar-accent/50 border-transparent shadow-none"
    }`}
    >
      {isSelectedChat && !chatCrudType && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
      )}

      {chatCrudType === "rename" && isSelectedChat ? (
        <div className="flex items-center w-full gap-2 px-2 animate-in fade-in zoom-in-95 duration-200">
          <Input
            type="text"
            value={newTopic}
            placeholder="Rename chat..."
            className="h-8 text-sm focus-visible:ring-primary bg-background flex-1"
            autoFocus
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleMutations(e)}
          />
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              className="h-8 px-3 bg-primary"
              disabled={isRenaming || !newTopic.trim()}
              onClick={(e) => {
                e.stopPropagation();
                handleMutations(e);
              }}
            >
              {isRenaming ? "..." : "Save"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setChatCrudType("");
                setNewTopic("");
              }}
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      ) : chatCrudType === "delete" && isSelectedChat ? (
        <div className="flex items-center justify-between w-full px-3 animate-in slide-in-from-right-2">
          <p className="text-xs font-medium text-destructive">
            Delete this chat?
          </p>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="destructive"
              className="h-7 px-3 text-[11px] font-bold"
              onClick={(e) => {
                e.stopPropagation();
                handleMutations(e);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Confirm"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2"
              onClick={(e) => {
                e.stopPropagation();
                setChatCrudType("");
              }}
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="flex-1 text-sm pl-4 font-medium truncate text-sidebar-foreground">
            {chat?.topic}
          </p>

          <div className="pr-2">
            {!chatCrudType || !isSelectedChat ? (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ChatCrudDropdown
                  chatCrudType={chatCrudType}
                  setChatCrudType={setChatCrudType}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  setChatCrudType("");
                  setNewTopic("");
                }}
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatDisplayElement;
