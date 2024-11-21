import React from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING } from "../../constants/theme";
import { Weather } from "../../types/api";
import { getWeatherIcon } from "../../utils/weather";

interface WeatherInfoProps {
  weather: Weather;
}

const getWeatherBackground = (condition: string): any => {
  const normalizedCondition = condition.toLowerCase();
  switch (normalizedCondition) {
    case "clear":
      return require("../../assets/images/weather/sunny.jpg");
    case "partly cloudy":
      return require("../../assets/images/weather/partly-cloudy.jpg");
    case "cloudy":
      return require("../../assets/images/weather/cloudy.jpg");
    case "rain":
      return require("../../assets/images/weather/rainy.jpg");
    case "snow":
      return require("../../assets/images/weather/snowy.jpg");
    case "light snow":
      return require("../../assets/images/weather/light-snow.jpg");
    case "patchy light snow":
      return require("../../assets/images/weather/light-snow.jpg");
    default:
      return require("../../assets/images/weather/default.jpg");
  }
};

const WeatherInfo: React.FC<WeatherInfoProps> = ({ weather }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={getWeatherBackground(weather.condition)}
        style={styles.weatherCard}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <Feather
            name={getWeatherIcon(weather.condition)}
            size={32}
            color={COLORS.background}
          />
          <Text style={styles.temperature}>{weather.temperature}°</Text>
          <Text style={styles.condition}>{weather.condition}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  weatherCard: {
    borderRadius: 12,
    overflow: "hidden",
    height: 140,
  },
  backgroundImage: {
    borderRadius: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
  },
  temperature: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.background,
    marginTop: SPACING.xs,
  },
  condition: {
    fontSize: 16,
    color: COLORS.background,
    marginTop: SPACING.xs,
  },
});

export default WeatherInfo;
