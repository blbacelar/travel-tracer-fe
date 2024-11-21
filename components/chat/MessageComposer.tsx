import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../constants/theme';

interface MessageComposerProps {
  onSend: (text: string, attachments?: { type: 'image' | 'file'; url: string }[]) => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.button}>
          <Feather name="image" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.textLight}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, styles.sendButton]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Feather
            name="send"
            size={24}
            color={message.trim() ? COLORS.primary : COLORS.textLight}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    padding: SPACING.sm,
    borderRadius: 24,
    backgroundColor: 'transparent',
  },
  sendButton: {
    transform: [{ rotate: '45deg' }],
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    backgroundColor: COLORS.border + '20',
    borderRadius: 24,
    paddingHorizontal: SPACING.sm,
    maxHeight: 100,
  },
  input: {
    fontSize: 16,
    color: COLORS.textDark,
    paddingVertical: Platform.OS === 'ios' ? SPACING.sm : SPACING.xs,
    maxHeight: 100,
  },
});

export default MessageComposer; 