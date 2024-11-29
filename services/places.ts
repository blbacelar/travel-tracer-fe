import { ENV } from "../config/env";

interface PlaceResult {
  id: string;
  name: string;
  type: string;
  rating: number;
  website?: string;
  photos?: Array<{
    photo_reference: string;
  }>;
}

export const fetchNearbyAccommodations = async (
  latitude: number,
  longitude: number,
  radius: number = 10000 // Default 10km radius
): Promise<PlaceResult[]> => {
  try {
    console.log("fetchNearbyAccommodations", { latitude, longitude, radius });

    const accommodationTypes = [
      "lodging",
      "campground",
      "rv_park",
      "gas_station",
      "restaurant",
    ];
    let allResults: any[] = [];

    // Fetch places for each accommodation type
    for (const type of accommodationTypes) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${ENV.GOOGLE_PLACES_API_KEY}`;

      console.log(`Fetching ${type} accommodations...`);
      const response = await fetch(url);
      const data = await response.json();

      console.log(JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.error(`Error fetching ${type}:`, data.error_message);
        continue; // Skip this type if there's an error, but continue with others
      }

      if (data.results) {
        // Add the accommodation type to each result
        const resultsWithType = data.results.map((place: any) => ({
          ...place,
          accommodationType: type,
        }));
        allResults.push(...resultsWithType);
      }
    }

    // Remove duplicates based on place_id
    const uniqueResults = Array.from(
      new Map(allResults.map((place) => [place.place_id, place])).values()
    );

    console.log(`Found ${uniqueResults.length} unique accommodations`);

    // Get details for each place to fetch the website
    const placesWithDetails = await Promise.all(
      uniqueResults.map(async (place) => {
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=website&key=${ENV.GOOGLE_PLACES_API_KEY}`;
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();

          return {
            id: place.place_id,
            name: place.name,
            type: place.accommodationType || place.types[0],
            rating: place.rating || 0,
            photos: place.photos,
            website: detailsData.result?.website || null,
          };
        } catch (error) {
          console.error(`Error fetching details for ${place.name}:`, error);
          return {
            id: place.place_id,
            name: place.name,
            type: place.accommodationType || place.types[0],
            rating: place.rating || 0,
            photos: place.photos,
            website: null,
          };
        }
      })
    );

    return placesWithDetails;
  } catch (error) {
    console.error("Error fetching places:", error);
    throw error;
  }
};

export const getPlacePhoto = async (
  photoReference: string,
  maxWidth: number = 400
): Promise<string> => {
  if (!photoReference) return "";

  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${ENV.GOOGLE_PLACES_API_KEY}`;
};
