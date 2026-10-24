// components/ChatControls.js
"use client";
import ChatForm from "@/components/forms/ChatForm";
import { socketContext } from "@/context/SocketProvider";
import { userContext } from "@/context/UserProvider";

import {
  selectIsDrawerOpen,
  selectIsModalOpen,
  setIsDrawerOpen,
  setIsModalOpen,
  selectMicPermissionStatus,
} from "@/lib/features/chat/chat.slice";
import { selectPreferences } from "@/lib/features/preferences/preferences.slice";
import { selectRecentMessages } from "@/lib/features/chat/message.slice";
import { useAppSelector } from "@/lib/hooks/hooks";

import {
  Keyboard,
  Settings,
  Mic2,
  MessageSquareText,
  X,
  Lightbulb,
} from "lucide-react";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import PremiumWrapper from "@/components/shared/PremiumWrapper";
import HoldRecordButton from "./HoldRecordButton";
import { cn } from "@/lib/utils";
import useMicPermissionManager from "@/hooks/useMicPermissionManager";

const ChatControls = ({
  setIsDataSent,
  isDataSent,
  isInspiring,
  setIsInspiring,
  vad,
}) => {
  const { userData } = useContext(userContext);
  const isUserPro = !userData?.subscriptionExpired;
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const { socket } = useContext(socketContext);
  const dispatch = useDispatch();

  const preferences = useAppSelector(selectPreferences);
  const isDrawerOpen = useAppSelector(selectIsDrawerOpen);
  const isChatModalOpen = useAppSelector(selectIsModalOpen);
  const recentMessages = useAppSelector(selectRecentMessages);
  const micPermissionStatus = useAppSelector(selectMicPermissionStatus);
  const { triggerPermissionManager } = useMicPermissionManager();

  const chatMessages = recentMessages
    .slice(Number(process.env.NEXT_PUBLIC_AI_CONTEXT_MSG_COUNT.toString()))
    .map((msg) => ({
      userMessage: msg.message,
      aiResponse: msg.aiResponse,
    }));

  const toggleKeyboardMode = () => {
    vad?.pause();
    setIsKeyboardMode((prev) => !prev);
  };
  const handleDrawerToggle = () => {
    dispatch(setIsDrawerOpen(!isDrawerOpen));
  };
  const handleModalToggle = () => {
    dispatch(setIsModalOpen(!isChatModalOpen));
  };

  const vadRecordingHandler = (e) => {
    e.preventDefault();
    if (micPermissionStatus === "unknown") triggerPermissionManager();
    if (isUserPro && preferences.voiceControl === "auto") {
      if (!vad?.listening) {
        return vad?.start();
      }
      socket.emit("speech-canceled");
      vad?.pause();
    }
  };

  const inspireUser = () => {
    setIsInspiring(true);
    vad?.pause();

    socket.emit("inspire", {
      chatMessages: JSON.stringify(chatMessages),
    });
    setIsDataSent(true);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full lg:w-1/2 max-lg:z-50 fixed lg:absolute gap-2 bottom-1 lg:bottom-2 left-0 right-0 mx-auto px-4">
      <div
        className={`
      w-full
      px-2
      absolute
      bottom-20
      transition-all duration-200 ease-in-out
      ${
        isKeyboardMode
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none -z-50"
      }
      `}
      >
        <ChatForm
          isDataSent={isDataSent}
          setIsDataSent={setIsDataSent}
          isKeyboardMode={isKeyboardMode}
        />
      </div>

      <div
        className="flex items-center justify-center  rounded-2xl  w-full max-w-lg lg:max-w-md px-2 sm:px-0  py-2  p transition-all duration-300"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background: "rgba(15, 15, 15, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="flex items-center justify-center rounded-2xl  w-full max-w-sm   transition-all duration-300">
          <div
            className={cn("flex-1 flex   items-center  justify-center gap-3")}
          >
            <button
              title="preferences"
              onClick={handleModalToggle}
              className="rounded-full cursor-pointer hover:bg-primary/20 bg-white/10 h-9 w-9 flex items-center justify-center p-2 transition-colors duration-200"
            >
              <Settings className="text-xl text-white" />
            </button>
            {/* <PremiumWrapper iconClass="scale-75 -top-2 -right-1.5">
              <button
                title="captions"
                disabled={!isUserPro}
                onClick={() => dispatch(toggleCaptionsActive())}
                className={`rounded-full h-9 w-9 flex items-center justify-center p-2 transition-colors duration-200 shadow-2xl ${
                  isUserPro
                    ? "hover:bg-primary/20 cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                } ${
                  isUserPro && captionsActive
                    ? "bg-white/10 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                {captionsActive ? (
                  <Captions className="text-xl" />
                ) : (
                  <CaptionsOff className="text-xl" />
                )}
              </button>
            </PremiumWrapper> */}
            <button
              title="Inspire"
              className="rounded-full cursor-pointer disabled:cursor-auto disabled:bg-zinc-600 hover:bg-primary/20 bg-white/10 text-yellow-300 h-9 w-9 flex items-center justify-center p-2 transition-colors duration-200"
              onClick={inspireUser}
              disabled={isDataSent}
            >
              <Lightbulb
                fill={isInspiring ? "yellow" : "none"}
                className="text-xl"
              />
            </button>
          </div>

          <div className="flex-none flex items-center justify-center ">
            {preferences?.voiceControl === "manual" ? (
              <HoldRecordButton
                isDataSent={isDataSent}
                isKeyboardMode={isKeyboardMode}
                setIsDataSent={setIsDataSent}
                vad={vad}
              />
            ) : (
              <button
                onClick={vadRecordingHandler}
                disabled={
                  isDataSent ||
                  isKeyboardMode ||
                  micPermissionStatus === "denied"
                }
                className={`rounded-full relative transition-colors shadow-2xl disabled:cursor-auto h-14 w-14 cursor-pointer flex items-center justify-center bg-white p-2 select-none ${
                  vad?.listening ? " text-white" : "bg-primary text-white"
                } disabled:bg-zinc-600`}
              >
                {vad?.listening ? (
                  <ul className="flex items-center justify-center relative p-0 m-0 transition-all duration-200">
                    <li className="wave-li bg-white"></li>
                    <li className="wave-li bg-white"></li>
                    <li className="wave-li bg-white"></li>
                    <li className="wave-li bg-white"></li>
                    <li className="wave-li bg-white"></li>
                  </ul>
                ) : (
                  <ul className="flex items-center justify-center relative p-0 m-0 text-black">
                    <li className="w-[2px] h-2 rounded-full bg-black m-[2px]"></li>
                    <li className="w-[2px] h-3 rounded-full bg-black m-[2px]"></li>
                    <li className="w-[2px] h-4 rounded-full bg-black m-[2px]"></li>
                    <li className="w-[2px] h-3 rounded-full bg-black m-[2px]"></li>
                    <li className="w-[2px] h-2 rounded-full bg-black m-[2px]"></li>
                  </ul>
                )}
              </button>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center gap-3">
            <button
              title="keyboard Mode"
              onClick={toggleKeyboardMode}
              className={`rounded-full cursor-pointer h-9 w-9 flex items-center justify-center p-2 transition-colors duration-200 ${
                isKeyboardMode
                  ? "bg-primary text-white"
                  : "bg-white/10 hover:bg-primary/20 text-white"
              }`}
            >
              {isKeyboardMode ? (
                <Mic2 className="text-xl" />
              ) : (
                <Keyboard className="text-xl" />
              )}
            </button>
            <button
              title="Chats"
              onClick={handleDrawerToggle}
              className={`rounded-full cursor-pointer transition-all duration-150 hover:bg-primary/20 bg-white/10 h-9 w-9 flex items-center justify-center p-2 text-white ${
                isDrawerOpen ? "bg-primary" : ""
              }`}
            >
              {isDrawerOpen ? (
                <X className="text-xl" />
              ) : (
                <MessageSquareText className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatControls;
