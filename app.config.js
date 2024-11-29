export default {
  expo: {
    name: "travel-tracer-fe",
    slug: "travel-tracer-fe",
    version: "1.0.0",
    orientation: "portrait",
    android: {
      package: "com.blbacelar.traveltracerfe",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    ios: {
      bundleIdentifier: "com.blbacelar.traveltracerfe",
      supportsTablet: true
    },
    extra: {
      EXPO_PUBLIC_GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
    },
  }
}; 