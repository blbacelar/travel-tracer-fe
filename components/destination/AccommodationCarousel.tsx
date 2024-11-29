import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING } from "../../constants/theme";
import { Location } from "../../types/api";
import { useState, useEffect } from "react";
import {
  fetchNearbyAccommodations,
  getPlacePhoto,
} from "../../services/places";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { AddToTripModal } from '../trip/AddToTripModal';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Destination"
>;

interface AccommodationCarouselProps {
  location: Location;
}

const AccommodationCarousel: React.FC<AccommodationCarouselProps> = ({
  location,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState<any>(null);
  const [showAddToTripModal, setShowAddToTripModal] = useState(false);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setIsLoading(true);
        const places = await fetchNearbyAccommodations(
          location.latitude,
          location.longitude
        );

        const placesWithPhotos = await Promise.all(
          places.map(async (place) => ({
            ...place,
            image: place.photos?.[0]
              ? await getPlacePhoto(place.photos[0].photo_reference)
              : "https://picsum.photos/200/300", // fallback image
            website: place.website || null,
          }))
        );

        setAccommodations(placesWithPhotos);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch accommodations"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccommodations();
  }, [location]);

  const handleSeeAll = () => {
    navigation.navigate("AccommodationList", {
      accommodations: accommodations,
    });
  };

  const handleWebsitePress = async (website: string | null) => {
    if (!website) {
      Alert.alert("No Website", "This place doesn't have a website listed.");
      return;
    }
    try {
      await Linking.openURL(website);
    } catch (error) {
      Alert.alert("Error", "Cannot open this website");
    }
  };

  const handleAccommodationPress = (accommodation: any) => {
    setSelectedAccommodation(accommodation);
    setShowAddToTripModal(true);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load accommodations</Text>
      </View>
    );
  }

  if (accommodations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No accommodations found nearby</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Where to Stay</Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {accommodations.map((accommodation) => (
          <TouchableOpacity
            key={accommodation.id}
            style={styles.accommodationCard}
            onPress={() => handleAccommodationPress(accommodation)}
          >
            <Image
              source={{ uri: accommodation.image }}
              style={styles.accommodationImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.accommodationName}>{accommodation.name}</Text>
              <Text style={styles.accommodationType}>
                {accommodation.type.charAt(0).toUpperCase() +
                  accommodation.type.slice(1)}
              </Text>
              <View style={styles.ratingContainer}>
                <Feather name="star" size={14} color={COLORS.primary} />
                <Text style={styles.rating}>
                  {accommodation.rating.toFixed(1)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.websiteButton}
                onPress={() => handleWebsitePress(accommodation.website)}
              >
                <Feather name="globe" size={14} color={COLORS.primary} />
                <Text style={styles.websiteText}>
                  {accommodation.website
                    ? "Visit Website"
                    : "No Website Available"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedAccommodation && (
        <AddToTripModal
          visible={showAddToTripModal}
          onClose={() => {
            setShowAddToTripModal(false);
            setSelectedAccommodation(null);
          }}
          location={{
            id: selectedAccommodation.id,
            name: selectedAccommodation.name,
            type: selectedAccommodation.type,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
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
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  accommodationImage: {
    width: "100%",
    height: 120,
  },
  cardContent: {
    padding: SPACING.sm,
  },
  accommodationName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  accommodationType: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  rating: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  loadingContainer: {
    padding: SPACING.xl,
    alignItems: "center",
  },
  errorContainer: {
    padding: SPACING.xl,
    alignItems: "center",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  websiteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  websiteText: {
    fontSize: 14,
    color: COLORS.primary,
  },
});

export default AccommodationCarousel;
