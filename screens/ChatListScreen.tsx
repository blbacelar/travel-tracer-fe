import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import { useUser, useOrganization } from "@clerk/clerk-expo";
import { COLORS, SPACING } from "../constants/theme";

interface ChatListScreenProps {
  onUserSelect: (userId: string, userName: string, userImage: string) => void;
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  emailAddresses: { emailAddress: string }[];
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({ onUserSelect }) => {
  const { user: currentUser } = useUser();
  const { organization } = useOrganization();
  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const members = await organization?.getMemberships();

        if (members) {
          const usersList = members
            .map((member) => {
              const userId = member.publicUserData.userId;
              if (!userId) return null;

              return {
                id: userId,
                firstName: member.publicUserData.firstName || "",
                lastName: member.publicUserData.lastName || "",
                imageUrl: member.publicUserData.imageUrl,
                emailAddresses: [
                  { emailAddress: member.publicUserData.identifier },
                ],
              };
            })
            .filter((user): user is NonNullable<typeof user> => user !== null);

          setUsers(usersList);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [organization]);

  // Filter out the current user from the list
  const otherUsers = users.filter((user) => user.id !== currentUser?.id);

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() =>
        onUserSelect(
          item.id, 
          `${item.firstName || ""} ${item.lastName || ""}`,
          item.imageUrl || ""
        )
      }
    >
      <View style={styles.avatarContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.firstName?.[0]}</Text>
          </View>
        )}
        <View
          style={[styles.onlineIndicator, { backgroundColor: "#bdbdbd" }]}
        />
      </View>

      <View style={styles.userInfo}>
        <View style={styles.nameTimeContainer}>
          <Text style={styles.userName}>
            {item.firstName} {item.lastName}
          </Text>
        </View>
        <Text style={styles.emailText}>
          {item.emailAddresses[0]?.emailAddress}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (users.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text>Loading users...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Users</Text>
      </View>
      <FlatList
        data={otherUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No users found</Text>
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
    paddingTop: Platform.OS === "android" ? SPACING.xl : 0,
  },
  header: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: SPACING.md,
  },
  userItem: {
    flexDirection: "row",
    padding: SPACING.md,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: SPACING.sm,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: "relative",
    marginRight: SPACING.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.primary,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userInfo: {
    flex: 1,
  },
  nameTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  emailText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 16,
  },
});

export default ChatListScreen;
