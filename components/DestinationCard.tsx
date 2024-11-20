import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING } from "../constants/theme";
import { Location } from "../types/api";
import { getCityImage } from "../services/unsplash";
import { RootStackParamList } from "../App";

interface DestinationCardProps {
  location: Location;
  onPress?: () => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Main">;

const DestinationCard: React.FC<DestinationCardProps> = ({
  location,
  onPress,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { city, state, country, distance, weather } = location;
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      try {
        const url = await getCityImage(city, country);
        setImageUrl(url);
      } catch (error) {
        console.error("Error loading image:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImage();
  }, [city, country]);

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
  };

  const handlePress = () => {
    navigation.navigate("Destination", {
      location: {
        ...location,
        imageUrl: imageUrl,
      },
    });
  };

  console.log("🚀 Weather:", weather);
  if (!weather) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {isLoading ? (
        <View style={styles.imagePlaceholder}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Feather name="image" size={24} color={COLORS.textLight} />
        </View>
      )}

      {/* Favorite Button */}
      <TouchableOpacity
        style={[
          styles.favoriteButton,
          isFavorite && styles.favoriteButtonActive,
        ]}
        onPress={handleFavoritePress}
      >
        <Feather
          name="heart"
          size={20}
          color={isFavorite ? COLORS.primary : COLORS.textDark}
        />
      </TouchableOpacity>

      {/* Weather Badge */}
      <View style={styles.weatherBadge}>
        <Feather
          name={getWeatherIcon(weather.condition)}
          size={16}
          color={COLORS.textDark}
        />
        <Text style={styles.temperature}>{weather.temperature}°</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {city}
        </Text>
        <View style={styles.locationContainer}>
          <Feather name="map-pin" size={14} color={COLORS.textLight} />
          <Text style={styles.locationText} numberOfLines={1}>
            {state}, {country}
          </Text>
        </View>
        <View style={styles.weatherContainer}>
          <Feather name="navigation" size={14} color={COLORS.textLight} />
          <Text style={styles.weatherText}>{distance}km away</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getWeatherIcon = (condition: string): keyof typeof Feather.glyphMap => {
  const normalizedCondition = condition.toLowerCase();
  switch (normalizedCondition) {
    case "clear":
      return "sun";
    case "partly cloudy":
      return "cloud";
    case "cloudy":
      return "cloud";
    case "rain":
      return "cloud-rain";
    case "snow":
      return "cloud-snow";
    default:
      return "cloud";
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: SPACING.md,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 160,
  },
  imagePlaceholder: {
    width: "100%",
    height: 160,
    backgroundColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: SPACING.xs,
    zIndex: 1,
  },
  favoriteButtonActive: {
    backgroundColor: "rgba(255,255,255,1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  weatherBadge: {
    position: "absolute",
    top: SPACING.sm,
    left: SPACING.sm,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
  },
  temperature: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  cardContent: {
    padding: SPACING.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  weatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  weatherText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
});

export default DestinationCard;
