import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Animated,
  SafeAreaView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING } from "../constants/theme";
import { Location } from "../types/api";
import AccommodationCarousel from "../components/destination/AccommodationCarousel";
import EventsList from "../components/destination/EventsList";
import WeatherInfo from "../components/destination/WeatherInfo";
import ActionButtons from "../components/destination/ActionButtons";
import BackButton from "../components/common/BackButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import CategoryFilter from "../components/CategoryFilter";
import { useFavorites } from "../context/FavoritesContext";
import ReviewSection from "../components/destination/ReviewSection";
import ShareModal from '../components/common/ShareModal';

type Props = NativeStackScreenProps<RootStackParamList, "Destination">;

const DestinationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { location } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const scrollY = new Animated.Value(0);
  const [showShareModal, setShowShareModal] = useState(false);

  const locationId = `${location.city}-${location.latitude}-${location.longitude}`;

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleFavoritePress = () => {
    toggleFavorite(locationId);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Text style={styles.headerTitle}>{location.city}</Text>
      </Animated.View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} color={COLORS.background} />
      </TouchableOpacity>

      {/* Action Buttons - Moved to top right */}
      <View style={styles.actionButtonsContainer}>
        <ActionButtons
          isFavorite={isFavorite(locationId)}
          onFavoritePress={handleFavoritePress}
          onSharePress={handleShare}
        />
      </View>

      <ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: location.imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <Text style={styles.cityName}>{location.city}</Text>
              <Text style={styles.location}>
                {location.state}, {location.country}
              </Text>
              <View style={styles.distanceContainer}>
                <Feather
                  name="navigation"
                  size={16}
                  color={COLORS.background}
                />
                <Text style={styles.distance}>{location.distance}km away</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Weather Information */}
        <WeatherInfo weather={location.weather} />

        <ReviewSection 
          locationId={locationId}
          locationName={location.city}
        />

        <CategoryFilter />
        {/* Accommodations Section */}
        <AccommodationCarousel location={location} />

        {/* Events Section */}
        <EventsList location={location} />

        {/* Start Trip Button */}
        <TouchableOpacity style={styles.startTripButton}>
          <Text style={styles.startTripText}>Start Planning Trip</Text>
        </TouchableOpacity>
      </ScrollView>

      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={`Visit ${location.city}`}
        message={`Check out ${location.city} on Travel Tracer! A beautiful destination in ${location.country}.`}
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: COLORS.background,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? SPACING.xl + 44 : SPACING.xl,
    left: SPACING.md,
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContainer: {
    height: 300,
    width: "100%",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  heroContent: {
    padding: SPACING.md,
  },
  cityName: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.background,
    marginBottom: SPACING.xs,
  },
  location: {
    fontSize: 18,
    color: COLORS.background,
    marginBottom: SPACING.sm,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  distance: {
    fontSize: 16,
    color: COLORS.background,
  },
  startTripButton: {
    backgroundColor: COLORS.primary,
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  startTripText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "600",
  },
  actionButtonsContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? SPACING.xl + 44 : SPACING.xl,
    right: SPACING.md,
    zIndex: 2,
    flexDirection: "row",
    gap: SPACING.sm,
  },
});

export default DestinationScreen;
