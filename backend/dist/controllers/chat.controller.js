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
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = require("../models/chat.model");
// Get all chats
const getAllChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Fetching all chats");
    try {
        const chats = yield chat_model_1.Chat.find().sort({ createdAt: -1 }); // Sort by createdAt field
        res.status(200).json(chats);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching chats" });
    }
});
const getMessagesByRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    console.log(`Fetching messages for room: ${roomId}`);
    try {
        const chats = yield chat_model_1.Chat.find({ roomId }).sort({ createdAt: -1 });
        res.status(200).json(chats);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching chats" });
    }
});
const saveMessage = (messageData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const newMessage = new chat_model_1.Chat({
            username: messageData.username,
            message: messageData.message,
            room: messageData.room || "",
            timestamp: ((_a = messageData.timestamp) === null || _a === void 0 ? void 0 : _a.toISOString()) || new Date(),
        });
        const savedMessage = yield newMessage.save();
        return savedMessage;
    }
    catch (error) {
        console.error("Error saving message:", error);
        throw error;
    }
});
exports.default = {
    getAllChats,
    getMessagesByRoom,
    saveMessage,
};
