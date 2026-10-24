"use client";

import { selectAnimation, setAnimation } from "@/lib/features/chat/chat.slice";
import { selectPreferences } from "@/lib/features/preferences/preferences.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { useEffect, useRef, useState } from "react";
import { randInt } from "three/src/math/MathUtils";

const useAudioChunkHandler = (
  audioElementRef,
  lipsyncManager,
  setIsInspiring,
  vad,
  setIsDataSent
) => {
  const dispatch = useAppDispatch();
  const chunksCompleted = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioTimestampRef = useRef([]);
  const preferences = useAppSelector(selectPreferences);
  const [audioChunks, setAudioChunks] = useState([]);
  const [process, setProcess] = useState(true);
  const isProcessingRef = useRef(false);
  const audioDurationRef = useRef(0);
  const setChunksCompleted = (state) => {
    chunksCompleted.current = state;
  };
  const setIsProcessingRef = (state) => {
    isProcessingRef.current = state;
  };
  const addAudioChunk = (chunk) => {
    setAudioChunks((prev) => [...prev, chunk]);
  };
  const addAudioTimestamp = (data) => {
    audioTimestampRef.current = [...audioTimestampRef.current, ...data];
  };

  useEffect(() => {
    //Start playing available audio chunks
    if (!isProcessingRef.current && audioChunks.length >= 1) {
      try {
        setIsProcessingRef(true);
        setProcess(false);
        // if (animation !== "talking") dispatch(setAnimation("idle"));
        // Create blob from all available chunks
        const chunks = [...audioChunks];
        setAudioChunks([]);

        if (chunks.length === 0) {
          setIsProcessingRef(false);
          return;
        }

        const audioBlob = new Blob(chunks, { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);

        if (!audioElementRef.current) {
          console.error("Audio element ref is null");
          setIsProcessingRef(false);
          return;
        }

        // Set up event listeners before changing src
        let interval;
        let count = 0;

        const handleLoadedData = () => {
          audioElementRef.current.removeEventListener(
            "loadeddata",
            handleLoadedData
          );

          // Connect to lipsync after audio is loaded
          if (lipsyncManager) {
            lipsyncManager.connectAudio(audioElementRef.current);
          }

          audioElementRef.current
            .play()
            .then(() => {
              if (!isPlaying) {
                setIsPlaying(true);
              }
            })
            .catch((error) => {
              console.error("Error playing audio:", error);
              setIsProcessingRef(false);
            });

          //Random talking animation applied
          if (audioElementRef.current.duration >= 5) {
            // console.log(audioElementRef.current.duration);
            let talkingAnimationRange = Math.floor(
              audioElementRef.current.duration - 3
            );
            let talkingAnimationSecond = randInt(1, talkingAnimationRange);
            interval = setInterval(() => {
              if (talkingAnimationSecond === count) {
                dispatch(setAnimation("talking"));
                clearInterval(interval);
              }
              count++;
            }, 1000);
          }
        };

        const handleEnded = () => {
          count = 0;
          clearInterval(interval);
          audioDurationRef.current =
            audioDurationRef.current + audioElementRef.current.duration;
          audioElementRef.current.removeEventListener("ended", handleEnded);
          setIsProcessingRef(false);
          // Clean up the URL
          URL.revokeObjectURL(audioUrl);
          setProcess(true);
        };

        const handleError = (error) => {
          console.error("Audio error:", error);
          audioElementRef.current.removeEventListener("error", handleError);
          setIsProcessingRef(false);
          URL.revokeObjectURL(audioUrl);
        };

        audioElementRef.current.crossOrigin = "anonymous";
        audioElementRef.current.preload = "auto";
        audioElementRef.current.addEventListener(
          "loadeddata",
          handleLoadedData
        );
        audioElementRef.current.addEventListener("ended", handleEnded);
        audioElementRef.current.addEventListener("error", handleError);
        audioElementRef.current.src = audioUrl;
      } catch (error) {
        console.error("Error in processNextChunk:", error);
        setIsProcessingRef(false);
      }
    }

    //Reset states when audio completely played
    if (
      !isProcessingRef.current &&
      audioChunks.length === 0 &&
      chunksCompleted.current
    ) {
      // dispatch(setAnimation("idle"));
      setIsPlaying(false);
      setIsInspiring(false);
      setIsDataSent(false);
      setAudioChunks([]);
      audioTimestampRef.current = [];
      chunksCompleted.current = false;
      audioDurationRef.current = 0;

      if (preferences.voiceControl === "auto") vad.start();
    }
  }, [audioChunks.length, process]);

  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = "";
      }
      setAudioChunks([]);
      audioTimestampRef.current = [];
      chunksCompleted.current = false;
      audioDurationRef.current = 0;
    };
  }, []);

  return {
    addAudioTimestamp,
    setChunksCompleted,
    addAudioChunk,
    setIsPlaying,
    isPlaying,
    audioDuration: audioDurationRef,
    audioTimestampRef,
    process,
    chunksCompleted,
    isProcessingRef,
  };
};

export default useAudioChunkHandler;
