import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';

interface DateSeparatorProps {
  date: Date;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isSameDay(date, today)) {
      return 'Today';
    }
    if (isSameDay(date, yesterday)) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{formatDate(date)}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  text: {
    fontSize: 12,
    color: COLORS.textLight,
    marginHorizontal: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
});

export default DateSeparator; 