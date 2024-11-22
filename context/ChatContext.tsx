import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  onSnapshot,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
  setDoc
} from 'firebase/firestore';
import { db } from "../config/firebase";
import { useUser } from "@clerk/clerk-expo";

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: any;
  roomId: string;
  readStatus: boolean;
}

export interface ChatRoom {
  id: string;
  type: "private" | "group";
  participants: string[];
  createdAt: any;
  lastMessage?: ChatMessage;
}

interface ChatContextType {
  currentRoom: string | null;
  messages: ChatMessage[];
  rooms: ChatRoom[];
  isTyping: { [key: string]: { isTyping: boolean, userName: string } };
  sendMessage: (content: string, roomId: string) => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  getOrCreateChatRoom: (otherUserId: string) => Promise<ChatRoom>;
  setTyping: (isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: { isTyping: boolean, userName: string } }>({});
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const q = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedRooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatRoom[];
      setRooms(updatedRooms);
    });

    return () => unsubscribe();
  }, [user?.id]);

  useEffect(() => {
    if (!currentRoom) return;

    const q = query(
      collection(db, 'messages'),
      where('roomId', '==', currentRoom),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [currentRoom]);

  useEffect(() => {
    if (!currentRoom) return;

    // Listen for typing status changes
    const typingRef = collection(db, 'chatRooms', currentRoom, 'typing');
    const q = query(typingRef, where('isTyping', '==', true));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const typing: { [key: string]: { isTyping: boolean, userName: string } } = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp?.toDate();
        // Only show typing indicator if timestamp is within last 5 seconds
        if (timestamp && (Date.now() - timestamp.getTime()) < 5000) {
          typing[doc.id] = {
            isTyping: true,
            userName: data.userName || 'User'
          };
        }
      });
      setTypingUsers(typing);
    });

    return () => unsubscribe();
  }, [currentRoom]);

  const getOrCreateChatRoom = async (otherUserId: string): Promise<ChatRoom> => {
    if (!user?.id) throw new Error("No user available");

    const q = query(
      collection(db, 'chatRooms'),
      where('type', '==', 'private'),
      where('participants', 'array-contains', user.id)
    );

    const querySnapshot = await getDocs(q);
    const existingRoom = querySnapshot.docs.find(doc => {
      const room = doc.data();
      return room.participants.includes(otherUserId) && 
             room.participants.length === 2;
    });

    if (existingRoom) {
      return { id: existingRoom.id, ...existingRoom.data() } as ChatRoom;
    }

    const newRoomRef = await addDoc(collection(db, 'chatRooms'), {
      type: "private",
      participants: [user.id, otherUserId],
      createdAt: serverTimestamp(),
    });

    return {
      id: newRoomRef.id,
      type: "private",
      participants: [user.id, otherUserId],
      createdAt: serverTimestamp(),
    };
  };

  const joinRoom = async (roomId: string) => {
    setCurrentRoom(roomId);
    
    if (!user?.id) return;

    const q = query(
      collection(db, 'messages'),
      where('roomId', '==', roomId),
      where('senderId', '!=', user.id),
      where('readStatus', '==', false)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.docs.forEach(async (document) => {
      await updateDoc(doc(db, 'messages', document.id), {
        readStatus: true
      });
    });
  };

  const sendMessage = async (content: string, roomId: string) => {
    if (!user?.id) return;

    try {
      const messageData = {
        content,
        senderId: user.id,
        roomId,
        timestamp: serverTimestamp(),
        readStatus: false,
      };

      const messageRef = await addDoc(collection(db, 'messages'), messageData);

      const roomRef = doc(db, 'chatRooms', roomId);
      await updateDoc(roomRef, {
        lastMessage: {
          ...messageData,
          id: messageRef.id
        }
      });

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const updateTypingStatus = (isTyping: boolean) => {
    if (!currentRoom || !user?.id) return;
    
    try {
      const typingRef = doc(db, 'chatRooms', currentRoom, 'typing', user.id);
      setDoc(typingRef, {
        isTyping,
        timestamp: serverTimestamp(),
        userId: user.id,
        userName: user.firstName || user.lastName || 'User'
      }).catch(console.error);
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
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
