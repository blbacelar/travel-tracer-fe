import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import AuthButton from './AuthButton';
import { useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";

WebBrowser.maybeCompleteAuthSession();

const SocialAuthButtons = () => {
  const { colors } = useTheme();
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onGooglePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleOAuthFlow();
      
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error:", err);
    }
  }, [startGoogleOAuthFlow]);

  return (
    <View style={styles.container}>
      <View style={styles.divider}>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, { color: colors.textLight }]}>
          or continue with
        </Text>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
      </View>

      <View style={styles.socialButtons}>
        <AuthButton
          title="Google"
          onPress={onGooglePress}
          variant="secondary"
        />
        <AuthButton
          title="Apple"
          onPress={() => {/* Handle Apple auth */}}
          variant="secondary"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  line: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: FONT_SIZES.sm,
  },
  socialButtons: {
    gap: SPACING.md,
  },
});

export default SocialAuthButtons; 