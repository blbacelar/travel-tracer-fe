import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../constants/theme';

interface ActionButtonsProps {
  isFavorite: boolean;
  onFavoritePress: () => void;
  onSharePress: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isFavorite,
  onFavoritePress,
  onSharePress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isFavorite && styles.activeButton]}
        onPress={onFavoritePress}
      >
        <Feather
          name="heart"
          size={24}
          color={isFavorite ? COLORS.primary : COLORS.textDark}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onSharePress}>
        <Feather name="share-2" size={24} color={COLORS.textDark} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
  },
  button: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeButton: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
});

export default ActionButtons; 