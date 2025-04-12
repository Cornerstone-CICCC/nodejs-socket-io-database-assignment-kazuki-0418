"use client";

import React from 'react';
import Link from 'next/link';
import { useSocket } from '../context/SocketProvider';

export default function RoomsPage() {
  const { username } = useSocket();
  const rooms = ['room1', 'room2', 'room3'];

  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold mb-4">Please set your username first</h2>
        <Link 
          href="/" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Select a Chat Room</h1>
      
      <div className="grid gap-4">
        <Link 
          href="/"
          className="block p-4 bg-white border rounded-lg hover:bg-gray-50 shadow-sm"
        >
          <h2 className="text-lg font-medium">General Chat</h2>
          <p className="text-gray-600">Public chat room for everyone</p>
        </Link>
        
        {rooms.map(room => (
          <Link 
            key={room}
            href={`/rooms/${room}`}
            className="block p-4 bg-white border rounded-lg hover:bg-gray-50 shadow-sm"
          >
            <h2 className="text-lg font-medium">{room}</h2>
            <p className="text-gray-600">Enter {room} chat room</p>
          </Link>
        ))}
      </div>
    </div>
  );
}