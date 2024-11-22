import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useChat, ChatMessage } from "../context/ChatContext";
import { useUser } from "@clerk/clerk-expo";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageComposer from "../components/chat/MessageComposer";
import { COLORS, SPACING } from "../constants/theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "ChatRoom">;

const ChatRoomScreen: React.FC<Props> = ({ route, navigation }) => {
  const { roomId, userName, userImage } = route.params;
  const { messages, sendMessage, joinRoom, setTyping } = useChat();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Filter messages for current room
    setRoomMessages(messages.filter((msg) => msg.roomId === roomId));
  }, [messages, roomId]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        await joinRoom(roomId);
        setIsLoading(false);
      } catch (error) {
        console.error("Error joining room:", error);
        Alert.alert("Error", "Failed to join chat room");
        navigation.goBack();
      }
    };

    initializeChat();
  }, [roomId]);

  const handleSend = (content: string) => {
    if (content.trim()) {
      sendMessage(content);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    setTyping(isTyping);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <ChatHeader
            name={userName}
            image={userImage}
            isOnline={true}
            onBack={() => navigation.goBack()}
          />

          <View style={styles.content}>
            <MessageList
              messages={roomMessages}
              currentUserId={user?.id || ""}
              isLoading={isLoading}
            />

            <MessageComposer
              onSend={handleSend}
              onTypingChange={handleTyping}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default ChatRoomScreen;
