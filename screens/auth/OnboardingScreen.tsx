import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
} from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type OnboardingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

interface OnboardingScreenProps {
  navigation: OnboardingScreenNavigationProp;
}

const { width, height } = Dimensions.get("window");

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Main Content Container */}
      <View style={styles.contentContainer}>
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            Track & Managing{" "}
            <Text style={[styles.highlightText, { color: colors.primary }]}>
              Travelling
            </Text>{" "}
            Expenses
          </Text>
          <Text style={styles.subtitleText}>
            Explore the new destination and enjoy events and track their expenses
          </Text>
        </View>

        {/* Header with Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/onboarding.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.secondaryButton,
              { borderColor: colors.primary },
            ]}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={[styles.buttonText, { color: colors.primary }]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: "space-between",
  },
  titleContainer: {
    marginTop: SPACING.xl * 2,
    alignItems: 'center',
  },
  titleText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
    color: COLORS.textDark,
  },
  highlightText: {
    fontWeight: '800',
  },
  subtitleText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.8,
    height: height * 0.4,
  },
  actionContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  button: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
  },
});

export default OnboardingScreen;
