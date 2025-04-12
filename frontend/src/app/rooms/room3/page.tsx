"use client";

import React, { useEffect } from "react";
import ChatRoom from "../../components/ChatRoom";
import { useSocket } from "../../context/SocketProvider";
import { useRouter } from "next/navigation";

export default function Room3Page() {
  const { username, joinRoom, currentRoom } = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (!username) {
      router.push("/");
      return;
    }

    // ルーム3に参加
    joinRoom("room3");

    // クリーンアップ - このページから離れるときは何もしない (Socket Providerで管理)
  }, [username, joinRoom, router]);

  if (!username) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Room 3</h2>
      <div className="bg-blue-100 p-3 rounded-lg mb-4">
        <p className="text-sm">
          You are in <strong>room3</strong>.
          {currentRoom === "room3" ? " Connected!" : " Connecting..."}
        </p>
      </div>

      <ChatRoom />
    </div>
  );
}
