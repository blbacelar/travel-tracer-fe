import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../constants/theme';
import { Weather } from '../../types/api';
import { getWeatherIcon } from '../../utils/weather';

interface WeatherInfoProps {
  weather: Weather;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ weather }) => {
  return (
    <View style={styles.container}>
      <View style={styles.weatherCard}>
        <Feather
          name={getWeatherIcon(weather.condition)}
          size={32}
          color={COLORS.textDark}
        />
        <Text style={styles.temperature}>{weather.temperature}°</Text>
        <Text style={styles.condition}>{weather.condition}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  weatherCard: {
    backgroundColor: COLORS.mint,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginTop: SPACING.xs,
  },
  condition: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
});

export default WeatherInfo; 