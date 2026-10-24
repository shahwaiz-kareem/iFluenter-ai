"use client";

import { selectIsDrawerOpen } from "@/lib/features/chat/chat.slice";
import { useAppSelector } from "@/lib/hooks/hooks";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

const CaptionsDisplay = ({
  audioTimestampRef,
  audioElement,
  isPlaying,
  audioDuration,
}) => {
  const [currentWord, setCurrentWord] = useState("");
  const isDrawerOpen = useAppSelector(selectIsDrawerOpen);
  const rafRef = useRef();

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const loop = () => {
      const now = audioDuration.current + audioElement.current.currentTime;
      let matched = false;

      for (let i = 0; i < audioTimestampRef.current.length; i++) {
        const { start, end, word } = audioTimestampRef.current[i];

        if (start <= now && now <= end) {
          setCurrentWord(word);
          matched = true;
          // delete timestamp[i];
          break;
        }
      }
      if (!matched) {
        // optional: clear when no word matches
        // setCurrentWord("");
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, audioElement]);

  if (!currentWord) return;
  return (
    <div
      className={cn(
        "absolute  bottom-40  mx-auto flex items-center justify-center left-0 right-0 z-20 px-4",
        isDrawerOpen ? "max-lg:bottom-20" : ""
      )}
    >
      <div className="bg-black bg-opacity-75 rounded-md p-2 shadow-2xl border border-white/10 transition-all duration-300 ease-out transform ">
        <p className="text-white text-md  font-normal leading-relaxed font-sans tracking-tight">
          {currentWord.replaceAll("Eye-fluent-er", "iFluenter")}
        </p>
      </div>
    </div>
  );
};

export default CaptionsDisplay;
