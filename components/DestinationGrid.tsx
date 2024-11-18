import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

// Calculate item width based on screen width
const { width } = Dimensions.get('window');
const COLUMN_GAP = SPACING.md;
const CARD_WIDTH = (width - SPACING.md * 3) / 2; // subtract padding and gap

type DestinationCardProps = {
  image: string;
  name: string;
  location: string;
  isFavorite?: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
};

const DestinationCard = ({ 
  image, 
  name, 
  location, 
  isFavorite, 
  onPress, 
  onFavoritePress 
}: DestinationCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: image }} style={styles.image} />
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
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle} numberOfLines={1}>{name}</Text>
      <View style={styles.locationContainer}>
        <Feather name="map-pin" size={14} color={COLORS.textLight} />
        <Text style={styles.locationText} numberOfLines={1}>
          {location}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const DestinationGrid = () => {
  const [favorites, setFavorites] = React.useState<string[]>([]);

  const destinations = [
    {
      id: '1',
      image: 'https://picsum.photos/400/500',
      name: 'Bali Resort',
      location: 'Indonesia',
    },
    {
      id: '2',
      image: 'https://picsum.photos/400/501',
      name: 'Swiss Alps Cabin',
      location: 'Switzerland',
    },
    {
      id: '3',
      image: 'https://picsum.photos/400/502',
      name: 'Santorini Villa',
      location: 'Greece',
    },
    {
      id: '4',
      image: 'https://picsum.photos/400/503',
      name: 'Maldives Resort',
      location: 'Maldives',
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
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 1.2,
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: SPACING.xs,
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
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
    flex: 1,
  },
});

export default DestinationGrid; 