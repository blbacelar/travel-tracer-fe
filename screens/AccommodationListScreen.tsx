import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING } from "../constants/theme";
import BackButton from "../components/common/BackButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import NoDestinations from "../components/NoDestinations";
import { AddToTripModal } from '../components/trip/AddToTripModal';

type Props = NativeStackScreenProps<RootStackParamList, "AccommodationList">;

const ACCOMMODATION_TYPES = [
  { id: "all", label: "All" },
  { id: "lodging", label: "Hotels" },
  { id: "campground", label: "Campgrounds" },
  { id: "rv_park", label: "RV Parks" },
  { id: "gas_station", label: "Gas Stations" },
  { id: "restaurant", label: "Restaurants" },
];

const RATING_FILTERS = [
  { value: 0, label: "All" },
  { value: 4, label: "4+" },
  { value: 3, label: "3+" },
  { value: 2, label: "2+" },
];

export default function AccommodationListScreen({ route, navigation }: Props) {
  const { accommodations: initialAccommodations } = route.params;
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedAccommodation, setSelectedAccommodation] = useState<any>(null);
  const [showAddToTripModal, setShowAddToTripModal] = useState(false);

  const filteredAccommodations = initialAccommodations
    .filter((acc) => selectedType === "all" || acc.type === selectedType)
    .filter((acc) => acc.rating >= selectedRating);

  const handleWebsitePress = async (website: string | null) => {
    if (!website) {
      Alert.alert(
        "No Website",
        "Sorry, this place doesn't have a website listed.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const supported = await Linking.canOpenURL(website);
      if (supported) {
        await Linking.openURL(website);
      } else {
        Alert.alert("Error", "Cannot open this website", [{ text: "OK" }]);
      }
    } catch (error) {
      console.error("Error opening website:", error);
      Alert.alert("Error", "Failed to open website", [{ text: "OK" }]);
    }
  };

  const handleAccommodationPress = (accommodation: any) => {
    setSelectedAccommodation(accommodation);
    setShowAddToTripModal(true);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleAccommodationPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.type}>
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </Text>
        <View style={styles.ratingContainer}>
          <Feather name="star" size={14} color={COLORS.primary} />
          <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
        </View>
        <TouchableOpacity
          style={styles.websiteButton}
          onPress={() => handleWebsitePress(item.website)}
        >
          <Feather
            name="globe"
            size={14}
            color={COLORS.primary}
            style={styles.websiteIcon}
          />
          <Text style={styles.websiteText}>
            {item.website ? "Visit Website" : "No Website Available"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Feather
        name="search"
        size={48}
        color={COLORS.textLight}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>No Places Found</Text>
      <Text style={styles.emptyText}>
        Try adjusting your filters to find more accommodations
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Accommodations</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.filtersContainer}>
        {/* Type Filter */}
        <Text style={styles.filterTitle}>Type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {ACCOMMODATION_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.filterButton,
                selectedType === type.id && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedType === type.id && styles.filterTextActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Rating Filter */}
        <Text style={styles.filterTitle}>Rating</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {RATING_FILTERS.map((rating) => (
            <TouchableOpacity
              key={rating.value}
              style={[
                styles.filterButton,
                selectedRating === rating.value && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedRating(rating.value)}
            >
              <View style={styles.ratingFilterContent}>
                <Text
                  style={[
                    styles.filterText,
                    selectedRating === rating.value && styles.filterTextActive,
                  ]}
                >
                  {rating.label}
                </Text>
                {rating.value > 0 && (
                  <Feather
                    name="star"
                    size={14}
                    color={
                      selectedRating === rating.value
                        ? COLORS.background
                        : COLORS.textDark
                    }
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredAccommodations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          filteredAccommodations.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={renderEmptyList}
      />

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  placeholder: {
    width: 40,
  },
  filtersContainer: {
    paddingVertical: SPACING.sm,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginLeft: SPACING.md,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  filterScroll: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.textDark,
    fontSize: 14,
  },
  filterTextActive: {
    color: COLORS.background,
  },
  ratingFilterContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  list: {
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: SPACING.md,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 200,
  },
  cardContent: {
    padding: SPACING.md,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  type: {
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
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyList: {
    flexGrow: 1,
  },
  websiteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  websiteIcon: {
    marginRight: SPACING.xs,
  },
  websiteText: {
    fontSize: 14,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});
