import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../constants/theme';

interface ChatBubbleProps {
  message: {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
    attachments?: { type: 'image' | 'file'; url: string }[];
  };
}

const { width } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = width * 0.7;

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const renderStatus = () => {
    if (!isUser) return null;

    let icon: keyof typeof Feather.glyphMap = 'check';
    let color = COLORS.textLight;

    switch (message.status) {
      case 'delivered':
        icon = 'check-circle';
        break;
      case 'read':
        icon = 'check-circle';
        color = COLORS.primary;
        break;
    }

    return <Feather name={icon} size={12} color={color} style={styles.statusIcon} />;
  };

  const renderAttachments = () => {
    if (!message.attachments?.length) return null;

    return (
      <View style={styles.attachmentsContainer}>
        {message.attachments.map((attachment, index) => {
          if (attachment.type === 'image') {
            return (
              <Image
                key={index}
                source={{ uri: attachment.url }}
                style={styles.attachmentImage}
                resizeMode="cover"
              />
            );
          }
          return null;
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, isUser && styles.userContainer]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.otherBubble,
        ]}
      >
        {renderAttachments()}
        <Text style={[styles.text, isUser && styles.userText]}>
          {message.text}
        </Text>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {renderStatus()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: MAX_BUBBLE_WIDTH,
    padding: SPACING.sm,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: COLORS.border + '40',
  },
  text: {
    fontSize: 16,
    color: COLORS.textDark,
    lineHeight: 20,
  },
  userText: {
    color: COLORS.background,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: SPACING.xs,
  },
  time: {
    fontSize: 12,
    color: COLORS.textLight,
    marginRight: SPACING.xs,
  },
  statusIcon: {
    marginLeft: 2,
  },
  attachmentsContainer: {
    marginBottom: SPACING.xs,
  },
  attachmentImage: {
    width: MAX_BUBBLE_WIDTH - SPACING.md * 2,
    height: 200,
    borderRadius: 8,
    marginBottom: SPACING.xs,
  },
});

export default ChatBubble; 