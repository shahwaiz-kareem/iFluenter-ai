import { socketContext } from "@/context/SocketProvider";
import {
  selectIsDrawerOpen,
  setIsModalOpen,
} from "@/lib/features/chat/chat.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { Timer } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";

const UsageCountDown = ({ setIsLimitReached }) => {
  const totalLimit = 60 * 10; //10 minutes daily limit
  const { socket } = useContext(socketContext);
  const [remainingSeconds, setRemainingSeconds] = useState(totalLimit);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds % 60);
  const isDrawerOpen = useAppSelector(selectIsDrawerOpen);
  const [sessionStarted, setSessionStarted] = useState(false);
  const intervalRef = useRef(null);
  const remainingSecondsRef = useRef(0);
  const dispatch = useAppDispatch();
  useEffect(() => {
    socket.on("total-used-seconds", (usedSeconds) => {
      setRemainingSeconds(totalLimit - usedSeconds);
      remainingSecondsRef.current = totalLimit - usedSeconds;
    });
    socket.on("start-session", () => {
      setSessionStarted(true);
    });
  }, []);

  useEffect(() => {
    if (sessionStarted) {
      intervalRef.current = setInterval(() => {
        if (remainingSecondsRef.current !== 0) {
          setRemainingSeconds(remainingSecondsRef.current - 1);
          remainingSecondsRef.current = remainingSecondsRef.current - 1;
        }
        if (remainingSecondsRef.current <= 0) {
          dispatch(setIsModalOpen(true));
          setIsLimitReached(true);
          setRemainingSeconds(0);
          remainingSecondsRef.current = 0;
          const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
          expiryDate.setHours(0, 0, 0, 0);
          document.cookie = `usageLimitReached=true; expires=${expiryDate}`;
          clearInterval(intervalRef.current);
        }
      }, 1000);
      // sessionStarted(false);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [sessionStarted]);

  return (
    <div
      className={`absolute right-4 ${
        isDrawerOpen && "lg:-translate-x-96 duration-300"
      } top-2 h-12  z-50`}
    >
      <div className="bg-black bg-opacity-75 rounded-md px-2 py-1 shadow-2xl border border-white/10 transition-all duration-300 ease-out transform ">
        <span className="text-white text-md lg:text-lg font-medium leading-relaxed font-sans tracking-tight flex gap-1 items-center justify-center">
          <Timer size={22} />
          <p className="mt-0.5">
            {minutes < 10 ? "0" + minutes : minutes}
            {":"}
            {seconds < 10 ? "0" + seconds : seconds}
          </p>
        </span>
      </div>
    </div>
  );
};

export default UsageCountDown;
