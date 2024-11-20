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
          color={isFavorite ? COLORS.primary : COLORS.background}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onSharePress}>
        <Feather name="share-2" size={24} color={COLORS.background} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  button: {
    padding: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  activeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default ActionButtons; 