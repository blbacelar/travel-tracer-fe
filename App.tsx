import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import MainScreen from './screens/MainScreen';
import { LocationProvider } from './context/LocationContext';
import './config/env';

export default function App() {
  return (
    <LocationProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <MainScreen />
      </SafeAreaView>
    </LocationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
