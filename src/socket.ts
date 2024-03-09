import { io, Socket } from "socket.io-client";

export const initSocket = async (): Promise<Socket> => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const options = {
    reconnectionAttempts: Infinity,
    timeout: 1000,
    transports: ["websocket"],
  };
  return io(BACKEND_URL, options);
};
