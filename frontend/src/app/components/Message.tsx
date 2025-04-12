"use client";

import React from 'react';
import { Message as MessageType } from '../context/SocketProvider';

interface MessageProps {
  message: MessageType;
  isCurrentUser: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isCurrentUser }) => {
  if (message.type === 'system') {
    return (
      <div className="system-message">
        {message.message}
        <div className="message-timestamp">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    );
  }

  return (
    <div className={`message ${isCurrentUser ? 'user-message' : 'other-message'}`}>
      <div className="message-sender">{message.username}</div>
      <div className="message-content">{message.message}</div>
      <div className="message-timestamp">
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Message;