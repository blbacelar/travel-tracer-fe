import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS, SPACING } from "../../constants/theme";
import { useTrip } from "../../context/TripContext";
import { CreateTripModal } from "./CreateTripModal";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

interface AddToTripModalProps {
  visible: boolean;
  onClose: () => void;
  location: {
    id: string;
    name: string;
    type: string;
  };
}

const SINGLE_DAY_TYPES = ["gas_station", "restaurant"];

export const AddToTripModal: React.FC<AddToTripModalProps> = ({
  visible,
  onClose,
  location,
}) => {
  const { currentTrip, hasActiveTrip, addLocation } = useTrip();
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");

  const isSingleDayLocation = SINGLE_DAY_TYPES.includes(location.type);

  const getDateLabels = () => {
    if (isSingleDayLocation) {
      return { start: "Visit Date" };
    }

    switch (location.type) {
      case "lodging":
        return { start: "Check-in Date", end: "Check-out Date" };
      case "campground":
      case "rv_park":
        return { start: "Arrival Date", end: "Departure Date" };
      default:
        return { start: "Start Date", end: "End Date" };
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;
    setStartDate(date);
    // If it's a single day location or if end date is before new start date
    if (isSingleDayLocation || date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) return;
    if (date < startDate) {
      Alert.alert("Invalid Date", "End date cannot be before start date");
      return;
    }
    setEndDate(date);
  };

  const handleAdd = () => {
    if (!currentTrip) return;

    // Validate dates are within trip period
    if (
      startDate < currentTrip.period.startDate ||
      endDate > currentTrip.period.endDate
    ) {
      Alert.alert(
        "Invalid Dates",
        "Please select dates within your trip period"
      );
      return;
    }

    addLocation({
      ...location,
      startDate,
      endDate: isSingleDayLocation ? startDate : endDate,
      cost: cost ? Number(cost) : undefined,
      notes,
    });

    onClose();
  };

  if (!hasActiveTrip()) {
    return (
      <>
        <Modal
          visible={visible}
          animationType="slide"
          transparent
          onRequestClose={onClose}
        >
          <View style={styles.container}>
            <View style={styles.content}>
              <Text style={styles.title}>No Active Trip</Text>
              <Text style={styles.message}>
                You need to create a trip before adding locations.
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setShowCreateTrip(true);
                }}
              >
                <Text style={styles.buttonText}>Start Planning Trip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <CreateTripModal
          visible={showCreateTrip}
          onClose={() => setShowCreateTrip(false)}
        />
      </>
    );
  }

  const dateLabels = getDateLabels();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Add to Trip</Text>
          <Text style={styles.subtitle}>{currentTrip?.name}</Text>
          <Text style={styles.locationName}>{location.name}</Text>

          <View style={styles.dateSection}>
            <Text style={styles.label}>{dateLabels.start}</Text>
            <DateTimePicker
              value={startDate}
              mode="date"
              onChange={(_, date) => handleStartDateChange(date)}
              minimumDate={currentTrip?.period.startDate}
              maximumDate={currentTrip?.period.endDate}
            />

            {!isSingleDayLocation && (
              <>
                <Text style={styles.label}>{dateLabels.end}</Text>
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  onChange={(_, date) => handleEndDateChange(date)}
                  minimumDate={startDate}
                  maximumDate={currentTrip?.period.endDate}
                />
              </>
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder={`Estimated Cost (e.g., ${
              isSingleDayLocation ? "$50 total" : "$150 per night"
            })`}
            placeholderTextColor={COLORS.textLight}
            value={cost}
            onChangeText={setCost}
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={`Notes (e.g., ${
              isSingleDayLocation
                ? "Preferred time, special requirements"
                : "Room preferences, special requests"
            })`}
            placeholderTextColor={COLORS.textLight}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>Add to Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: SPACING.lg,
  },
  content: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
    textAlign: "center",
    lineHeight: 22,
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
    padding: SPACING.md,
    fontSize: 16,
    marginBottom: SPACING.lg,
    color: COLORS.textDark,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.sm,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
  dateSection: {
    marginVertical: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  locationName: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.textDark,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
});
