import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../src/context/SocketProvider";
import { useNavigate } from "react-router-dom";

const Lobby: React.FC = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const socket = useSocket();

  //handle the form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    socket?.emit("room:join", { email, room });
  };

  interface RoomData {
    room: string;
    email: string;
  }

  const navigate = useNavigate();
  const handleJoinRoom = useCallback(
    (data: RoomData) => {
      const { room, email } = data;
      console.log(`Joined room ${room} as ${email}`);
      navigate(`/room/${room}`);
    },
    [navigate]
  );
  useEffect(() => {
    socket?.on("room:join", handleJoinRoom);
    return () => {
      socket?.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);
  return (
    <>
      <form>
        <label htmlFor="email">Email Id</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <label htmlFor="roomNum">Room number</label>
        <input
          type="text"
          name="room"
          id="roomNum"
          value={room}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setRoom(e.target.value)
          }
        />
        <button type="submit" onClick={handleSubmit}>
          Join
        </button>
      </form>
    </>
  );
};

export default Lobby;
