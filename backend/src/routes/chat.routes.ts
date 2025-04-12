import express from "express";
import chatController from "../controllers/chat.controller";

const chatRouter = express.Router();

// Get all chat messages
chatRouter.get("/", chatController.getAllChats);
chatRouter.get("/:roomId", chatController.getMessagesByRoom);

export default chatRouter;
