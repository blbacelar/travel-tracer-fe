import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

type HeaderProps = {
  username: string;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  hasNotifications?: boolean;
};

const Header = ({ 
  username, 
  onMenuPress = () => {}, 
  onNotificationPress = () => {},
  hasNotifications = true 
}: HeaderProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.iconButton} 
        onPress={onMenuPress}
      >
        <Feather name="menu" size={24} color={COLORS.textDark} />
      </TouchableOpacity>

      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>Hi,</Text>
        <Text style={styles.username}>{username}</Text>
      </View>

      <TouchableOpacity 
        style={styles.iconButton} 
        onPress={onNotificationPress}
      >
        <Feather name="bell" size={24} color={COLORS.textDark} />
        {hasNotifications && <View style={styles.notificationDot} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.xs,
    position: 'relative',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  greeting: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  notificationDot: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.background,
  },
});

export default Header; 