"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleRoomEvents = (io, socket) => {
    // Join a room
    socket.on("joinRoom", (room) => {
        socket.join(room);
        io.to(room).emit("userJoined", {
            message: `User ${socket.id} has joined the room.`,
            room,
        });
    });
    // Leave a room
    socket.on("leaveRoom", (room) => {
        socket.leave(room);
        io.to(room).emit("userLeft", {
            message: `User ${socket.id} has left the room.`,
            room,
        });
    });
    // Handle chat messages in a specific room
    socket.on("sendMessage", (data) => {
        const { room, message } = data;
        io.to(room).emit("newMessage", { message, senderId: socket.id });
        console.log(`Message sent to room ${room}: ${message}`);
    });
};
exports.default = {
    handleRoomEvents,
};
