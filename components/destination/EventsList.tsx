import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../constants/theme';
import { Location } from '../../types/api';

interface EventsListProps {
  location: Location;
}

// Temporary mock data - in a real app, this would come from an API
const MOCK_EVENTS = [
  {
    id: '1',
    name: 'Local Food Festival',
    date: '24 Mar',
    time: '10:00 AM',
    price: 'Free',
    image: 'https://picsum.photos/200/303',
  },
  {
    id: '2',
    name: 'City Art Exhibition',
    date: '26 Mar',
    time: '2:00 PM',
    price: '$15',
    image: 'https://picsum.photos/200/304',
  },
];

const EventsList: React.FC<EventsListProps> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Events</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {MOCK_EVENTS.map((event) => (
        <TouchableOpacity key={event.id} style={styles.eventCard}>
          <Image source={{ uri: event.image }} style={styles.eventImage} />
          <View style={styles.eventContent}>
            <Text style={styles.eventName}>{event.name}</Text>
            <View style={styles.eventDetails}>
              <View style={styles.detailItem}>
                <Feather name="calendar" size={14} color={COLORS.textLight} />
                <Text style={styles.detailText}>{event.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Feather name="clock" size={14} color={COLORS.textLight} />
                <Text style={styles.detailText}>{event.time}</Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{event.price}</Text>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: 100,
    height: 100,
  },
  eventContent: {
    flex: 1,
    padding: SPACING.sm,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  eventDetails: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
  },
  joinButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EventsList; 