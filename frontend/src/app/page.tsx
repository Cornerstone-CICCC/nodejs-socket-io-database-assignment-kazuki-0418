"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import UsernameForm from "./components/UsernameForm";
import ChatRoom from "./components/ChatRoom";
import { useSocket } from "./context/SocketProvider";

export default function Home() {
  const { username, currentRoom, leaveRoom } = useSocket();
  const [isLoaded, setIsLoaded] = useState(false);

  // ページがロードされたことを示すフラグ
  useEffect(() => {
    setIsLoaded(true);

    // ホームページに来たときは一般チャットに戻る
    if (username && currentRoom) {
      leaveRoom();
    }
  }, [username, currentRoom, leaveRoom]);

  // usernameの状態をデバッグ用にログ出力
  useEffect(() => {
    if (isLoaded) {
      console.log("Home page - Current username:", username);
    }
  }, [username, isLoaded]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Real-time Chat App</h1>

        {username && (
          <Link
            href="/rooms"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Browse Rooms
          </Link>
        )}
      </div>

      {username ? (
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <p>
            Logged in as: <strong>{username}</strong> | Current room:{" "}
            <strong>General Chat</strong>
          </p>
        </div>
      ) : (
        <p className="text-gray-600 mb-6">Please log in to start chatting</p>
      )}

      <UsernameForm />

      {username && <ChatRoom />}
    </div>
  );
}
