"use client";

import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";

const UsernameForm: React.FC = () => {
  const { username, setUsername } = useSocket();
  const [inputUsername, setInputUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ユーザー名が設定されているか確認するデバッグ用
  useEffect(() => {
    console.log("Current username from context:", username);
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim() && !isSubmitting) {
      setIsSubmitting(true);
      console.log("Username submitted:", inputUsername.trim());

      // ユーザー名を設定
      setUsername(inputUsername.trim());

      // 少し待ってからステートを確認
      setTimeout(() => {
        console.log("After setUsername, username is:", username);
        setIsSubmitting(false);
      }, 500);
    }
  };

  // すでにユーザー名があれば表示しない
  if (username) {
    console.log("Username exists, not rendering form:", username);
    return null;
  }

  return (
    <div className="welcome-form">
      <h2 className="text-xl font-bold mb-4">Welcome to the Chat</h2>
      <p className="text-gray-600 mb-4">
        Enter your username to start chatting
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            placeholder="Your username"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full ${
            isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white font-medium py-2 px-4 rounded focus:outline-none`}
        >
          {isSubmitting ? "Joining..." : "Join Chat"}
        </button>
      </form>
    </div>
  );
};

export default UsernameForm;
