import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

type NavItemProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  isActive?: boolean;
  onPress: () => void;
};

const NavItem = ({ icon, label, isActive, onPress }: NavItemProps) => (
  <TouchableOpacity 
    style={styles.navItem} 
    onPress={onPress}
  >
    <Feather 
      name={icon} 
      size={24} 
      color={isActive ? COLORS.primary : COLORS.textLight} 
    />
    <Text style={[
      styles.navLabel,
      isActive && styles.navLabelActive
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const BottomNav = () => {
  const [activeTab, setActiveTab] = React.useState('home');

  const navItems = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'explore', icon: 'compass', label: 'Explore' },
    { id: 'notifications', icon: 'bell', label: 'Notifications' },
    { id: 'profile', icon: 'user', label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <NavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={activeTab === item.id}
          onPress={() => setActiveTab(item.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: SPACING.md, // Extra padding for bottom safe area
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    minWidth: 64,
  },
  navLabel: {
    fontSize: 12,
    marginTop: SPACING.xs,
    color: COLORS.textLight,
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default BottomNav; 