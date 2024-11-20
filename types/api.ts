import { Feather } from '@expo/vector-icons';

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

export type WeatherCondition = 'Clear' | 'Partly cloudy' | 'Cloudy' | 'Rain' | 'Snow' | null;

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