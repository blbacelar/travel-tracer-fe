import React, { createContext, useContext, useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { ENV } from '../config/env';

interface ChatMessage {
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

interface ChatRoom {
  id: string;
  type: 'private' | 'group';
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
  joinRoom: (roomId: string) => void;
  createRoom: (type: 'private' | 'group', participants: string[]) => Promise<ChatRoom>;
  setTyping: (isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isTyping, setIsTyping] = useState<{ [key: string]: boolean }>({});

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(ENV.SOCKET_URL, {
      auth: {
        token: 'test-user-id' // Replace with actual user token
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    newSocket.on('newMessage', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('userTyping', ({ userId }) => {
      setIsTyping(prev => ({ ...prev, [userId]: true }));
    });

    newSocket.on('userStoppedTyping', ({ userId }) => {
      setIsTyping(prev => ({ ...prev, [userId]: false }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = (content: string) => {
    if (!socket || !currentRoom) return;
    
    socket.emit('sendMessage', {
      roomId: currentRoom,
      content
    });
  };

  const joinRoom = (roomId: string) => {
    if (!socket) return;
    
    socket.emit('joinRoom', roomId);
    setCurrentRoom(roomId);
    
    // Clear previous messages when joining new room
    setMessages([]);
    
    socket.on('messageHistory', ({ messages: history }) => {
      setMessages(history);
    });
  };

  const createRoom = async (type: 'private' | 'group', participants: string[]): Promise<ChatRoom> => {
    const response = await fetch(`${ENV.API_URL}/api/chat/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // Replace with actual token
      },
      body: JSON.stringify({ type, participants })
    });

    if (!response.ok) {
      throw new Error('Failed to create chat room');
    }

    const room = await response.json();
    setRooms(prev => [...prev, room]);
    return room;
  };

  const setTyping = (isTyping: boolean) => {
    if (!socket || !currentRoom) return;
    
    socket.emit(isTyping ? 'typing' : 'stopTyping', currentRoom);
  };

  return (
    <ChatContext.Provider value={{
      socket,
      currentRoom,
      messages,
      rooms,
      isTyping,
      sendMessage,
      joinRoom,
      createRoom,
      setTyping
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 