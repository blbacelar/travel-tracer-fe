import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useChat } from "../context/ChatContext";
import { RootStackParamList } from "../App";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/clerk-expo";
import { debounce } from "lodash";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../constants/theme";

type ChatRoomScreenRouteProp = RouteProp<RootStackParamList, "ChatRoom">;

const ChatRoomScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ChatRoomScreenRouteProp>();
  const { roomId, userName, userImage } = route.params;
  const { messages, sendMessage, joinRoom, setTyping, isTyping } = useChat();
  const [messageText, setMessageText] = useState("");
  const { user } = useUser();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { colors } = useTheme();

  const debouncedSetTyping = useMemo(
    () => debounce((typing: boolean) => setTyping(typing), 500),
    [setTyping]
  );

  useEffect(() => {
    joinRoom(roomId);
  }, [roomId]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener("keyboardWillShow", () => {
      setKeyboardVisible(true);
    });
    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    console.log("Typing status:", isTyping);
  }, [isTyping]);

  const handleSend = async () => {
    if (messageText.trim()) {
      await sendMessage(messageText, roomId);
      setMessageText("");
    }
  };

  const handleTextChange = (text: string) => {
    setMessageText(text);
    setTyping(text.length > 0);
  };

  useEffect(() => {
    return () => {
      setTyping(false);
    };
  }, []);

  const renderMessage = ({ item }: { item: any }) => {
    const isMyMessage = item.senderId === user?.id;
    const timestamp = item.timestamp
      ? formatDistanceToNow(new Date(item.timestamp.seconds * 1000), {
          addSuffix: true,
        })
      : "";

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText,
          ]}
        >
          {item.content}
        </Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    const typingUserId = Object.keys(isTyping).find((id) => id !== user?.id);
    if (!typingUserId || !isTyping[typingUserId]) return null;

    return (
      <View style={styles.typingIndicator}>
        <Text style={styles.typingText}>{userName} is typing...</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          {userImage ? (
            <Image 
              source={{ uri: userImage }} 
              style={styles.userImage}
              defaultSource={require("../assets/default-avatar.png")}
            />
          ) : (
            <View style={styles.userImagePlaceholder}>
              <Text style={styles.userImagePlaceholderText}>
                {userName[0]?.toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={[styles.userName, { color: colors.textDark }]}>
            {userName}
          </Text>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted
      />

      {renderTypingIndicator()}

      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={0}>
          <View
            style={[
              styles.inputContainer,
              !keyboardVisible && styles.inputContainerWithMargin,
            ]}
          >
            <TextInput
              style={styles.input}
              value={messageText}
              onChangeText={handleTextChange}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={messageText}
            onChangeText={handleTextChange}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userImagePlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.border,
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: COLORS.background,
  },
  otherMessageText: {
    color: COLORS.textDark,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  inputContainerWithMargin: {
    paddingBottom: 30,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    minHeight: 40,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
  typingIndicator: {
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  typingText: {
    color: "#666",
    fontSize: 12,
    fontStyle: "italic",
  },
});

export default ChatRoomScreen;
