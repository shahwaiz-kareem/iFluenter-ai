"use client";
import CaptionsDisplay from "@/components/dashboard/chatRoom/CaptionsDisplay";

import ChatControls from "@/components/dashboard/chatRoom/ChatControls";
import ChatModal from "@/components/dashboard/chatRoom/ChatModal";
import AvatarRoom from "@/components/dashboard/chatRoom/AvatarRoom";
import DrawerSheet from "@/components/dashboard/chatRoom/DrawerSheet";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { calculateSizes } from "@/constant/chatRoom";
import "@/styles/chatRoom.css";
import useAudioChunkHandler from "@/hooks/useAudioChunkHandler";
import { lipsyncManager } from "@/lib/wawa-lipsync/lipsyncManager";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { selectIsDrawerOpen } from "@/lib/features/chat/chat.slice";

// import UsageCountDown from "./UsageCountDown";
import useSocket from "@/hooks/useSocket";
import useRickyVad from "@/hooks/useRickyVad";
import { userContext } from "@/context/UserProvider";

import {
  selectPreferences,
  selectCaptionsActive,
} from "@/lib/features/preferences/preferences.slice";
import {
  clearAllMessages,
  selectPageNo,
  setAllMsgsFetched,
  setChatIdChanged,
  setMessageFocusIndex,
  setPageNo,
  selectStatus,
} from "@/lib/features/chat/message.slice";
import useWakeLock from "@/hooks/useWakeLock";
// import useMicPermissionManager from "@/hooks/useMicPermissionManager";

const ChatRoomContainer = ({ mode }) => {
  const isSmall = useMediaQuery({ maxWidth: 440 });
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
  const dispatch = useAppDispatch();
  const isDrawerOpen = useAppSelector(selectIsDrawerOpen);

  const captionsActive = useAppSelector(selectCaptionsActive);
  const preferences = useAppSelector(selectPreferences);
  const messagesPageNo = useAppSelector(selectPageNo);
  const messagesStatus = useAppSelector(selectStatus);
  // const isSessionCreated = useAppSelector(selectSessionCreated);
  // const isTTSActiveRef = useRef(false);
  const audioElementRef = useRef(null);

  const { userData } = useContext(userContext);
  const [isInspiring, setIsInspiring] = useState(false);
  const [isDataSent, setIsDataSent] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const isUserPro = !userData?.subscriptionExpired;
  const sizes = useMemo(() => calculateSizes(isSmall, isMobile, isTablet), []);
  const { vad, vadRef } = useRickyVad({ setIsDataSent, isUserPro });

  const {
    addAudioChunk,
    isPlaying,
    audioTimestampRef,
    setChunksCompleted,
    addAudioTimestamp,
    audioDuration,
    setIsPlaying,
    isProcessingRef,
  } = useAudioChunkHandler(
    audioElementRef,
    lipsyncManager,
    setIsInspiring,
    vad,
    setIsDataSent
  );

  useSocket({
    audioElementRef,
    addAudioChunk,
    setIsPlaying,
    setChunksCompleted,
    addAudioTimestamp,
    setIsLimitReached,
    setIsDataSent,
    setIsInspiring,
    // isTTSActiveRef,
    mode,
  });

  useWakeLock();

  useEffect(() => {
    // if the chat id has changed do this
    if (messagesPageNo > 1 && messagesStatus && preferences?.selectedChat) {
      dispatch(clearAllMessages());
      dispatch(setAllMsgsFetched(false));
      dispatch(setMessageFocusIndex({ messageType: "", index: 0 }));
      dispatch(setPageNo(1));
      dispatch(setChatIdChanged(true));
      // dispatch(setStatus("loading"));
    }
  }, [preferences?.selectedChat]);

  return (
    <div className="relative w-full h-full ">
      {/* {!isUserPro && <UsageCountDown setIsLimitReached={setIsLimitReached} />} */}
      <audio ref={audioElementRef}></audio>
      {/* {!isUserPro && (!hasBrowserSupport || !recognitionSupport) ? (
        <SupportAndAvailabilityDisplay
          recognitionSupport={recognitionSupport}
          isTtsSupported={hasBrowserSupport}
        />
      ) : (
      )} */}

      <section className="w-full h-full">
        <div
          // ref={containerRef}5
          className={`lg:h-full w-full   ${
            isDrawerOpen && " lg:w-[71%] max-lg:max-h-[55%]  "
          } absolute inset-0 overflow-hidden`}
        >
          <Canvas
            resize={{ scroll: false }}
            shadows
            camera={{ position: [0, 0, 8], fov: 38 }}
            className="h-full w-full "
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.1,
              outputColorSpace: THREE.SRGBColorSpace,
            }}
            dpr={[1, 2]}
          >
            {/* <color attach="background" args={["#ececec"]} /> */}
            <directionalLight position={[2, 3, 6]} intensity={4.5} />
            <ambientLight intensity={1.5} />
            <AvatarRoom
              sizes={sizes}
              // isTTSActiveRef={isTTSActiveRef}
              vadRef={vadRef}
            />
            {/* {isInitialized && <AvatarRoom sizes={sizes} />} */}
          </Canvas>
          {isPlaying && captionsActive && (
            <CaptionsDisplay
              audioTimestampRef={audioTimestampRef}
              audioDuration={audioDuration}
              // renderId={renderId}
              audioElement={audioElementRef}
              isPlaying={isPlaying}
              isProcessingRef={isProcessingRef}
            />
          )}

          {!isLimitReached && (
            <ChatControls
              isTouchDevice={isSmall || isMobile || isTablet}
              isPlaying={isPlaying}
              isDataSent={isDataSent}
              setIsDataSent={setIsDataSent}
              isInspiring={isInspiring}
              setIsInspiring={setIsInspiring}
              vad={vad}
            />
          )}
          <DrawerSheet isMobile={isMobile} isTablet={isTablet} />
        </div>
        <ChatModal vad={vad} vadRef={vadRef} isLimitReached={isLimitReached} />
      </section>
    </div>
  );
};

export default ChatRoomContainer;
