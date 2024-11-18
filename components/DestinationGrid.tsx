import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import DestinationCard from './DestinationCard';

// Calculate item width based on screen width
const { width } = Dimensions.get('window');
const COLUMN_GAP = SPACING.md;
const CARD_WIDTH = (width - SPACING.md * 3) / 2; // subtract padding and gap

const DestinationGrid = () => {
  const [favorites, setFavorites] = React.useState<string[]>([]);

  const destinations = [
    {
      id: '1',
      image: 'https://picsum.photos/400/500',
      name: 'Bali Resort',
      location: 'Indonesia',
      weather: {
        temperature: 29,
        feelsLike: 32,
        condition: 'sunny' as const,
      },
    },
    {
      id: '2',
      image: 'https://picsum.photos/400/501',
      name: 'Swiss Alps Cabin',
      location: 'Switzerland',
      weather: {
        temperature: 12,
        feelsLike: 10,
        condition: 'partly-cloudy' as const,
      },
    },
    {
      id: '3',
      image: 'https://picsum.photos/400/502',
      name: 'Santorini Villa',
      location: 'Greece',
      weather: {
        temperature: 25,
        feelsLike: 26,
        condition: 'sunny' as const,
      },
    },
    {
      id: '4',
      image: 'https://picsum.photos/400/503',
      name: 'Maldives Resort',
      location: 'Maldives',
      weather: {
        temperature: 27,
        feelsLike: 29,
        condition: 'cloudy' as const,
      },
    },
  ];

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular Destinations</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            image={destination.image}
            name={destination.name}
            location={destination.location}
            weather={destination.weather}
            width={CARD_WIDTH}
            isFavorite={favorites.includes(destination.id)}
            onPress={() => console.log('Navigate to destination', destination.id)}
            onFavoritePress={() => toggleFavorite(destination.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: COLUMN_GAP,
  },
});

export default DestinationGrid;
