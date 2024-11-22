import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../context/ChatContext';
import { RootStackParamList } from '../App';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@clerk/clerk-expo';

type ChatRoomScreenRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>;

const ChatRoomScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ChatRoomScreenRouteProp>();
  const { roomId, userName } = route.params;
  const { messages, sendMessage, joinRoom } = useChat();
  const [messageText, setMessageText] = useState('');
  const { user } = useUser();

  useEffect(() => {
    joinRoom(roomId);
  }, [roomId]);

  const handleSend = async () => {
    if (messageText.trim()) {
      await sendMessage(messageText, roomId);
      setMessageText('');
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === user?.id;
    const timestamp = item.timestamp
      ? formatDistanceToNow(new Date(item.timestamp.seconds * 1000), { addSuffix: true })
      : '';

    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessage : styles.otherMessage
      ]}>
        <Text style={[
          styles.messageText,
          isMyMessage ? styles.myMessageText : styles.otherMessageText
        ]}>
          {item.content}
        </Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSend}
        >
          <Ionicons name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8E8E8',
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
});

export default ChatRoomScreen;
