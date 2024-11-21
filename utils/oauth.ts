import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { Platform } from "react-native";

export const useOAuthFlow = () => {
  const redirectUrl = makeRedirectUri({
    scheme: "travel-tracer",
    path: "/oauth-native-callback",
  });

  const createSessionFromGoogle = async () => {
    try {
      const authUrl = `${process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}/v1/oauth/google?redirect_url=${encodeURIComponent(
        redirectUrl
      )}`;
      
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl,
        {
          showInRecents: true,
          preferEphemeralSession: true,
        }
      );

      if (result.type === "success") {
        const { url } = result;
        return url;
      }
      
      return null;
    } catch (err) {
      console.error("Error in OAuth flow:", err);
      return null;
    }
  };

  return {
    createSessionFromGoogle,
  };
}; 