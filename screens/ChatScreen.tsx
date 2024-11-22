import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING } from "../constants/theme";
import ChatHeader from "../components/chat/ChatHeader";
import MessageComposer from "../components/chat/MessageComposer";
import ChatBubble from "../components/chat/ChatBubble";
import DateSeparator from "../components/chat/DateSeparator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useChat } from "../context/ChatContext";
import { useUser } from "@clerk/clerk-expo";
import ChatListScreen from "./ChatListScreen";
import ChatRoomScreen from "./ChatRoomScreen";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  attachments?: { type: "image" | "file"; url: string }[];
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Hi! I saw you visited Paris last month. How was your experience?",
    sender: "other",
    timestamp: new Date("2024-03-10T10:00:00"),
    status: "read",
  },
  {
    id: "2",
    text: "Hey! Yes, it was amazing! The city is beautiful, especially in spring.",
    sender: "user",
    timestamp: new Date("2024-03-10T10:02:00"),
    status: "read",
  },
  {
    id: "3",
    text: "Here are some photos from my trip:",
    sender: "user",
    timestamp: new Date("2024-03-10T10:02:30"),
    status: "read",
    attachments: [
      { type: "image", url: "https://example.com/paris1.jpg" },
      { type: "image", url: "https://example.com/paris2.jpg" },
    ],
  },
];

const ChatScreen: React.FC<Props> = ({ navigation }) => {
  const { user: currentUser } = useUser();
  const { getOrCreateChatRoom } = useChat();

  const handleUserSelect = async (userId: string, userName: string, userImage: string) => {
    try {
      if (!currentUser?.id) {
        throw new Error("No current user found");
      }

      console.log("Getting or creating chat room with:", userId);

      const room = await getOrCreateChatRoom(userId);

      console.log("Room:", room);

      navigation.navigate("ChatRoom", {
        roomId: room.id,
        userName: userName,
        userImage: userImage,
      });
    } catch (error) {
      console.error("Error with chat room:", error);
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to start chat. Please try again."
      );
    }
  };

  return <ChatListScreen onUserSelect={handleUserSelect} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? SPACING.xl : 0,
  },
  content: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  typingIndicator: {
    padding: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  typingText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: "italic",
  },
});

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export default ChatScreen;
