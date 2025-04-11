import { Socket, Server } from "socket.io";

const handleRoomEvents = (io: Server, socket: Socket) => {
  // Join a room
  socket.on("joinRoom", (room: string) => {
    socket.join(room);
    io.to(room).emit("userJoined", {
      message: `User ${socket.id} has joined the room.`,
      room,
    });
  });

  // Leave a room
  socket.on("leaveRoom", (room: string) => {
    socket.leave(room);
    io.to(room).emit("userLeft", {
      message: `User ${socket.id} has left the room.`,
      room,
    });
  });

  // Handle chat messages in a specific room
  socket.on("sendMessage", (data: { room: string; message: string }) => {
    const { room, message } = data;
    io.to(room).emit("newMessage", { message, senderId: socket.id });
    console.log(`Message sent to room ${room}: ${message}`);
  });
};

export default {
  handleRoomEvents,
};
