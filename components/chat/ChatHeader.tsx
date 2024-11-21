import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../constants/theme';

interface ChatHeaderProps {
  name: string;
  image: string;
  isOnline: boolean;
  onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  image,
  isOnline,
  onBack,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Feather name="arrow-left" size={24} color={COLORS.textDark} />
      </TouchableOpacity>

      <View style={styles.userInfo}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            onError={(e) => {
              console.log('Error loading image:', e.nativeEvent.error);
            }}
          />
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.status}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.moreButton}>
        <Feather name="more-vertical" size={24} color={COLORS.textDark} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.xs,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  textContainer: {
    marginLeft: SPACING.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  status: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  moreButton: {
    padding: SPACING.xs,
  },
});

export default ChatHeader; 