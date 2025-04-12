"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import Message from "./Message";

const ChatRoom: React.FC = () => {
  const { username, messages, sendMessage, currentRoom } = useSocket();
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // クライアントサイドのマウント状態を追跡
  useEffect(() => {
    setMounted(true);
  }, []);

  // 新しいメッセージが来たら自動スクロール
  useEffect(() => {
    if (mounted) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, mounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && mounted) {
      // 実際のメッセージの送信はSocketProviderに委任
      // ここではUIの更新のみ行う
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  // サーバーサイドレンダリング時は何も表示しない
  if (!mounted) return null;

  // ユーザー名がない場合は何も表示しない
  if (!username) {
    return null;
  }

  return (
    <div className="chat-room-container">
      <div className="messages-container h-[60vh] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            {currentRoom
              ? `Welcome to ${currentRoom}! Start chatting.`
              : "Welcome to the general chat! Start chatting."}
          </div>
        ) : (
          messages.map((msg, index) => (
            <Message
              key={msg.id || `${index}-${msg.timestamp}`}
              message={msg}
              isCurrentUser={msg.username === username}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-form mt-4">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="input-field"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
