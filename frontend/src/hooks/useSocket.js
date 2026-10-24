import { socketContext } from "@/context/SocketProvider";
import { useAppDispatch } from "@/lib/hooks/hooks";
import { useContext, useEffect, useRef } from "react";
import { useToast } from "./use-toast";
import { getCookie } from "@/lib/utils";
import {
  focusRecentMsg,
  setRecentMessage,
} from "@/lib/features/chat/message.slice";
import { userContext } from "@/context/UserProvider";

import { setIsModalOpen } from "@/lib/features/chat/chat.slice";

const useSocket = ({
  addAudioChunk,
  setIsPlaying,
  setChunksCompleted,
  addAudioTimestamp,
  setIsLimitReached,
  isTTSActiveRef,
  setIsDataSent,
  setIsInspiring,
}) => {
  const { toast } = useToast();
  const { socket } = useContext(socketContext);
  const dispatch = useAppDispatch();
  const { userData } = useContext(userContext);
  const totalChunksCountRef = useRef(0);

  //Todo: ask chatgpt for the personalities of people and pick those which the people can relate with their friends or family.
  useEffect(() => {
    if (!userData._id) return;
    socket.connect();

    const isLimitReachedCookie = getCookie("usageLimitReached");
    if (isLimitReachedCookie) return setIsLimitReached(true);

    socket.on("rate-limit-exceeded", (exceededType) => {
      if (exceededType === "requests") {
        const expiryDate = new Date(Date.now() + 1000 * 60 * 10);
        document.cookie = `usageLimitReached=true; expires=${expiryDate}`;
      } else {
        const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
        expiryDate.setHours(0, 0, 0, 0);
        document.cookie = `usageLimitReached=true; expires=${expiryDate}`;
      }
      setIsLimitReached(true);
      dispatch(setIsModalOpen(true));
    });

    // socket.on("ai-response", (data) => {
    //   if (!hasBrowserSupport) return;
    //   speak(data, isTTSActiveRef);
    // });
    socket.on("total-chunks", (count) => {
      totalChunksCountRef.current = count;
    });

    socket.on("tts-audio-chunk", (data) => {
      addAudioChunk(data);
      setChunksCompleted(false);
    });

    socket.on("chunk-timestamps", (data) => {
      addAudioTimestamp(data);
    });

    socket.on("tts-completed", () => {
      // console.log("completed");
      setChunksCompleted(true);
    });
    socket.on("user-message", (userMessage) => {
      dispatch(setRecentMessage(userMessage));
      dispatch(focusRecentMsg());
    });

    socket.on("failure", (error) => {
      setIsPlaying(false);
      setIsInspiring(false);
      setIsDataSent(false);
      toast({
        description: error,
        variant: "destructive",
      });
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [userData._id]);
};

export default useSocket;
