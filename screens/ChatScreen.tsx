import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { useChat } from '../context/ChatContext';

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;

const ChatScreen = () => {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const { user } = useUser();
  const { getOrCreateChatRoom } = useChat();

  const handleStartChat = async () => {
    try {
      // For now, navigate to ChatList
      navigation.navigate('ChatList');
    } catch (error) {
      console.error('Error starting chat:', error);
    }
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
        <Text style={styles.title}>Messages</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.chatListButton}
          onPress={handleStartChat}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>View All Chats</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Start chatting with other travelers!
          </Text>
          <Text style={styles.subInfoText}>
            Connect and share experiences with people from around the world.
          </Text>
        </View>
      </View>
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
    paddingTop: 60, // Adjust for status bar
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  infoContainer: {
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  subInfoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default ChatScreen;
