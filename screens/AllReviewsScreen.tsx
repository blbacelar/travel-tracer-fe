import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'AllReviews'>;

const MOCK_REVIEWS = [
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
  // Add more mock reviews
];

const AllReviewsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { locationName, rating, totalReviews } = route.params;

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

  const renderReview = ({ item }: { item: typeof MOCK_REVIEWS[0] }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.userName}>{item.user}</Text>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
      {renderStars(item.rating)}
      <Text style={styles.reviewText}>{item.comment}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.locationName}>{locationName}</Text>
        <View style={styles.ratingInfo}>
          <Text style={styles.ratingNumber}>{rating.toFixed(1)}</Text>
          {renderStars(rating)}
          <Text style={styles.totalReviews}>({totalReviews} reviews)</Text>
        </View>
      </View>

      <FlatList
        data={MOCK_REVIEWS}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.reviewsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'android' ? SPACING.xl : SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingContainer: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  locationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 24,
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
  reviewsList: {
    padding: SPACING.md,
  },
  reviewCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
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

export default AllReviewsScreen; 