import React from 'react';
import { 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  View,
  Text 
} from 'react-native';
import ChatBubble from './ChatBubble';
import { COLORS, SPACING } from '../../constants/theme';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  roomId: string;
  readStatus: boolean;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isLoading
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (messages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No messages yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ChatBubble
          message={{
            ...item,
            sender: item.senderId === currentUserId ? 'user' : 'other',
            timestamp: new Date(item.timestamp.seconds * 1000),
            status: item.readStatus ? 'read' : 'sent',
            text: item.content // Map content to text for ChatBubble
          }}
        />
      )}
      inverted
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 16,
  },
  listContent: {
    padding: SPACING.md,
  },
});

export default MessageList; 