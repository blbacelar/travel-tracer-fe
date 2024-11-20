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

export type RootStackParamList = {
  Main: undefined;
  Destination: { location: Location };
  AllReviews: { 
    locationName: string;
    rating: number;
    totalReviews: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
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
              <Stack.Screen name="Main" component={MainScreen} />
              <Stack.Screen name="Destination" component={DestinationScreen} />
              <Stack.Screen name="AllReviews" component={AllReviewsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ReviewsProvider>
      </FavoritesProvider>
    </LocationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
