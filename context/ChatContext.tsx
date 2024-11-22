import React, { createContext, useContext, useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { ENV } from "../config/env";
import { useUser, useAuth } from "@clerk/clerk-expo";

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  roomId: string;
  readStatus: boolean;
}

export interface ChatRoom {
  id: string;
  type: "private" | "group";
  participants: string[];
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  lastMessage?: ChatMessage;
}

interface ChatContextType {
  socket: Socket | null;
  currentRoom: string | null;
  messages: ChatMessage[];
  rooms: ChatRoom[];
  isTyping: { [key: string]: boolean };
  sendMessage: (content: string) => void;
  joinRoom: (roomId: string) => Promise<void>;
  getOrCreateChatRoom: (otherUserId: string) => Promise<ChatRoom>;
  setTyping: (isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Add these interfaces for socket errors
interface SocketError extends Error {
  description?: {
    isTrusted: boolean;
    message: string;
  };
  headers?: {
    Authorization: string;
  };
}

interface SocketTransport {
  name: string;
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const initializeSocket = async () => {
      if (!user) return;

      try {
        const token = await getToken();
        if (!token) {
          console.error("No authentication token available");
          return;
        }

        const baseUrl = ENV.API_URL.replace(/\/api\/?$/, "");
        // console.log("Initializing socket with config:", {
        //   url: baseUrl,
        //   userId: user.id,
        // });

        const newSocket = io(baseUrl, {
          auth: {
            token: token,
          },
          query: {
            userId: user.id,
          },
          transports: ["websocket"],
          path: "/socket.io",
          reconnection: true,
          reconnectionAttempts: 5,
          timeout: 10000,
        });

        newSocket.on("connect", () => {
          console.log("Socket connected:", {
            id: newSocket.id,
            connected: newSocket.connected,
            transport: newSocket.io.engine?.transport.name,
          });
        });

        newSocket.on("disconnect", (reason) => {
          console.log("Socket disconnected:", { reason });
        });

        newSocket.on("connect_error", (error: SocketError) => {
          // console.error("Socket Connection Error Details:", {
          //   description: error.description,
          //   headers: {
          //     Authorization: token,
          //   },
          //   message: error.message,
          //   url: baseUrl,
          //   userId: user.id,
          // });
        });

        newSocket.on("error", (error) => {
          // console.error('Socket Error:', error);
        });

        newSocket.on("newMessage", (message: ChatMessage) => {
          console.log("New message received:", message);
          setMessages((prev) => [...prev, message]);
        });

        newSocket.on("messageHistory", (messages: ChatMessage[]) => {
          console.log("Message history received:", messages.length);
          setMessages(messages);
        });

        newSocket.on("userTyping", (userId: string) => {
          setTypingUsers((prev) => ({ ...prev, [userId]: true }));
        });

        newSocket.on("userStoppedTyping", (userId: string) => {
          setTypingUsers((prev) => ({ ...prev, [userId]: false }));
        });

        setSocket(newSocket);

        return () => {
          newSocket.disconnect();
          newSocket.removeAllListeners();
        };
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };

    initializeSocket();
  }, [user]);

  const getOrCreateChatRoom = async (
    otherUserId: string
  ): Promise<ChatRoom> => {
    try {
      const token = await getToken();
      console.log("TOKEN:", token);
      if (!token || !user?.id) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`${ENV.API_URL}/chat/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const rooms: ChatRoom[] = await response.json();

      const existingRoom = rooms.find(
        (room: ChatRoom) =>
          room.type === "private" &&
          room.participants.includes(otherUserId) &&
          room.participants.includes(user.id) &&
          room.participants.length === 2
      );

      if (existingRoom) {
        return existingRoom;
      }

      const createResponse = await fetch(`${ENV.API_URL}/chat/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "private",
          participants: [user.id, otherUserId],
        }),
      });

      console.log("URL:", `${ENV.API_URL}/chat/rooms`);
      console.log("TOKEN:", token);
      console.log("PARTICIPANTS:", [user.id, otherUserId]);

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || "Failed to create chat room");
      }

      const newRoom = await createResponse.json();
      setRooms((prev) => [...prev, newRoom]);
      return newRoom;
    } catch (error) {
      console.error("Error getting/creating chat room:", error);
      throw error;
    }
  };

  const joinRoom = async (roomId: string) => {
    if (!socket) return;

    try {
      if (currentRoom) {
        socket.emit("leaveRoom", currentRoom);
      }

      console.log("Joining room:", roomId);
      socket.emit("joinRoom", roomId);
      setCurrentRoom(roomId);
    } catch (error) {
      console.error("Error joining room:", error);
      throw error;
    }
  };

  const sendMessage = (content: string) => {
    if (!socket || !currentRoom || !user) {
      console.error("Cannot send message - missing requirements");
      return;
    }

    const messageData = {
      roomId: currentRoom,
      content: content.trim(),
    };

    console.log("Sending message:", messageData);
    socket.emit("sendMessage", messageData);
  };

  const updateTypingStatus = (isTyping: boolean) => {
    if (!socket || !currentRoom) return;
    socket.emit(isTyping ? "typing" : "stopTyping", currentRoom);
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        currentRoom,
        messages,
        rooms,
        isTyping: typingUsers,
        sendMessage,
        joinRoom,
        getOrCreateChatRoom,
        setTyping: updateTypingStatus,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
