import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { COLORS, SPACING, FONT_SIZES } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import AuthButton from "./AuthButton";
import { useOAuthFlow } from "../../hooks/useOAuthFlow";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";
import { Strategy } from "../../types/auth";

const SocialAuthButtons = () => {
  useWarmUpBrowser();
  const { colors } = useTheme();
  const { onSelectAuth } = useOAuthFlow();

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
          onPress={() => onSelectAuth(Strategy.Google)}
          variant="secondary"
        />
        {Platform.OS === 'ios' && (
          <AuthButton
            title="Apple"
            onPress={() => onSelectAuth(Strategy.Apple)}
            variant="secondary"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.xl,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
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
