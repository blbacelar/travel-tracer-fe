import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

type NavItem = {
  id: string;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  screenName?: keyof RootStackParamList;
};

const BottomNav = () => {
  const [activeTab, setActiveTab] = React.useState('home');
  const navigation = useNavigation<NavigationProp>();

  const navItems: NavItem[] = [
    { id: 'home', icon: 'home', label: 'Home', screenName: 'Main' },
    { id: 'explore', icon: 'compass', label: 'Explore' },
    { id: 'notifications', icon: 'bell', label: 'Notifications' },
    { id: 'profile', icon: 'user', label: 'Profile', screenName: 'Profile' },
  ];

  const handlePress = (item: NavItem) => {
    setActiveTab(item.id);
    if (item.screenName) {
      navigation.navigate({
        name: item.screenName,
        params: undefined,
      } as never);
    }
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <NavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={activeTab === item.id}
          onPress={() => handlePress(item)}
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
    paddingBottom: SPACING.md,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    minWidth: 64,
  },
  navLabel: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
    color: COLORS.textLight,
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default BottomNav; 