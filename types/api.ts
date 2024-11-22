import { Feather } from "@expo/vector-icons";

export interface Weather {
  temperature: number;
  condition: string;
}

export interface Location {
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  distance: number;
  straightLineDistance: number;
  weather: Weather;
  imageUrl: string;
  description?: string;
}

export type FeatherIconName = keyof typeof Feather.glyphMap;

export type WeatherCondition =
  | "Clear"
  | "Partly cloudy"
  | "Cloudy"
  | "Rain"
  | "Light rain"
  | "Heavy rain"
  | "Thunderstorm"
  | "Snow"
  | "Light snow"
  | "Heavy snow"
  | "Sleet"
  | "Freezing rain"
  | "Drizzle"
  | "Light drizzle"
  | "Heavy drizzle"
  | "Shower rain"
  | "Light shower rain"
  | "Heavy shower rain"
  | "Fog"
  | "Mist"
  | "Haze"
  | "Smoke"
  | "Dust"
  | "Sand"
  | "Squall"
  | "Tornado"
  | "Hurricane"
  | "Tropical storm"
  | null;

export interface WeatherOption {
  label: string;
  value: WeatherCondition;
  icon: FeatherIconName;
}

export interface SearchFilters {
  latitude: number;
  longitude: number;
  radius: number;
  weather: WeatherCondition;
}

export interface SearchBarProps {
  onFiltersChange: (filters: SearchFilters) => void;
}

export interface SearchBarMethods {
  fetchLocations: (filters: SearchFilters) => void;
}
