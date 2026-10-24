import { socketContext } from "@/context/SocketProvider";
import { setAnimation } from "@/lib/features/chat/chat.slice";
import { selectRecentMessages } from "@/lib/features/chat/message.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { useMicVAD } from "@ricky0123/vad-react";
import { useContext, useEffect, useRef } from "react";

const useRickyVad = ({ isUserPro, setIsDataSent }) => {
  if (!isUserPro) return { vad: null };
  const { socket } = useContext(socketContext);
  const recordingStartedAtRef = useRef(null);
  const vadRef = useRef(null);
  const workerRef = useRef();
  const firstChunkTimestamp = useRef(null);
  const chunksRef = useRef([]);
  const dispatch = useAppDispatch();

  let vad = {};

  const recentMessages = useAppSelector(selectRecentMessages);

  // const preferences = useAppSelector(selectPreferences);

  const chatMessages = recentMessages
    .slice(Number(process.env.NEXT_PUBLIC_AI_CONTEXT_MSG_COUNT.toString()))
    .map((msg) => ({
      userMessage: msg.message,
      aiResponse: msg.aiResponse,
    }));

  const emitSpeechEnd = () => {
    console.log("I'm here");

    vad?.pause();

    const audioDuration = Number(
      ((Date.now() - recordingStartedAtRef.current) / 1000).toFixed(2)
    );

    if (audioDuration > 1) {
      socket.emit("speech-ended", {
        chatMessages: JSON.stringify(chatMessages),

        userSpeechDuration: audioDuration,
      });

      setIsDataSent(true);
    }
  };

  const sendDataToWorker = (data) => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "chunk",
        payload: data,
      });
    }
  };

  // console.log(preferences.redemptionMs);

  vad = useMicVAD({
    //To fix start on load bug in production
    ...(process.env.NODE_ENV !== "production" ? {} : { startOnLoad: false }),
    model: "v5",
    // If you are in a noisy room, bump to 0.6.
    positiveSpeechThreshold: 0.4,
    negativeSpeechThreshold: 0.35, // When to start considering speech "ended"
    baseAssetPath:
      "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.27/dist/",
    onnxWASMBasePath:
      "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/",
    onSpeechRealStart: () => {
      dispatch(setAnimation("idle"));
      recordingStartedAtRef.current = Date.now();
    },

    onFrameProcessed: (probabilities, chunk) => {
      if (probabilities.isSpeech > 0.4) {
        if (!firstChunkTimestamp.current)
          firstChunkTimestamp.current = Date.now();

        chunksRef.current.push(chunk);
      }

      if (
        Date.now() - firstChunkTimestamp.current < 300 ||
        chunksRef.current.length === 0
      )
        return;

      const chunks = chunksRef.current;

      chunksRef.current = [];

      firstChunkTimestamp.current = null;

      sendDataToWorker(chunks);
    },

    onSpeechEnd: () => {
      // console.log("on speech end fired");
      emitSpeechEnd();
    },
  });

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../../public/workers/makeWav.js", import.meta.url),

      {
        type: "module",
      }
    );

    workerRef.current.onmessage = (event) => {
      // console.log("sending chunk", event.data);

      socket.emit("audio-chunk", event.data);
    };

    workerRef.current.onerror = (error) => {
      console.error("Worker error:", error);
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  useEffect(() => {
    if (vad) {
      vadRef.current = vad;
    }
  }, [vad]);

  return { vad, vadRef };
};

export default useRickyVad;
