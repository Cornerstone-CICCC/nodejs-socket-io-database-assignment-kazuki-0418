"use client";

import React from 'react';
import { useSocket } from '../context/SocketProvider';

const ROOMS = ['room1', 'room2', 'room3'];

const RoomSelector: React.FC = () => {
  const { currentRoom, joinRoom, leaveRoom } = useSocket();

  return (
    <div className="room-selector">
      <button
        type="button"
        onClick={() => leaveRoom()}
        className={`room-button ${!currentRoom ? 'active' : ''}`}
      >
        General
      </button>
      
      {ROOMS.map((room) => (
        <button
          key={room}
          type="button"
          onClick={() => joinRoom(room)}
          className={`room-button ${currentRoom === room ? 'active' : ''}`}
        >
          {room}
        </button>
      ))}
    </div>
  );
};

export default RoomSelector;