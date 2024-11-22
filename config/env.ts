import {
  EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_UNSPLASH_ACCESS_KEY,
  EXPO_PUBLIC_UNSPLASH_BASE_URL,
} from "@env";

// Check and load environment variables at startup
const requiredEnvVars = {
  EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_UNSPLASH_ACCESS_KEY,
  EXPO_PUBLIC_UNSPLASH_BASE_URL,
} as const;

// Validate all required environment variables are present
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

// Export validated environment variables
export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  UNSPLASH_ACCESS_KEY: requiredEnvVars.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY,
  UNSPLASH_BASE_URL: requiredEnvVars.EXPO_PUBLIC_UNSPLASH_BASE_URL,
} as const;
