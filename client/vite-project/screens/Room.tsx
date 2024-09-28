import { useCallback, useEffect } from "react";
import { useSocket } from "../src/context/SocketProvider";

const RoomPage = () => {
  const socket = useSocket();

  const handleUserJoined = useCallback(
    ({ email, id }: { email: string; id: string }) => {
      console.log(`User ${email} joined room ${id}`);
    },
    []
  );

  useEffect(() => {
    console.log("Socket connected:", !!socket);
    if (socket) {
      socket.on("user:joined", handleUserJoined);
      return () => {
        socket.off("user:joined", handleUserJoined);
      };
    }
  }, [socket, handleUserJoined]);
  return <></>;
};
export default RoomPage;
