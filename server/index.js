import { Server } from "socket.io";

const io = new Server(8000, {
  cors: true,
});
const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();
io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);

  socket.on("room:join", (data) => {
    const { room, email } = data;
    console.log("Room joined", room, email);

    // Store socket and email mappings
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);

    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);

    io.to(socket.id).emit("room:join", data); // Emit the room join event back to the client
  });
});
