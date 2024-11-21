import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
} from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { useSignIn } from "@clerk/clerk-expo";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Feather } from "@expo/vector-icons";
import SocialAuthButtons from "../../components/auth/SocialAuthButtons";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { signIn, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!isLoaded || !signIn) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      await completeSignIn.createdSessionId;
      // Handle successful sign in
    } catch (err) {
      const error = err as Error;
      setError(error.message || "An error occurred during sign in");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={24} color={colors.textDark} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.textDark }]}>
              Welcome Back!
            </Text>
            <Text style={[styles.subtitle, { color: colors.textLight }]}>
              Sign in to continue
            </Text>
          </View>

          <View style={styles.form}>
            <AuthInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail"
            />

            <AuthInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              icon="lock"
            />

            {error ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            ) : null}

            <AuthButton
              title="Sign In"
              onPress={handleSignIn}
              loading={!isLoaded}
            />

            <SocialAuthButtons />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textLight }]}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  backButton: {
    padding: SPACING.xs,
    marginBottom: SPACING.sm,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
  },
  form: {
    gap: SPACING.md,
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZES.md,
  },
  footerLink: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  }
});

export default LoginScreen;
