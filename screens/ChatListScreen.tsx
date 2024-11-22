import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../context/ChatContext';
import { useUser, useAuth, useOrganization } from '@clerk/clerk-expo';
import { formatDistanceToNow } from 'date-fns';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { ChatRoom } from '../context/ChatContext';
import { ENV } from '../config/env';

type ChatListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatList'>;

interface RenderItemProps {
  item: ChatRoom;
}

interface ClerkUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
}

const ChatListScreen = () => {
  const navigation = useNavigation<ChatListScreenNavigationProp>();
  const { rooms } = useChat();
  const { user } = useUser();
  const { organization } = useOrganization();
  const [usersInfo, setUsersInfo] = useState<{ [key: string]: ClerkUser }>({});

  useEffect(() => {
    const fetchUsersInfo = async () => {
      if (!rooms.length || !organization) return;

      try {
        const members = await organization.getMemberships();
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
              };
            })
            .filter((user): user is NonNullable<typeof user> => user !== null);

          const usersMap = usersList.reduce((acc: { [key: string]: ClerkUser }, user) => {
            acc[user.id] = user;
            return acc;
          }, {});

          setUsersInfo(usersMap);
        }
      } catch (error) {
        console.error('Error fetching users info:', error);
      }
    };

    fetchUsersInfo();
  }, [rooms, organization]);

  const renderChatRoom = ({ item: room }: RenderItemProps) => {
    const otherParticipantId = room.participants.find((id: string) => id !== user?.id);
    const otherUser = otherParticipantId ? usersInfo[otherParticipantId] : null;
    const lastMessage = room.lastMessage?.content || 'No messages yet';
    const timestamp = room.lastMessage?.timestamp
      ? formatDistanceToNow(new Date(room.lastMessage.timestamp.seconds * 1000), { addSuffix: true })
      : '';

    const displayName = otherUser 
      ? `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() 
      : 'Unknown User';

    return (
      <TouchableOpacity
        style={styles.chatRoom}
        onPress={() => navigation.navigate('ChatRoom', {
          roomId: room.id,
          userName: displayName,
          userImage: otherUser?.imageUrl || ''
        })}
      >
        {otherUser?.imageUrl ? (
          <Image 
            source={{ uri: otherUser.imageUrl }} 
            style={styles.avatar}
            defaultSource={require('../assets/default-avatar.png')}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {displayName[0]?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
        <View style={styles.chatInfo}>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessage}
          </Text>
        </View>
        {timestamp && (
          <Text style={styles.timestamp}>{timestamp}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Chats</Text>
      </View>
      <FlatList
        data={rooms}
        renderItem={renderChatRoom}
        keyExtractor={(item: ChatRoom) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  chatRoom: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  chatInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
});

export default ChatListScreen;
