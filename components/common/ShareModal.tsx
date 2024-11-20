import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  Share,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../constants/theme';
import * as Clipboard from 'expo-clipboard';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

interface ShareOption {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  action: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  title,
  message,
}) => {
  const shareText = `${title}\n${message}`;
  const shareUrl = 'https://traveltracer.app/destination';

  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(shareUrl);
      Alert.alert('Success', 'Link copied to clipboard!');
      onClose();
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleWhatsAppShare = async () => {
    const whatsappMessage = encodeURIComponent(shareText);
    
    try {
      if (Platform.OS === 'android') {
        await Linking.openURL(`whatsapp://send?text=${whatsappMessage}`);
      } else {
        await Linking.openURL(`whatsapp://send?text=${whatsappMessage}`);
      }
      onClose();
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      Alert.alert(
        'WhatsApp Not Found',
        'Please install WhatsApp to share via WhatsApp',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Install WhatsApp',
            onPress: () => {
              const storeUrl = Platform.select({
                ios: 'https://apps.apple.com/app/whatsapp-messenger/id310633997',
                android: 'market://details?id=com.whatsapp',
                default: 'https://whatsapp.com',
              });
              Linking.openURL(storeUrl);
            },
          },
        ]
      );
    }
  };

  const handleTelegramShare = async () => {
    const telegramMessage = encodeURIComponent(shareText);
    
    try {
      if (Platform.OS === 'android') {
        await Linking.openURL(`tg://msg?text=${telegramMessage}`);
      } else {
        await Linking.openURL(`tg://msg?text=${telegramMessage}`);
      }
      onClose();
    } catch (error) {
      console.error('Error opening Telegram:', error);
      Alert.alert(
        'Telegram Not Found',
        'Please install Telegram to share via Telegram',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Install Telegram',
            onPress: () => {
              const storeUrl = Platform.select({
                ios: 'https://apps.apple.com/app/telegram-messenger/id686449807',
                android: 'market://details?id=org.telegram.messenger',
                default: 'https://telegram.org/',
              });
              Linking.openURL(storeUrl);
            },
          },
        ]
      );
    }
  };

  const handleSystemShare = async () => {
    try {
      await Share.share({
        title,
        message: shareText,
        url: shareUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const shareOptions: ShareOption[] = [
    {
      id: 'copy',
      label: 'Copy Link',
      icon: 'link',
      color: '#6C757D',
      action: handleCopyLink,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: 'message-circle',
      color: '#25D366',
      action: handleWhatsAppShare,
    },
    {
      id: 'telegram',
      label: 'Telegram',
      icon: 'send',
      color: '#0088cc',
      action: handleTelegramShare,
    },
    {
      id: 'more',
      label: 'More Options',
      icon: 'more-horizontal',
      color: COLORS.textDark,
      action: handleSystemShare,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Share via</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Feather name="x" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            {shareOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.option}
                onPress={option.action}
              >
                <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                  <Feather name={option.icon} size={24} color={option.color} />
                </View>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
  },
  option: {
    alignItems: 'center',
    width: '22%',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  optionLabel: {
    fontSize: 12,
    color: COLORS.textDark,
    textAlign: 'center',
  },
});

export default ShareModal; 