import { createContext, useContext, useMemo, ReactNode, FC } from "react";
import { io, Socket } from "socket.io-client";

// Define the type for the children prop
type SocketProviderProps = {
  children: ReactNode;
};

// Create a context for the socket with a default value of null and type Socket | null
const SocketContext = createContext<Socket | null>(null);

// Custom hook to use the socket
export const useSocket = (): Socket | null => {
  const socket = useContext(SocketContext);
  return socket;
};

// Create a provider for the socket
export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const socket = useMemo(() => io("http://localhost:8000"), []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
