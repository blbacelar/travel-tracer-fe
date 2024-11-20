import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import { FeatherIconName } from '../types/api';

interface CategoryItemProps {
  label: string;
  icon: FeatherIconName;
  isActive?: boolean;
  onPress?: () => void;
}

const CATEGORIES: CategoryItemProps[] = [
  {
    label: 'All',
    icon: 'grid',
  },
  {
    label: 'Popular',
    icon: 'star',
  },
  {
    label: 'Trending',
    icon: 'trending-up',
  },
  {
    label: 'Featured',
    icon: 'award',
  },
  {
    label: 'Nearby',
    icon: 'navigation',
  },
];

const CategoryItem: React.FC<CategoryItemProps> = ({
  label,
  icon,
  isActive = false,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.categoryItem, isActive && styles.categoryItemActive]}
    onPress={onPress}
  >
    <Feather
      name={icon}
      size={20}
      color={isActive ? COLORS.primary : COLORS.textLight}
    />
    <Text
      style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const CategoryFilter: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState('All');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((category) => (
        <CategoryItem
          key={category.label}
          {...category}
          isActive={activeCategory === category.label}
          onPress={() => setActiveCategory(category.label)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    flexDirection: 'row',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  categoryItemActive: {
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary,
  },
  categoryLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  categoryLabelActive: {
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default CategoryFilter; 