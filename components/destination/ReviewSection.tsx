import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewSectionProps {
  rating: number;
  totalReviews: number;
  reviews: Review[];
  locationName: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    user: 'Sarah M.',
    rating: 5,
    comment: 'Amazing place! The views are breathtaking and the local food is delicious.',
    date: '2 days ago'
  },
  {
    id: '2',
    user: 'John D.',
    rating: 4,
    comment: 'Great experience overall. Would definitely recommend visiting during spring.',
    date: '1 week ago'
  },
  {
    id: '3',
    user: 'Emma W.',
    rating: 5,
    comment: 'Perfect destination for both adventure and relaxation. Loved every moment!',
    date: '2 weeks ago'
  },
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ReviewSection: React.FC<ReviewSectionProps> = ({
  rating = 4.7,
  totalReviews = 128,
  reviews = MOCK_REVIEWS,
  locationName,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleSeeAll = () => {
    navigation.navigate('AllReviews', {
      locationName,
      rating,
      totalReviews,
    });
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Feather
            key={star}
            name="star"
            size={16}
            color={star <= rating ? COLORS.primary : COLORS.border}
            style={styles.star}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reviews</Text>
        <TouchableOpacity style={styles.seeAllButton} onPress={handleSeeAll}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingNumber}>{rating.toFixed(1)}</Text>
        {renderStars(rating)}
        <Text style={styles.totalReviews}>({totalReviews} reviews)</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.reviewsContainer}
      >
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.userName}>{review.user}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            {renderStars(review.rating)}
            <Text style={styles.reviewText} numberOfLines={3}>
              {review.comment}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  seeAllButton: {
    padding: SPACING.xs,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  ratingNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginRight: SPACING.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
  totalReviews: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
  },
  reviewsContainer: {
    paddingRight: SPACING.md,
  },
  reviewCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginRight: SPACING.md,
    width: 280,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  reviewText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    lineHeight: 20,
  },
});

export default ReviewSection; 