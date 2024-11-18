import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

type WeatherInfo = {
  temperature: number;
  feelsLike: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly-cloudy';
};

export type DestinationCardProps = {
  image: string;
  name: string;
  location: string;
  weather: WeatherInfo;
  isFavorite?: boolean;
  width: number;
  onPress: () => void;
  onFavoritePress: () => void;
};

const getWeatherIcon = (condition: WeatherInfo['condition']) => {
  const icons = {
    'sunny': 'sun',
    'cloudy': 'cloud',
    'rainy': 'cloud-rain',
    'stormy': 'cloud-lightning',
    'partly-cloudy': 'cloud-drizzle'
  };
  return icons[condition];
};

const DestinationCard = ({ 
  image, 
  name, 
  location, 
  weather,
  isFavorite, 
  width,
  onPress, 
  onFavoritePress 
}: DestinationCardProps) => (
  <TouchableOpacity style={[styles.card, { width }]} onPress={onPress}>
    <Image source={{ uri: image }} style={[styles.image, { height: width * 1.2 }]} />
    <TouchableOpacity 
      style={styles.favoriteButton} 
      onPress={onFavoritePress}
    >
      <Feather 
        name={isFavorite ? "heart" : "heart"} 
        size={20} 
        color={isFavorite ? COLORS.primary : COLORS.background} 
      />
    </TouchableOpacity>
    
    {/* Weather Badge */}
    <View style={styles.weatherBadge}>
      <Feather 
        name={getWeatherIcon(weather.condition)} 
        size={16} 
        color={COLORS.textDark}
      />
      <Text style={styles.temperature}>{weather.temperature}°</Text>
    </View>

    <View style={styles.cardContent}>
      <Text style={styles.cardTitle} numberOfLines={1}>{name}</Text>
      <View style={styles.locationContainer}>
        <Feather name="map-pin" size={14} color={COLORS.textLight} />
        <Text style={styles.locationText} numberOfLines={1}>
          {location}
        </Text>
      </View>
      
      {/* Weather Details */}
      <View style={styles.weatherContainer}>
        <Feather 
          name="thermometer" 
          size={14} 
          color={COLORS.textLight}
        />
        <Text style={styles.weatherText}>
          Feels like {weather.feelsLike}°
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  image: {
    width: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: SPACING.xs,
  },
  weatherBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
  },
  temperature: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  cardContent: {
    padding: SPACING.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  weatherText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
});

export default DestinationCard; 