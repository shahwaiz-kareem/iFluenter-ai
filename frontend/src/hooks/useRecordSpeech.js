"use client";

import { useState, useCallback, useContext, useRef } from "react";
import { socketContext } from "@/context/SocketProvider";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { selectRecentMessages } from "@/lib/features/chat/message.slice";
import { setAnimation } from "@/lib/features/chat/chat.slice";
import { useToast } from "./use-toast";

const WORKLET_CODE = `
class VocalProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.targetSampleRate = 16000;
    this.accumulator = 0;
    this.bufferSize = 4800; // 300ms at 16kHz
    this.buffer = new Int16Array(this.bufferSize);
    this.bufferIndex = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const channelData = input[0];
      // Access global sampleRate (input rate)
      const sampleRateRatio = sampleRate / this.targetSampleRate;

      for (let i = 0; i < channelData.length; i++) {
        this.accumulator++;
        if (this.accumulator >= sampleRateRatio) {
          // Convert Float32 to Int16
          let s = Math.max(-1, Math.min(1, channelData[i]));
          this.buffer[this.bufferIndex++] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          this.accumulator -= sampleRateRatio;

          if (this.bufferIndex >= this.bufferSize) {
            // Transfer the underlying buffer for maximum performance
            // No .slice() needed if we are replacing the buffer anyway
            const outputBuffer = this.buffer.buffer;
            this.port.postMessage(outputBuffer, [outputBuffer]);

            // Immediately re-allocate since the old buffer is now detached
            this.buffer = new Int16Array(this.bufferSize);
            this.bufferIndex = 0;
          }
        }
      }
    }
    return true;
  }
}
registerProcessor('vocalProcessor', VocalProcessor);
`;

const useRecordSpeech = (setIsDataSent, recordingStartedAtRef) => {
  const { socket } = useContext(socketContext);
  const [isRecording, setIsRecording] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const workletUrlRef = useRef(null); // Ref to store blob URL for cleanup

  const recentChats = useAppSelector(selectRecentMessages);

  const cleanup = useCallback(() => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (workletUrlRef.current) {
      URL.revokeObjectURL(workletUrlRef.current);
      workletUrlRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      // Required for many browsers to actually start processing
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }
      audioCtxRef.current = audioCtx;

      const blob = new Blob([WORKLET_CODE], { type: "application/javascript" });
      const moduleUrl = URL.createObjectURL(blob);
      workletUrlRef.current = moduleUrl;

      await audioCtx.audioWorklet.addModule(moduleUrl);

      const source = audioCtx.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(audioCtx, "vocalProcessor");

      workletNode.port.onmessage = (event) => {
        if (socket?.connected) {
          // console.log(event.data);
          socket.emit("audio-chunk", event.data);
        }
      };

      source.connect(workletNode);
      workletNode.connect(audioCtx.destination);

      recordingStartedAtRef.current = Date.now();
      setIsRecording(true);
      dispatch(setAnimation("idle"));
    } catch (err) {
      console.error("Start failed:", err);
      cleanup();
    }
  }, [socket, isRecording, dispatch, cleanup, recordingStartedAtRef]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return;

    const durationSeconds = Number(
      ((Date.now() - recordingStartedAtRef.current) / 1000).toFixed(2)
    );

    // Logic for sending data remains the same
    if (socket && durationSeconds > 0.8) {
      const contextCount = Number(
        process.env.NEXT_PUBLIC_AI_CONTEXT_MSG_COUNT || 5
      );
      const chatMessages = JSON.stringify(
        recentChats.slice(-contextCount).map((msg) => ({
          userMessage: msg.message,
          aiResponse: msg.aiResponse,
        }))
      );

      socket.emit("speech-ended", {
        chatMessages,
        userSpeechDuration: durationSeconds,
      });
      // console.log("hi");

      setIsDataSent(true);
    } else {
      toast({
        title: "✨ Quick Tip",
        description:
          "Press and hold the button to record, then release when you are finished. Recording must be longer than 1 second.",
        variant: "alert",
      });
    }
    setIsRecording(false);

    cleanup();
  }, [
    isRecording,
    socket,
    recentChats,
    setIsDataSent,
    cleanup,
    recordingStartedAtRef,
  ]);

  const cancelRecording = useCallback(() => {
    cleanup();
    socket.emit("speech-canceled");
    recordingStartedAtRef.current = null;
  }, [cleanup, recordingStartedAtRef]);

  return { startRecording, stopRecording, cancelRecording, isRecording };
};

export default useRecordSpeech;
