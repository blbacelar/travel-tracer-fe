import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

// Define the allowed Feather icon names
type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

interface ProfileMenuItemProps {
  icon: FeatherIconName;
  title: string;
  subtitle: string;
  onPress: () => void;
  isLast?: boolean;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  isLast,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primary + '10' }]}>
        <Feather name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textDark }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    marginBottom: SPACING.xs / 2,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
  },
});

export default ProfileMenuItem; 