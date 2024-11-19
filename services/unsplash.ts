import { ENV } from '../config/env';

export const getCityImage = async (
  city: string,
  country: string
): Promise<string> => {
  try {
    const searchQuery = `${city} ${country} city`;
    const encodedQuery = encodeURIComponent(searchQuery);
    const url = `${ENV.UNSPLASH_BASE_URL}/search/photos?query=${encodedQuery}&client_id=${ENV.UNSPLASH_ACCESS_KEY}&per_page=1&orientation=landscape`;

    console.log("Fetching image for:", searchQuery);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        "Unsplash API error:",
        response.status,
        await response.text()
      );
      throw new Error("Failed to fetch image");
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      console.log("No images found for:", searchQuery);
      return "";
    }

    console.log("Image found for:", searchQuery);
    return data.results[0].urls.regular;
  } catch (error) {
    console.error("Error fetching image:", error);
    return "";
  }
};
