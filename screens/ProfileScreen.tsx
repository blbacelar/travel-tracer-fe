import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "@clerk/clerk-expo";
import ProfileMenuItem from "../components/profile/ProfileMenuItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type ProfileScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useUser();

  const menuItems = [
    {
      icon: "calendar" as const,
      title: "My Reservations",
      subtitle: "View your upcoming and past trips",
      route: "Tabs" as const,
    },
    {
      icon: "heart" as const,
      title: "My Favorites",
      subtitle: "Places you've saved",
      route: "Tabs" as const,
    },
    {
      icon: "star" as const,
      title: "My Reviews",
      subtitle: "Reviews you've written",
      route: "Tabs" as const,
    },
    {
      icon: "thumbs-up" as const,
      title: "Rate App",
      subtitle: "Tell us what you think",
      route: "Tabs" as const,
    },
  ] as const;

  const location = user?.publicMetadata?.location as string | undefined;
  const userFullName = user?.fullName || "User Name";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textDark }]}>Profile</Text>
          <View style={styles.backButton} />
        </View>

        {/* Content Container - Added to align everything */}
        <View style={styles.contentContainer}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: user?.imageUrl || "https://via.placeholder.com/100",
                }}
                style={styles.avatar}
              />
              <TouchableOpacity
                style={[
                  styles.editAvatarButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => {}}
              >
                <Feather name="camera" size={14} color={colors.background} />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.textDark }]}>
                {userFullName}
              </Text>
              <View style={styles.locationContainer}>
                <Feather name="map-pin" size={14} color={colors.textLight} />
                <Text style={[styles.location, { color: colors.textLight }]}>
                  {location || "Add location"}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.editButton, { borderColor: colors.primary }]}
            onPress={() => {}}
          >
            <Feather name="edit-2" size={16} color={colors.primary} />
            <Text style={[styles.editButtonText, { color: colors.primary }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <ProfileMenuItem
                key={index}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                onPress={() => {}}
                isLast={index === menuItems.length - 1}
              />
            ))}
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            style={[
              styles.signOutButton,
              { backgroundColor: colors.error + "10" },
            ]}
            onPress={() => {
              /* Handle sign out */
            }}
          >
            <Feather name="log-out" size={20} color={colors.error} />
            <Text style={[styles.signOutText, { color: colors.error }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? SPACING.xl : 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.full,
  },
  contentContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  userInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  location: {
    fontSize: FONT_SIZES.sm,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.xs,
  },
  editButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: "500",
  },
  menuContainer: {
    marginTop: SPACING.lg,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  signOutText: {
    fontSize: FONT_SIZES.md,
    fontWeight: "500",
  },
});

export default ProfileScreen;
