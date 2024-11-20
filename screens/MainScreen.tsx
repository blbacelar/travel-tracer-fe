import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PromoBanner from "../components/PromoBanner";
import CategoryFilter from "../components/CategoryFilter";
import BottomNav from "../components/BottomNav";
import NoDestinations from "../components/NoDestinations";
import { useLocation } from "../context/LocationContext";
import { Location } from "../types/api";
import { COLORS, SPACING } from "../constants/theme";
import DestinationCard from "../components/DestinationCard";

export default function MainScreen() {
  const { locations, isLoading, error, filters } = useLocation();

  const ListHeaderComponent = () => (
    <>
      <Header username="John" />
      <SearchBar />
      <PromoBanner />
      <CategoryFilter />
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {filters.latitude === 0 && filters.longitude === 0 ? (
        <View style={styles.errorContainer}>
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      ) : null}
    </>
  );

  const ListEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }

    if (locations.length === 0 && !isLoading) {
      return <NoDestinations />;
    }

    return null;
  };

  const renderItem = ({ item }: { item: Location }) => (
    <DestinationCard location={item} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={locations}
          renderItem={renderItem}
          keyExtractor={(item) =>
            `${item.city}-${item.latitude}-${item.longitude}`
          }
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          numColumns={2}
          columnWrapperStyle={locations.length > 0 ? styles.row : undefined}
          contentContainerStyle={[
            styles.list,
            locations.length === 0 && styles.emptyList,
          ]}
        />
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? SPACING.xl : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  row: {
    justifyContent: "space-between",
    // paddingHorizontal: SPACING,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  errorContainer: {
    padding: SPACING.md,
    backgroundColor: "#ffebee",
    margin: SPACING.md,
    borderRadius: 8,
  },
  errorText: {
    color: "#c62828",
    textAlign: "center",
  },
  emptyList: {
    flex: 1,
  },
  loadingText: {
    color: COLORS.textLight,
    textAlign: "center",
  },
});
