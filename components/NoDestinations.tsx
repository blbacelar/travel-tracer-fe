import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

const NoDestinations = () => {
  return (
    <View style={styles.container}>
      <Feather 
        name="map-pin" 
        size={48} 
        color={COLORS.textLight} 
        style={styles.icon}
      />
      <Text style={styles.title}>No Destinations Found</Text>
      <Text style={styles.subtitle}>
        Try adjusting your filters or increasing the search radius to find more places.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xl * 2,
  },
  icon: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NoDestinations; 