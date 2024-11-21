import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
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
import ProfileScreen from './screens/ProfileScreen';
import OnboardingScreen from './screens/auth/OnboardingScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import { ThemeProvider } from './context/ThemeContext';
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from './clerk';

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
  Profile: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  EditProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ClerkProvider 
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ThemeProvider>
        <LocationProvider>
          <FavoritesProvider>
            <ReviewsProvider>
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
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </ReviewsProvider>
          </FavoritesProvider>
        </LocationProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
