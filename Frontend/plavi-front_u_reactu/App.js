import React from 'react';

import { StyleSheet } from 'react-native';
import { ReportProvider } from './ReportContext';
import Layout from './components/Layout';
import { RoutesProvider } from './Routes';

export default function App() {
  return (
    <ReportProvider>
      <RoutesProvider>
        <Layout/>
      </RoutesProvider>
    </ReportProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});