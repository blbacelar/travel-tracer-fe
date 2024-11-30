import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import { useTrip } from '../context/TripContext';
import BackButton from '../components/common/BackButton';
import { CreateTripModal } from '../components/trip/CreateTripModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'TripDetails'>;

const TripDetailsScreen = ({ navigation }: Props) => {
  const { currentTrip, deleteLocation } = useTrip();
  const [showCreateTrip, setShowCreateTrip] = useState(false);

  const calculateBalance = () => {
    if (!currentTrip) return 0;
    return currentTrip.budget - currentTrip.expenses;
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  if (!currentTrip) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.title}>Trip Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No active trip found</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowCreateTrip(true)}
          >
            <Text style={styles.buttonText}>Start Planning Trip</Text>
          </TouchableOpacity>
        </View>

        <CreateTripModal
          visible={showCreateTrip}
          onClose={() => setShowCreateTrip(false)}
        />
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: typeof currentTrip.locations[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.locationName}>{item.name}</Text>
          <Text style={styles.locationType}>
            {item.type.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </Text>
        </View>
        {item.cost && (
          <Text style={styles.cost}>${item.cost}</Text>
        )}
      </View>

      <View style={styles.dateContainer}>
        <Feather name="calendar" size={16} color={COLORS.primary} />
        <Text style={styles.dateText}>
          {new Date(item.startDate).toLocaleDateString()}
          {item.startDate !== item.endDate && 
            ` - ${new Date(item.endDate).toLocaleDateString()}`}
        </Text>
      </View>

      {item.notes && (
        <Text style={styles.notes}>{item.notes}</Text>
      )}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteLocation(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Trip Details</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tripInfo}>
        <Text style={styles.tripName}>{currentTrip?.name}</Text>
        <View style={styles.tripDates}>
          <Feather name="calendar" size={16} color={COLORS.primary} />
          <Text style={styles.tripDatesText}>
            {new Date(currentTrip.period.startDate).toLocaleDateString()} - {' '}
            {new Date(currentTrip.period.endDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.budgetContainer}>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Budget</Text>
            <Text style={styles.budgetValue}>
              {formatCurrency(currentTrip.budget)}
            </Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Spent</Text>
            <Text style={[
              styles.budgetValue,
              currentTrip.expenses > currentTrip.budget && styles.overBudget
            ]}>
              {formatCurrency(currentTrip.expenses)}
            </Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Balance</Text>
            <Text style={[
              styles.budgetValue,
              calculateBalance() < 0 && styles.overBudget
            ]}>
              {formatCurrency(calculateBalance())}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={currentTrip.locations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No places added to this trip yet</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  placeholder: {
    width: 40,
  },
  tripInfo: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tripName: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  tripDates: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  tripDatesText: {
    marginLeft: SPACING.xs,
    color: COLORS.textDark,
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  budgetItem: {
    alignItems: 'center',
    flex: 1,
  },
  budgetLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  budgetValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  overBudget: {
    color: COLORS.error,
  },
  list: {
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  locationType: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  cost: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dateText: {
    marginLeft: SPACING.xs,
    color: COLORS.textDark,
  },
  notes: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    padding: SPACING.sm,
    borderRadius: 8,
    marginTop: SPACING.sm,
  },
  deleteButtonText: {
    color: COLORS.background,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default TripDetailsScreen; 