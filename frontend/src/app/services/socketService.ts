import { io } from "socket.io-client";

let socket = null as any;

type MessageData = {
  username: string;
  message: string;
  timeStamp?: string;
  room?: string;
};

// ソケットを初期化する関数
export const initSocket = () => {
  // すでにソケットが存在する場合は、既存のソケットを返す
  if (socket) {
    return socket;
  }

  // 新しいソケットを作成
  socket = io("http://localhost:3001", {
    transports: ["websocket", "polling"],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socket;
};

// ソケットを取得する関数
export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

// ソケット接続を閉じる関数
export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// メッセージを送信する関数
export const sendMessage = (messageData: MessageData) => {
  if (!socket) {
    initSocket();
  }
  socket.emit("sendMessage", messageData);
};

// イベントリスナーを登録する関数
export const onEvent = (event: string, callback: (...args: any[]) => void) => {
  if (!socket) {
    initSocket();
  }
  socket.on(event, callback);
};

// イベントリスナーを削除する関数
export const offEvent = (event: string, callback: (...args: any[]) => void) => {
  if (!socket) {
    return;
  }
  socket.off(event, callback);
};
