import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

type CategoryItemProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  isActive?: boolean;
  onPress: () => void;
};

const CategoryItem = ({ icon, label, isActive, onPress }: CategoryItemProps) => (
  <TouchableOpacity 
    style={[
      styles.categoryItem,
      isActive && styles.categoryItemActive
    ]}
    onPress={onPress}
  >
    <Feather 
      name={icon} 
      size={24} 
      color={isActive ? COLORS.background : COLORS.textDark}
    />
    <Text style={[
      styles.categoryLabel,
      isActive && styles.categoryLabelActive
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = React.useState('all');

  const categories = [
    { id: 'all', icon: 'grid', label: 'All' },
    { id: 'villas', icon: 'home', label: 'Villas' },
    { id: 'hotels', icon: 'bookmark', label: 'Hotels' },
    { id: 'apartments', icon: 'archive', label: 'Apartments' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            icon={category.icon}
            label={category.label}
            isActive={activeCategory === category.id}
            onPress={() => setActiveCategory(category.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryLabel: {
    marginLeft: SPACING.xs,
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: COLORS.background,
  },
});

export default CategoryFilter; 