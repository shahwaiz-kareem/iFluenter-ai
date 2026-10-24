"use client";
import { useEffect, useRef } from "react";

export default function useWakeLock() {
  const wakeLockRef = useRef(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      if ("wakeLock" in navigator && document.visibilityState === "visible") {
        try {
          wakeLockRef.current = await navigator.wakeLock.request("screen");

          // Optional: log when system releases it (e.g., low battery)
          wakeLockRef.current.addEventListener("release", () => {
            console.log("Wake Lock was released");
          });
        } catch (err) {
          console.error(`${err.name}, ${err.message}`);
        }
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, []);
}
