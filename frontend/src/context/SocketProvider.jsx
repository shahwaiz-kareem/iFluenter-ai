"use client";
import io from "socket.io-client";
import { createContext, useMemo } from "react";

export const socketContext = createContext();
const SocketProvider = ({ children }) => {
  const socket = useMemo(
    () =>
      io(process.env.NEXT_PUBLIC_BACKEND_HOST, {
        withCredentials: true,
        path: "/socket.io",
        transports: ["websocket", "polling"],
        // autoConnect: false,
      }),
    []
  );

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
};

export default SocketProvider;
