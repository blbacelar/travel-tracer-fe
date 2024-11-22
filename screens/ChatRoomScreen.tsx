import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useChat, ChatMessage } from "../context/ChatContext";
import { RootStackParamList } from "../App";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/clerk-expo";
import { debounce } from "lodash";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../constants/theme";
import { Swipeable } from 'react-native-gesture-handler';

type ChatRoomScreenRouteProp = RouteProp<RootStackParamList, "ChatRoom">;

const ChatRoomScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ChatRoomScreenRouteProp>();
  const { roomId, userName, userImage } = route.params;
  const { messages, sendMessage, joinRoom, setTyping, isTyping, editMessage, deleteMessage } = useChat();
  const [messageText, setMessageText] = useState("");
  const { user } = useUser();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { colors } = useTheme();
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const swipeableRef = useRef<Swipeable | null>(null);

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

  const handleMessageLongPress = (message: ChatMessage) => {
    if (message.senderId !== user?.id) return;
    
    Alert.alert(
      'Message Actions',
      'What would you like to do with this message?',
      [
        {
          text: 'Edit',
          onPress: () => {
            setEditingMessage(message);
            setMessageText(message.content);
          },
        },
        {
          text: 'Delete',
          onPress: () => {
            Alert.alert(
              'Delete Message',
              'Are you sure you want to delete this message?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteMessage(message.id);
                    } catch (error) {
                      console.error('Error deleting message:', error);
                    }
                  },
                },
              ],
            );
          },
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  const handleSend = async () => {
    if (messageText.trim()) {
      if (editingMessage) {
        try {
          await editMessage(editingMessage.id, messageText);
          setEditingMessage(null);
          setMessageText('');
          swipeableRef.current?.close();
        } catch (error) {
          console.error('Error editing message:', error);
        }
      } else {
        await sendMessage(messageText, roomId);
        setMessageText('');
      }
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

  const renderRightActions = (message: ChatMessage) => {
    if (message.senderId !== user?.id) return null;

    return (
      <View style={styles.messageActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            setEditingMessage(message);
            setMessageText(message.content);
          }}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => {
            Alert.alert(
              'Delete Message',
              'Are you sure you want to delete this message?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => deleteMessage(message.id),
                },
              ],
            );
          }}
        >
          <Ionicons name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    if (item.deletedAt) {
      return (
        <View style={[styles.messageContainer, styles.deletedMessage]}>
          <Text style={styles.deletedMessageText}>Message deleted</Text>
        </View>
      );
    }

    const isMyMessage = item.senderId === user?.id;
    const timestamp = item.timestamp
      ? formatDistanceToNow(new Date(item.timestamp.seconds * 1000), {
          addSuffix: true,
        })
      : "";

    return (
      <Swipeable
        ref={item.id === editingMessage?.id ? swipeableRef : null}
        renderRightActions={() => renderRightActions(item)}
        enabled={isMyMessage}
      >
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
          <View style={styles.messageFooter}>
            {item.isEdited && (
              <Text style={styles.editedText}>(edited)</Text>
            )}
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>
        </View>
      </Swipeable>
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

      {editingMessage && (
        <View style={styles.editingContainer}>
          <Text style={styles.editingText}>Editing message</Text>
          <TouchableOpacity 
            onPress={() => {
              setEditingMessage(null);
              setMessageText('');
            }}
          >
            <Text style={styles.cancelEditText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

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
  deletedMessage: {
    backgroundColor: COLORS.border,
    alignSelf: "center",
    maxWidth: "60%",
  },
  deletedMessageText: {
    color: COLORS.textLight,
    fontStyle: "italic",
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  editedText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginRight: 4,
    fontStyle: "italic",
  },
  editingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: COLORS.border,
  },
  editingText: {
    color: COLORS.textDark,
    fontSize: 14,
  },
  cancelEditText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '600',
  },
  messageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
});

export default ChatRoomScreen;
