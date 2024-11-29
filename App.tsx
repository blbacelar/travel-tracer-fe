import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './screens/MainScreen';
import DestinationScreen from './screens/DestinationScreen';
import { LocationProvider } from './context/LocationContext';
import { Location } from './types/api';
import './config/env';
import { FavoritesProvider } from './context/FavoritesContext';
import AllReviewsScreen from './screens/AllReviewsScreen';
import { ReviewsProvider } from './context/ReviewsContext';
import ChatScreen from './screens/ChatScreen';
import ChatRoomScreen from './screens/ChatRoomScreen';
import ProfileScreen from './screens/ProfileScreen';
import OnboardingScreen from './screens/auth/OnboardingScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import { ThemeProvider } from './context/ThemeContext';
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from './clerk';
import * as WebBrowser from 'expo-web-browser';
import { ChatProvider } from './context/ChatContext';
import ChatListScreen from './screens/ChatListScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AccommodationListScreen from './screens/AccommodationListScreen';
import { TripProvider } from './context/TripContext';
import TripDetailsScreen from './screens/TripDetailsScreen';

WebBrowser.maybeCompleteAuthSession();

export type RootStackParamList = {
  Main: undefined;
  Destination: { location: Location };
  AllReviews: { 
    locationName: string;
    locationId: string;
    rating: number;
    totalReviews: number;
  };
  Chat: undefined;
  ChatList: undefined;
  ChatRoom: { 
    roomId: string; 
    userName: string;
    userImage: string;
  };
  Profile: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  EditProfile: undefined;
  AccommodationList: {
    accommodations: any[];
  };
  TripDetails: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider 
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        tokenCache={tokenCache}
        appearance={{
          baseTheme: undefined
        }}
      >
        <ThemeProvider>
          <LocationProvider>
            <FavoritesProvider>
              <ReviewsProvider>
                <ChatProvider>
                  <TripProvider>
                    <NavigationContainer>
                      <StatusBar style="dark" />
                      <Stack.Navigator
                        screenOptions={{
                          headerShown: false,
                        }}
                      >
                        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                        <Stack.Screen name="Main" component={MainScreen} />
                        <Stack.Screen name="Destination" component={DestinationScreen} />
                        <Stack.Screen name="AllReviews" component={AllReviewsScreen} />
                        <Stack.Screen name="Chat" component={ChatScreen} />
                        <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="ChatList" component={ChatListScreen} />
                        <Stack.Screen 
                          name="AccommodationList" 
                          component={AccommodationListScreen} 
                        />
                        <Stack.Screen 
                          name="TripDetails" 
                          component={TripDetailsScreen} 
                        />
                      </Stack.Navigator>
                    </NavigationContainer>
                  </TripProvider>
                </ChatProvider>
              </ReviewsProvider>
            </FavoritesProvider>
          </LocationProvider>
        </ThemeProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
