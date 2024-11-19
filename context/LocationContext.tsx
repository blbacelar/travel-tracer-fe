import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { SearchFilters, Location as LocationType } from '../types/api';
import { fetchLocations } from '../services/api';

interface LocationContextType {
  locations: LocationType[];
  filters: SearchFilters;
  updateFilters: (newFilters: SearchFilters) => void;
  isLoading: boolean;
  error: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    latitude: 0,
    longitude: 0,
    radius: 50,
    weather: null
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const newFilters = {
          ...filters,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setFilters(newFilters);

        // Fetch initial locations with user's current position
        const data = await fetchLocations(newFilters);
        setLocations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get location');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []); // Run once on mount

  const updateFilters = async (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchLocations(newFilters);
      console.log('Fetched locations:', data);
      setLocations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch locations');
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocationContext.Provider value={{ 
      locations, 
      filters, 
      updateFilters,
      isLoading,
      error 
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}; 