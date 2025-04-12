import { Request, Response } from "express";
import { Chat } from "../models/chat.model";

// Get all chats
const getAllChats = async (req: Request, res: Response) => {
  console.log("Fetching all chats");
  try {
    const chats = await Chat.find().sort({ createdAt: -1 }); // Sort by createdAt field
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chats" });
  }
};

const getMessagesByRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  console.log(`Fetching messages for room: ${roomId}`);

  try {
    const chats = await Chat.find({ roomId }).sort({ createdAt: -1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chats" });
  }
};

const saveMessage = async (messageData: {
  username: string;
  message: string;
  room?: string;
  timestamp?: Date;
}) => {
  try {
    const newMessage = new Chat({
      username: messageData.username,
      message: messageData.message,
      room: messageData.room || "",
      timestamp: messageData.timestamp?.toISOString() || new Date(),
    });

    const savedMessage = await newMessage.save();
    return savedMessage;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

export default {
  getAllChats,
  getMessagesByRoom,
  saveMessage,
};
