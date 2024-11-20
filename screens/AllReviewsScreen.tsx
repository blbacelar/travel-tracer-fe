import React, { useState } from 'react';
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
import AddReviewModal from '../components/destination/AddReviewModal';
import { useReviews } from '../context/ReviewsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AllReviews'>;

const AllReviewsScreen: React.FC<Props> = ({ navigation, route }) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const { locationName, locationId } = route.params;
  const { getLocationReviews, getLocationRating, addReview } = useReviews();
  
  const reviews = getLocationReviews(locationId);
  const { rating, total: totalReviews } = getLocationRating(locationId);

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

  const renderReview = ({ item }: { item: typeof reviews[0] }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.userName}>{item.user}</Text>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
      {renderStars(item.rating)}
      <Text style={styles.reviewText}>{item.comment}</Text>
    </View>
  );

  const handleAddReview = (rating: number, comment: string) => {
    addReview(locationId, rating, comment);
  };

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

      <View style={styles.addReviewContainer}>
        <TouchableOpacity
          style={styles.addReviewButton}
          onPress={() => setShowAddReview(true)}
        >
          <Feather name="edit-2" size={20} color={COLORS.background} />
          <Text style={styles.addReviewButtonText}>Write a Review</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.reviewsList}
        showsVerticalScrollIndicator={false}
      />

      <AddReviewModal
        visible={showAddReview}
        onClose={() => setShowAddReview(false)}
        onSubmit={handleAddReview}
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
  addReviewContainer: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  addReviewButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    borderRadius: 12,
    gap: SPACING.xs,
  },
  addReviewButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AllReviewsScreen; 