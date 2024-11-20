import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../constants/theme';
import { Location } from '../../types/api';

interface AccommodationCarouselProps {
  location: Location;
}

// Temporary mock data - in a real app, this would come from an API
const MOCK_ACCOMMODATIONS = [
  {
    id: '1',
    name: 'Grand Hotel',
    type: 'Hotel',
    price: '$200',
    rating: 4.5,
    image: 'https://picsum.photos/200/300',
  },
  {
    id: '2',
    name: 'Cozy Villa',
    type: 'Villa',
    price: '$350',
    rating: 4.8,
    image: 'https://picsum.photos/200/301',
  },
  {
    id: '3',
    name: 'City Apartment',
    type: 'Apartment',
    price: '$150',
    rating: 4.2,
    image: 'https://picsum.photos/200/302',
  },
];

const AccommodationCarousel: React.FC<AccommodationCarouselProps> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Where to Stay</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MOCK_ACCOMMODATIONS.map((accommodation) => (
          <TouchableOpacity
            key={accommodation.id}
            style={styles.accommodationCard}
          >
            <Image
              source={{ uri: accommodation.image }}
              style={styles.accommodationImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.accommodationName}>{accommodation.name}</Text>
              <Text style={styles.accommodationType}>{accommodation.type}</Text>
              <View style={styles.ratingContainer}>
                <Feather name="star" size={14} color={COLORS.primary} />
                <Text style={styles.rating}>{accommodation.rating}</Text>
              </View>
              <Text style={styles.price}>{accommodation.price}/night</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
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
    fontWeight: '600',
    color: COLORS.textDark,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  accommodationCard: {
    width: 200,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginRight: SPACING.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  accommodationImage: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: SPACING.sm,
  },
  accommodationName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  accommodationType: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  rating: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default AccommodationCarousel; 