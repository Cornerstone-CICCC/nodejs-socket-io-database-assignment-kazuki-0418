"use client";

import React, { useEffect } from "react";
import ChatRoom from "../../components/ChatRoom";
import { useSocket } from "../../context/SocketProvider";
import { useRouter } from "next/navigation";

export default function Room2Page() {
  const { username, joinRoom, currentRoom } = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (!username) {
      router.push("/");
      return;
    }

    // ルーム2に参加
    joinRoom("room2");

    // クリーンアップ - このページから離れるときは何もしない (Socket Providerで管理)
  }, [username, joinRoom, router]);

  if (!username) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Room 2</h2>
      <div className="bg-green-100 p-3 rounded-lg mb-4">
        <p className="text-sm">
          You are in <strong>room2</strong>.
          {currentRoom === "room2" ? " Connected!" : " Connecting..."}
        </p>
      </div>

      <ChatRoom />
    </div>
  );
}
