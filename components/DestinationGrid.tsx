import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocation } from '../context/LocationContext';
import { COLORS, SPACING } from '../constants/theme';

const DestinationGrid: React.FC = () => {
  const { locations } = useLocation();

  if (locations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No destinations found</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default DestinationGrid;
