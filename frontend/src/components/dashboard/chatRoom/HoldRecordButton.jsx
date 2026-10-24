"use client";

import React, { useState, useRef } from "react";
import { useGesture } from "@use-gesture/react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useRecordSpeech from "@/hooks/useRecordSpeech";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectMicPermissionStatus } from "@/lib/features/chat/chat.slice";
import useMicPermissionManager from "@/hooks/useMicPermissionManager";

export default function AudioRecordButton({
  setIsDataSent,
  isDataSent,
  isKeyboardMode,
}) {
  const [status, setStatus] = useState("idle");
  const [dragDir, setDragDir] = useState("");

  const recordingStartedAtRef = useRef(null);
  const micPermissionStatus = useAppSelector(selectMicPermissionStatus);
  const statusRef = useRef("idle");

  const { stopRecording, startRecording, cancelRecording } = useRecordSpeech(
    setIsDataSent,
    recordingStartedAtRef
  );
  const { triggerPermissionManager } = useMicPermissionManager();

  const updateStatus = (val) => {
    statusRef.current = val;
    setStatus(val);
  };

  const THRESHOLD = -60;

  const startAudio = async () => {
    if (isKeyboardMode) return;
    recordingStartedAtRef.current = Date.now();
    if (micPermissionStatus === "unknown") triggerPermissionManager();
    startRecording();
  };

  const stopAudio = () => {
    setTimeout(() => {
      if (isKeyboardMode) return;
      stopRecording(recordingStartedAtRef.current);
      updateStatus("idle");
    }, 300);
  };

  const cancelAudio = () => {
    console.log("Recording Cancelled");
    if (isKeyboardMode) return;
    recordingStartedAtRef.current = null;
    cancelRecording();
    updateStatus("idle");
  };

  const bind = useGesture(
    {
      onDrag: ({ active, movement: [mx, my], last, first }) => {
        if (first) {
          if (statusRef.current === "idle") {
            updateStatus("recording");
            startAudio();
          }
        }

        if (active) {
          if (my < THRESHOLD) setDragDir("up");
          else setDragDir(null);
        }

        if (last) {
          if (my < THRESHOLD) {
            cancelAudio();
          } else {
            console.log("I'm in ");
            if (statusRef.current === "recording") {
              stopAudio();
            }
          }
          setDragDir(null);
        }
      },
      onPointerDown: () => {
        if (statusRef.current === "idle") {
          updateStatus("recording");
          startAudio();
        }
      },
    },
    {
      drag: {
        filterTaps: true,
        threshold: 0,
      },
    }
  );

  return (
    <div className="relative">
      {status === "recording" && (
        <div
          className={cn(
            "transition-all duration-200 left-[17px] -top-[60px]  absolute flex flex-col items-center",
            dragDir === "up"
              ? "text-primary scale-125 opacity-100"
              : "text-muted-foreground opacity-90"
          )}
        >
          <Trash2
            className={cn(
              "w-6 h-6 text-red-500",
              dragDir === "up" && "scale-125"
            )}
          />
        </div>
      )}

      <div className="relative">
        {/* Recording pulse / aura effect */}
        {status === "recording" && (
          <>
            <span className="absolute inset-0 rounded-full bg-white/30 animate-recording-pulse" />
            <span className="absolute inset-0 rounded-full bg-white/20 animate-recording-pulse delay-300" />
          </>
        )}

        <Button
          {...bind()}
          size="icon"
          disabled={
            isKeyboardMode || micPermissionStatus === "denied" || isDataSent
          }
          className={cn(
            "w-14 h-14 rounded-full shadow-xl relative touch-none select-none z-10 transition-all bg-white hover:bg-white active:scale-95",
            status === "recording" && "scale-110 ",
            status === "locked" && "ring-4 ring-destructive/20"
          )}
        >
          <div
            className={cn(
              "scale-150",
              status === "recording" && "animate-pulse"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              color=""
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </div>
        </Button>
      </div>
    </div>
  );
}
