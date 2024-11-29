import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useUser } from "@clerk/clerk-expo";
import { useChat } from "../context/ChatContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Header = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useUser();
  const { unreadCount } = useChat();

  // Get the first name, or username, or "there" as fallback
  const displayName = user?.firstName || user?.username || "there";

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Hello,</Text>
        <Text style={styles.username}>{displayName}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('ChatList')}
        >
          <Feather name="message-circle" size={24} color={COLORS.textDark} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="bell" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('TripDetails')}
        >
          <Feather name="calendar" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  iconButton: {
    position: 'relative',
    padding: SPACING.xs,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.background,
  },
  badgeText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header; 