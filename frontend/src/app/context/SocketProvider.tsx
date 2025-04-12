"use client";

import { time } from "console";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  username: string;
  setUsername: (name: string) => void;
  currentRoom: string | null;
  joinRoom: (room: string) => void;
  leaveRoom: () => void;
  messages: Message[];
  sendMessage: (content: string) => void;
  isConnected: boolean;
  connectionError: string | null;
}

export interface Message {
  id?: string;
  username: string;
  message: string;
  room?: string;
  timestamp: Date;
  type?: "message" | "system";
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  username: "",
  setUsername: () => {},
  currentRoom: null,
  joinRoom: () => {},
  leaveRoom: () => {},
  messages: [],
  sendMessage: () => {},
  isConnected: false,
  connectionError: null,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsernameState] = useState<string>("");
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const pendingMessagesRef = useRef<Set<string>>(new Set());
  const connectAttempts = useRef(0);

  // クライアントサイドのマウント状態を追跡
  useEffect(() => {
    setMounted(true);

    // ローカルストレージからユーザー名を取得
    try {
      const savedUsername = sessionStorage.getItem("chat-username");
      if (savedUsername) {
        setUsernameState(savedUsername);
      }
    } catch (error) {
      console.error("Error accessing sessionStorage:", error);
    }

    return () => {
      // クリーンアップ
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Socket.ioの初期化 - マウント後のみ
  useEffect(() => {
    if (!mounted) return;

    // バックエンドのURL（ポート4500）
    const SOCKET_URL = "http://localhost:4500";
    setConnectionError(null);

    // 開発環境でもバックエンドがある場合は実際の接続を試みる
    try {
      console.log("Attempting to connect to socket server at:", SOCKET_URL);
      connectAttempts.current += 1;

      // 実際のSocket.io接続
      const newSocket = io(SOCKET_URL, {
        reconnectionAttempts: 5,
        timeout: 10000,
      });

      newSocket.on("connect", () => {
        console.log("Connected to server successfully!");
        setIsConnected(true);
        setConnectionError(null);

        if (username) {
          console.log("Emitting username:", username);
          newSocket.emit("set_username", username);
        }
      });

      newSocket.on("connect_error", (err) => {
        console.error("Connection error:", err.message);
        setConnectionError(`Failed to connect: ${err.message}`);
        setIsConnected(false);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server");
        setIsConnected(false);
      });

      newSocket.on("receive_message", (message: Message) => {
        const isOwnPendingMessage =
          message.id &&
          message.username === username &&
          pendingMessagesRef.current.has(message.id);

        if (!isOwnPendingMessage) {
          setMessages((prev) => {
            // Also check if we've already added this exact message to our state
            // This handles cases where the server might send the same message multiple times
            const isDuplicate = prev.some(
              (m) =>
                m.id === message.id &&
                m.username === message.username &&
                m.message === message.message
            );

            if (isDuplicate) {
              console.log("Duplicate message detected, ignoring");
              return prev;
            }

            return [
              ...prev,
              {
                ...message,
                timestamp: new Date(message.timestamp),
              },
            ];
          });
        }
      });

      newSocket.on(
        "room_message",
        (data: {
          type: "join" | "leave";
          username: string;
          room: string;
          timestamp: Date;
        }) => {
          console.log("Room message:", data);
          const systemMessage: Message = {
            username: "System",
            message: `${data.username} has ${
              data.type === "join" ? "joined" : "left"
            } the room`,
            timestamp: new Date(data.timestamp),
            type: "system",
          };

          setMessages((prev) => [...prev, systemMessage]);
        }
      );

      socketRef.current = newSocket;
      setSocket(newSocket);
    } catch (error) {
      console.error("Error initializing socket:", error);
      setConnectionError(`Failed to initialize socket: ${error}`);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [mounted, username]);

  // ルームを変更したときにメッセージをフェッチ
  useEffect(() => {
    if (!mounted) return;

    // メッセージをリセット
    setMessages([]);

    const fetchMessages = async () => {
      try {
        // API エンドポイントから指定されたルームのメッセージを取得
        // ルームがある場合は /api/chat/{roomId}、ない場合は /api/chat/general を使用
        const roomPath = currentRoom || "";
        const url = `http://localhost:4500/api/chat/${roomPath}`;
        console.log("Fetching messages from:", url);

        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched messages:", data);

          // APIからのメッセージを整形
          const formattedMessages = data.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));

          setMessages(formattedMessages);
        } else {
          throw new Error(
            `Failed to fetch messages: ${response.status} ${response.statusText}`
          );
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        // エラー時はシステムメッセージを表示
        setMessages([
          {
            username: "System",
            message: "Failed to load messages. Please try again later.",
            timestamp: new Date(),
            type: "system",
          },
        ]);

        // バックエンドが接続できない場合、開発モードのダミーデータを使用
        if (!isConnected) {
          const systemMessage: Message = {
            username: "System",
            message: currentRoom
              ? `Welcome to ${currentRoom}! This is a development environment.`
              : "Welcome to the general chat! This is a development environment.",
            timestamp: new Date(),
            type: "system",
          };

          setMessages([systemMessage]);
        }
      }
    };

    if (isConnected && socketRef.current && socketRef.current.connected) {
      fetchMessages();
    }

    // ルーム変更時にメッセージの追跡リストをクリア
    pendingMessagesRef.current.clear();
  }, [currentRoom, mounted, isConnected]);

  // ユーザー名の設定（useCallbackを使用して安定したリファレンスを確保）
  const setUsername = useCallback(
    (name: string) => {
      // ステートを更新
      setUsernameState(name);

      // ローカルストレージに保存
      if (mounted) {
        try {
          sessionStorage.setItem("chat-username", name);
        } catch (error) {
          console.error("Error saving to sessionStorage:", error);
        }
      }

      // ソケットイベントを発行
      if (socketRef.current) {
        console.log("Emitting username to socket:", name);
        socketRef.current.emit("set_username", name);
      }
    },
    [mounted]
  );

  // ルームへの参加
  const joinRoom = useCallback(
    (room: string) => {
      if (currentRoom === room || !mounted) return;
      if (socketRef.current) {
        console.log("Joining room:", room);
        socketRef.current.emit("join_room", room);
      }
      setCurrentRoom(room);
    },
    [currentRoom, mounted]
  );

  // ルームからの退出
  const leaveRoom = useCallback(() => {
    if (!currentRoom || !mounted) return;

    if (socketRef.current) {
      console.log("Leaving room:", currentRoom);
      socketRef.current.emit("leave_room");
    }

    setCurrentRoom(null);
  }, [currentRoom, mounted]);

  // メッセージの送信
  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || !username || !mounted) return;

      // 一意のメッセージIDを生成
      const messageId = Date.now().toString();
      pendingMessagesRef.current.add(messageId);

      const messageData = {
        message: content,
        room: currentRoom,
        id: messageId,
      };

      if (socketRef.current) {
        socketRef.current.emit("send_message", messageData);
      }

      // 自分のメッセージはすぐに表示
      const newMessage: Message = {
        username,
        message: content,
        room: currentRoom || undefined,
        timestamp: new Date(),
        id: messageId,
      };

      setMessages((prev) => [...prev, newMessage]);

      // 一定時間後に追跡リストから削除（メモリリーク防止）
      setTimeout(() => {
        pendingMessagesRef.current.delete(messageId);
      }, 5000);
    },
    [username, currentRoom, mounted]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        username,
        setUsername,
        currentRoom,
        joinRoom,
        leaveRoom,
        messages,
        sendMessage,
        isConnected,
        connectionError,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
