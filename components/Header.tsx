import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useUser } from "@clerk/clerk-expo";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Header = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useUser();

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
          onPress={() => navigation.navigate('Chat')}
        >
          <Feather name="message-circle" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="bell" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.xs,
  },
});

export default Header; 