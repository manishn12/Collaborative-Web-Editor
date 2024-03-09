import { io, Socket } from "socket.io-client";

export const initSocket = async (): Promise<Socket> => {
  console.log(import.meta.env.VITE_BACKEND_URL);
  const options = {
    reconnectionAttempts: Infinity,
    timeout: 1000,
    transports: ["websocket"],
  };
  return io("/", options);
};
