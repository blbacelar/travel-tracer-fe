import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './screens/MainScreen';
import DestinationScreen from './screens/DestinationScreen';
import { LocationProvider } from './context/LocationContext';
import { Location } from './types/api';
import './config/env';

export type RootStackParamList = {
  Main: undefined;
  Destination: { location: Location };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <LocationProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Destination" component={DestinationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LocationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
