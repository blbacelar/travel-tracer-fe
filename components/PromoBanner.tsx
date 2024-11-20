import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

const PromoBanner = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Explore the World!</Text>
        <Text style={styles.subtitle}>
          Get special offers and unique travel experiences
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Discover Now</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require("../assets/images/travelers.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.mint,
    borderRadius: 16,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    padding: SPACING.md,
    overflow: "hidden",
    marginBottom: SPACING.md,
  },
  contentContainer: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  button: {
    backgroundColor: COLORS.textDark,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: "600",
  },
  image: {
    width: 120,
    height: "100%",
  },
});

export default PromoBanner;
