import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  Box,
  Flex,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  Container,
  Heading,
  List,
  ListItem,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";

// バックエンドのURLを設定します
const SOCKET_SERVER_URL = "http://localhost:3001"; // バックエンドのURLに変更してください

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    {
      username: string;
      text: string;
      timestamp: string;
    }[]
  >([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ソケット接続の初期化
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);

    newSocket.on("connect", () => {
      setIsConnected(true);
      toaster.create({
        title: "Connected to chat server",
        type: "success",
        duration: 3000,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      toaster.create({
        title: "Disconnected from chat server",
        type: "error",
        duration: 3000,
        action: {
          label: "Retry",
          onClick: () => {
            newSocket.connect();
          },
        },
      });
    });

    // 新しいメッセージを受信したとき
    newSocket.on("receiveMessage", (chatMessage) => {
      setMessages((prevMessages) => [...prevMessages, chatMessage]);
    });

    // 過去のメッセージをロードする
    newSocket.on("previousMessages", (chatHistory) => {
      setMessages(chatHistory);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [toaster]);

  // チャット履歴が更新されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // メッセージを送信
  const handleSendMessage = () => {
    if (!username.trim()) {
      toaster.create({
        title: "Username required",
        description: "Please enter a username",
        type: "warning",
        duration: 3000,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    if (!message.trim()) {
      toaster.create({
        title: "Message required",
        description: "Please enter a message",
        type: "warning",
        duration: 3000,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    if (socket) {
      // メッセージをサーバーに送信
      socket.emit("sendMessage", {
        username,
        text: message,
        timestamp: new Date().toISOString(),
      });
      setMessage("");
    }
  };

  // Enterキーでメッセージを送信
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spaceY={6} align="stretch">
        <Heading textAlign="center">Real-time Chat Room</Heading>

        <Box
          bg="gray.50"
          p={4}
          borderRadius="md"
          boxShadow="md"
          height="60vh"
          overflowY="auto"
        >
          <List.Root>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                bg={msg.username === username ? "blue.100" : "gray.100"}
                p={3}
                borderRadius="md"
                alignSelf={
                  msg.username === username ? "flex-end" : "flex-start"
                }
                maxW="80%"
                marginLeft={msg.username === username ? "auto" : "0"}
              >
                <Text fontWeight="bold" color="gray.700">
                  {msg.username}
                </Text>
                <Text>{msg.text}</Text>
                <Text fontSize="xs" color="gray.500">
                  {new Date(msg.timestamp).toLocaleString()}
                </Text>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List.Root>
        </Box>

        <Box>
          <HStack mb={4}>
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!isConnected}
            />
          </HStack>

          <HStack>
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isConnected}
            />
            <Button
              colorScheme="blue"
              onClick={handleSendMessage}
              disabled={!isConnected}
            >
              Send
            </Button>
          </HStack>
        </Box>

        <Flex justify="center">
          <Text fontSize="sm" color={isConnected ? "green.500" : "red.500"}>
            {isConnected ? "Connected to chat server" : "Disconnected"}
          </Text>
        </Flex>
      </VStack>

      <Toaster />
    </Container>
  );
}
