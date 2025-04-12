"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleRoomEvents = (io, socket) => {
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
