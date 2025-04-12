"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_controller_1 = __importDefault(require("../controllers/chat.controller"));
exports.default = (io) => {
    const users = {};
    const userRooms = {};
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        // ユーザー名設定
        socket.on("set_username", (username) => {
            users[socket.id] = username;
            console.log(`User ${username} (${socket.id}) connected`);
        });
        // メッセージ送信
        socket.on("send_message", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const username = users[socket.id];
                if (!username)
                    return;
                console.log(`Message from ${username}:`, data);
                console.log("User rooms:", data);
                const messageData = {
                    username,
                    message: data.message,
                    room: data.room || "",
                    timestamp: new Date(),
                };
                // コントローラーを使ってメッセージを保存
                const savedMessage = yield chat_controller_1.default.saveMessage(messageData);
                // 特定のルームか全体にメッセージをブロードキャスト
                if (data.room) {
                    socket.to(data.room).emit("receive_message", savedMessage);
                }
                else {
                    socket.broadcast.emit("receive_message", savedMessage);
                }
            }
            catch (error) {
                console.error("Error handling message:", error);
                socket.emit("error", { message: "Failed to send message" });
            }
        }));
        socket.on("join_room", (room) => {
            // Leave previous room if any
            if (userRooms[socket.id]) {
                socket.leave(userRooms[socket.id]);
            }
            // Join new room
            socket.join(room);
            userRooms[socket.id] = room;
            // Get username from our map
            const username = users[socket.id] || "Anonymous";
            console.log(`User ${username} joined room: ${room}`);
            // Notify everyone in the room
            io.to(room).emit("room_message", {
                type: "join",
                username: username,
                room: room,
                timestamp: new Date(),
            });
        });
        socket.on("leave_room", () => {
            const room = userRooms[socket.id];
            if (room) {
                socket.leave(room);
                // Notify everyone in the room
                io.to(room).emit("room_message", {
                    type: "leave",
                    username: users[socket.id] || "Anonymous",
                    room: room,
                    timestamp: new Date(),
                });
                // Remove room tracking
                delete userRooms[socket.id];
            }
        });
        // 切断
        socket.on("disconnect", () => {
            if (userRooms[socket.id]) {
                const disconnectMessage = {
                    type: "leave",
                    username: users[socket.id] || "Anonymous",
                    room: userRooms[socket.id],
                    timestamp: new Date(),
                };
                io.to(userRooms[socket.id]).emit("room_message", disconnectMessage);
            }
            console.log(`User ${users[socket.id] || "Anonymous"} disconnected`);
            delete users[socket.id];
            delete userRooms[socket.id];
        });
    });
};
