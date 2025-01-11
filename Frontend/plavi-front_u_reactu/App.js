import React from 'react';
import { StyleSheet, View } from 'react-native';
import HomePage from './components/HomePage'; 

export default function App() {
  return (
    <View style={styles.container}>
      <HomePage /> {/* Pozivanje HomePage komponente */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
