import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING } from "../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useReviews } from "../../context/ReviewsContext";
import { formatDistanceToNow } from "date-fns";

interface ReviewSectionProps {
  locationId: string;
  locationName: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ReviewSection: React.FC<ReviewSectionProps> = ({
  locationId,
  locationName,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { getLocationReviews, getLocationRating } = useReviews();

  const reviews = getLocationReviews(locationId);
  const { rating, total: totalReviews } = getLocationRating(locationId);

  const handleSeeAll = () => {
    navigation.navigate("AllReviews", {
      locationName,
      locationId,
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

  const formatReviewDate = (timestamp: any) => {
    try {
      if (!timestamp) return "";
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "";
    }
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
              <View style={styles.userInfo}>
                {review.userImage ? (
                  <Image
                    source={{ uri: review.userImage }}
                    style={styles.userImage}
                  />
                ) : (
                  <View style={styles.userImagePlaceholder}>
                    <Text style={styles.userImagePlaceholderText}>
                      {review.userName[0]?.toUpperCase()}
                    </Text>
                  </View>
                )}
                <Text style={styles.userName}>{review.userName}</Text>
              </View>
              {/* <Text style={styles.reviewDate}>
                {formatReviewDate(review.timestamp)}
              </Text> */}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  ratingNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginRight: SPACING.sm,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: SPACING.xs,
  },
  userImagePlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.xs,
  },
  userImagePlaceholderText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
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
