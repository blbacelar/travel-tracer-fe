import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import PromoBanner from '../components/PromoBanner';
import CategoryFilter from '../components/CategoryFilter';
import DestinationGrid from '../components/DestinationGrid';
// import SpecialEvents from '../components/SpecialEvents';
import BottomNav from '../components/BottomNav';

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header username="John" />
        <SearchBar />
        <PromoBanner />
        <CategoryFilter />
        <DestinationGrid />
        {/* <SpecialEvents /> */}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
}); 