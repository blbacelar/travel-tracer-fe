import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Modal, FlatList, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { COLORS, SPACING } from '../constants/theme';
import { useLocation } from '../context/LocationContext';
import { WeatherOption, WeatherCondition, FeatherIconName, SearchFilters } from '../types/api';

const weatherOptions: WeatherOption[] = [
  { label: 'Any Weather', value: null, icon: 'thermometer' },
  { label: 'Clear', value: 'Clear', icon: 'sun' },
  { label: 'Partly Cloudy', value: 'Partly cloudy', icon: 'cloud' },
  { label: 'Cloudy', value: 'Cloudy', icon: 'cloud' },
  { label: 'Rain', value: 'Rain', icon: 'cloud-rain' },
  { label: 'Snow', value: 'Snow', icon: 'cloud-snow' },
];

const SearchBar = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showWeatherPicker, setShowWeatherPicker] = useState(false);
  const { filters, updateFilters } = useLocation();
  const [tempFilters, setTempFilters] = useState<SearchFilters>(filters);

  const handleFilterPress = () => {
    setTempFilters(filters);
    setShowFilters(!showFilters);
  };

  const handleWeatherSelect = (weather: WeatherCondition) => {
    setTempFilters(prev => ({
      ...prev,
      weather
    }));
    setShowWeatherPicker(false);
  };

  const handleRadiusChange = (value: number) => {
    setTempFilters(prev => ({
      ...prev,
      radius: Math.round(value)
    }));
  };

  const handleApplyFilters = () => {
    updateFilters(tempFilters);
    setShowFilters(false);
  };

  const getCurrentWeather = (): WeatherOption => {
    return weatherOptions.find(opt => opt.value === tempFilters.weather) || weatherOptions[0];
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Find best places"
          placeholderTextColor={COLORS.textLight}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
          <Feather name="sliders" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.radiusContainer}>
            <Text style={styles.filterLabel}>Maximum Distance: {tempFilters.radius}km</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={500}
              value={tempFilters.radius}
              onValueChange={handleRadiusChange}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.border}
              thumbTintColor={COLORS.primary}
            />
          </View>
          <View style={styles.weatherContainer}>
            <Text style={styles.filterLabel}>Weather Condition</Text>
            <TouchableOpacity 
              style={styles.weatherSelector}
              onPress={() => setShowWeatherPicker(true)}
            >
              <View style={styles.weatherSelectorContent}>
                <Feather 
                  name={getCurrentWeather().icon}
                  size={20} 
                  color={COLORS.textDark}
                  style={styles.weatherIcon}
                />
                <Text style={styles.weatherSelectorText}>{getCurrentWeather().label}</Text>
              </View>
              <Feather name="chevron-down" size={20} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={handleApplyFilters}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showWeatherPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWeatherPicker(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowWeatherPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Weather</Text>
              <TouchableOpacity onPress={() => setShowWeatherPicker(false)}>
                <Feather name="x" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={weatherOptions}
              keyExtractor={(item) => item.value?.toString() || 'any'}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.weatherOption,
                    tempFilters.weather === item.value && styles.weatherOptionSelected
                  ]}
                  onPress={() => handleWeatherSelect(item.value)}
                >
                  <View style={styles.weatherOptionContent}>
                    <Feather 
                      name={item.icon}
                      size={20}
                      color={tempFilters.weather === item.value ? COLORS.primary : COLORS.textDark}
                      style={styles.weatherOptionIcon}
                    />
                    <Text style={[
                      styles.weatherOptionText,
                      tempFilters.weather === item.value && styles.weatherOptionTextSelected
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textDark,
    height: '100%',
  },
  filterButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  filtersContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  radiusContainer: {
    marginBottom: SPACING.md,
  },
  filterLabel: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  weatherContainer: {
    marginTop: SPACING.md,
  },
  weatherSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.sm,
    backgroundColor: '#fff',
  },
  weatherSelectorText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.md,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  weatherOption: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  weatherOptionSelected: {
    backgroundColor: COLORS.primary + '20',
  },
  weatherOptionText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  weatherOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  weatherSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    marginRight: SPACING.xs,
  },
  weatherOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherOptionIcon: {
    marginRight: SPACING.sm,
    width: 24, // Fixed width for alignment
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: SPACING.sm,
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SearchBar; 