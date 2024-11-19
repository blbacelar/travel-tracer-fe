import { Location, SearchFilters } from "../types/api";
import { ENV } from "../config/env";

export const fetchLocations = async (
  filters: SearchFilters
): Promise<Location[]> => {
  try {
    const { latitude, longitude, radius, weather } = filters;
    
    // Format coordinates to 5 decimal places
    const formattedLat = Number(latitude).toFixed(5);
    const formattedLng = Number(longitude).toFixed(5);

    const params = new URLSearchParams({
      latitude: formattedLat,
      longitude: formattedLng,
      radius: radius.toString(),
    });

    if (weather !== null) {
      params.append("weatherCondition", weather.toLowerCase());
    }

    const url = `${ENV.API_URL}/locations/search?${params}`;
    console.log("🚀 API Request URL:", url);

    const response = await fetch(url);
    console.log("📡 Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ API Response data:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching locations:", error);
    throw error;
  }
};
