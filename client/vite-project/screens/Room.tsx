import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../src/context/SocketProvider";
import peerService from "../service/peer";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const handleUserJoined = useCallback(
    ({ email, id }: { email: string; id: string }) => {
      console.log(`User ${email} joined room ${id}`);
      setRemoteSocketId(id);
    },
    []
  );

  const handleCallUser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const offer = peerService.getOffer();
      socket?.emit("user:call", { to: remoteSocketId, offer });
      setLocalStream(stream);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);
      const ans = await peerService.getAnswer(offer);
      socket?.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const handleCallAccepted = useCallback(({ from, ans }) => {
    peerService.setLocalDescription(ans);
    console.log("Call accepted from:", from);
  }, []);
  useEffect(() => {
    console.log("Socket connected:", !!socket);
    if (socket) {
      socket.on("user:joined", handleUserJoined);
      socket.on("incoming:call", handleIncomingCall);
      socket.on("call:accepted", handleCallAccepted);
      return () => {
        socket.off("user:joined", handleUserJoined);
        socket.off("incoming:call", handleIncomingCall);
        socket.off("call:accepted", handleCallAccepted);
      };
    }
  }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted]);

  return (
    <>
      <h1>Room Page</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}

      {localStream && (
        <video
          playsInline
          muted
          autoPlay
          ref={(video) => {
            if (video) {
              video.srcObject = localStream;
            }
          }}
          height={300}
          width={500}
        />
      )}
    </>
  );
};

export default RoomPage;
