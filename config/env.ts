import {
  EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_UNSPLASH_ACCESS_KEY,
  EXPO_PUBLIC_UNSPLASH_BASE_URL,
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  EXPO_PUBLIC_SOCKET_URL,
  EXPO_PUBLIC_FIREBASE_API_KEY,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  EXPO_PUBLIC_FIREBASE_APP_ID,
  EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
} from "@env";

// Check and load environment variables at startup
const requiredEnvVars = {
  EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_UNSPLASH_ACCESS_KEY,
  EXPO_PUBLIC_UNSPLASH_BASE_URL,
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  EXPO_PUBLIC_SOCKET_URL,
} as const;

// Validate all required environment variables are present
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

// Export validated environment variables
export const ENV = {
  API_URL: EXPO_PUBLIC_API_URL,
  SOCKET_URL: EXPO_PUBLIC_SOCKET_URL,
  CLERK_PUBLISHABLE_KEY: EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  UNSPLASH_ACCESS_KEY: EXPO_PUBLIC_UNSPLASH_ACCESS_KEY,
  UNSPLASH_BASE_URL: EXPO_PUBLIC_UNSPLASH_BASE_URL,
  // Firebase config
  FIREBASE_API_KEY: EXPO_PUBLIC_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: EXPO_PUBLIC_FIREBASE_APP_ID,
  GOOGLE_PLACES_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '',
} as const;
