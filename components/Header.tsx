import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

interface HeaderProps {
  username: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Header: React.FC<HeaderProps> = ({ username }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Hello,</Text>
        <Text style={styles.username}>{username}</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.xs,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default Header; 