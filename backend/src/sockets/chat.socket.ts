import { Server, Socket } from "socket.io";
import chatController from "../controllers/chat.controller";
import { time } from "console";

interface UserRooms {
  [socketId: string]: string;
}

interface Users {
  [socketId: string]: string;
}

interface MessageData {
  message: string;
  room?: string;
  id?: string;
}

interface RoomMessage {
  type: "join" | "leave";
  username: string;
  room: string;
  timestamp: Date;
}

export default (io: Server): void => {
  const users: Users = {};
  const userRooms: UserRooms = {};

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // ユーザー名設定
    socket.on("set_username", (username: string) => {
      users[socket.id] = username;
      console.log(`User ${username} (${socket.id}) connected`);
    });

    // メッセージ送信
    socket.on("send_message", async (data: MessageData) => {
      try {
        const username = users[socket.id];
        if (!username) return;

        console.log(`Message from ${username}:`, data);
        console.log("User rooms:", data);
        const messageData = {
          username,
          message: data.message,
          room: data.room || "",
          timestamp: new Date(),
        };

        // コントローラーを使ってメッセージを保存
        const savedMessage = await chatController.saveMessage(messageData);

        // 特定のルームか全体にメッセージをブロードキャスト
        if (data.room) {
          socket.to(data.room).emit("receive_message", savedMessage);
        } else {
          socket.broadcast.emit("receive_message", savedMessage);
        }
      } catch (error) {
        console.error("Error handling message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

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
        const disconnectMessage: RoomMessage = {
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
