import React from 'react';

import { StyleSheet } from 'react-native';
import Layout from './components/Layout';
import { RoutesProvider } from './Routes';

export default function App() {
  return (
      <RoutesProvider>
        <Layout/>
      </RoutesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});