import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SPACING } from '../../constants/theme';
import { useTrip } from '../../context/TripContext';

interface CreateTripModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  visible,
  onClose,
}) => {
  const { createTrip } = useTrip();
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [budget, setBudget] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    if (date < today) {
      Alert.alert(
        'Invalid Date',
        'Start date cannot be before today'
      );
      return;
    }

    setStartDate(date);
    if (date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    if (date < today) {
      Alert.alert(
        'Invalid Date',
        'End date cannot be before today'
      );
      return;
    }

    if (date < startDate) {
      Alert.alert(
        'Invalid Date',
        'End date cannot be before start date'
      );
      return;
    }

    setEndDate(date);
  };

  const handleCreate = () => {
    if (!tripName || !budget) return;

    createTrip(
      tripName,
      { startDate, endDate },
      Number(budget)
    );
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Plan Your Trip</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter trip name (e.g., Summer Vacation 2024)"
              placeholderTextColor={COLORS.textLight}
              value={tripName}
              onChangeText={setTripName}
              returnKeyType="done"
            />

            <View style={styles.dateSection}>
              <Text style={styles.label}>Start Date</Text>
              <DateTimePicker
                value={startDate}
                mode="date"
                onChange={(_, date) => handleStartDateChange(date)}
                minimumDate={today}
              />

              <Text style={styles.label}>End Date</Text>
              <DateTimePicker
                value={endDate}
                mode="date"
                onChange={(_, date) => handleEndDateChange(date)}
                minimumDate={startDate}
              />
            </View>

            <TextInput
              style={[styles.input, styles.budgetInput]}
              placeholder="Enter total budget (e.g., 5000)"
              placeholderTextColor={COLORS.textLight}
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
              returnKeyType="done"
            />

            <TouchableOpacity
              style={[
                styles.button,
                (!tripName || !budget) && styles.buttonDisabled
              ]}
              onPress={handleCreate}
              disabled={!tripName || !budget}
            >
              <Text style={[
                styles.buttonText,
                (!tripName || !budget) && styles.buttonTextDisabled
              ]}>
                Create Trip
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: SPACING.lg,
  },
  content: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.sm,
    fontSize: 16,
    marginBottom: SPACING.sm,
  },
  button: {
    ...Platform.select({
      ios: {
        backgroundColor: COLORS.primary,
      },
      android: {
        backgroundColor: COLORS.primary,
        elevation: 2,
      },
    }),
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  dateSection: {
    marginVertical: SPACING.md,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  budgetInput: {
    marginTop: SPACING.lg,
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
  },
  buttonTextDisabled: {
    color: COLORS.textLight,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.primary,
  },
}); 