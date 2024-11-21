import { useOAuth, useAuth } from "@clerk/clerk-expo";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { Strategy } from "../types/auth";

export function useOAuthFlow() {
  const navigation = useNavigation();
  const { signOut } = useAuth();

  const { startOAuthFlow: googleAuth } = useOAuth({
    strategy: Strategy.Google,
  });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: Strategy.Apple });

  const onSelectAuth = useCallback(
    async (strategy: Strategy) => {
      try {
        console.log(`[OAuth] Starting ${strategy} flow`);

        // Sign out if there's an existing session
        try {
          await signOut();
          console.log("[OAuth] Previous session cleared");
        } catch (e) {
          console.log("[OAuth] No previous session to clear");
        }

        const selectedAuth = {
          [Strategy.Google]: googleAuth,
          [Strategy.Apple]: appleAuth,
        }[strategy];

        if (!selectedAuth) {
          throw new Error("Auth strategy not found");
        }

        const { createdSessionId, setActive } = await selectedAuth();
        console.log("[OAuth] Flow completed:", {
          createdSessionId: !!createdSessionId,
        });

        if (createdSessionId) {
          await setActive!({ session: createdSessionId });
          console.log("[OAuth] Session activated");
          navigation.navigate("Main" as never);
        }
      } catch (err) {
        console.log(JSON.stringify(err, null, 4));
        console.error("[OAuth] Error:", {
          name: err?.constructor?.name,
          message: err instanceof Error ? err.message : "Unknown error",
          stack: err instanceof Error ? err.stack : "No stack trace",
        });
      }
    },
    [navigation, googleAuth, appleAuth, signOut]
  );

  return { onSelectAuth };
}
