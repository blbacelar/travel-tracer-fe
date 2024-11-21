import React, { useState, useRef } from "react";
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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING } from "../constants/theme";
import ChatHeader from "../components/chat/ChatHeader";
import MessageComposer from "../components/chat/MessageComposer";
import ChatBubble from "../components/chat/ChatBubble";
import DateSeparator from "../components/chat/DateSeparator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

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

const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = (
    text: string,
    attachments?: { type: "image" | "file"; url: string }[]
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
      attachments,
    };

    setMessages((prev) => [newMessage, ...prev]);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const showDateSeparator =
      index === messages.length - 1 ||
      !isSameDay(item.timestamp, messages[index + 1].timestamp);

    return (
      <View>
        {showDateSeparator && <DateSeparator date={item.timestamp} />}
        <ChatBubble message={item} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader
        name="Sarah Mitchell"
        image="https://example.com/avatar.jpg"
        isOnline={true}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.messageList}
        />

        {isTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>Sarah is typing...</Text>
          </View>
        )}

        <MessageComposer onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
