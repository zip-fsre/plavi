import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Pozadina from './ui/Pozadina';
import HoverButton from './ui/Button'; 

const HomePage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Pozadina>
        <Text style={styles.title}>Planify</Text>
        <Text style={styles.description}>
          Dobrodošli na Planify! Organizirajte svoje događaje na najbolji mogući način.
        </Text>
      </Pozadina>
      {/* Izbornik na dnu */}
      <View style={styles.menu}>
        <HoverButton title="Početna" onPress={() => navigation.navigate('HomePage')} />
        <HoverButton title="Popis događaja" onPress={() => navigation.navigate('EventList')} />
        <HoverButton title="Stvori događaj" onPress={() => navigation.navigate('CreateEvent')} />
        <HoverButton title="Partneri" onPress={() => navigation.navigate('Partners')} />
        <HoverButton title="Izvješća" onPress={() => navigation.navigate('Reports')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Palace Script MT',
    fontSize: 140,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  description: {
    color: '#e8c789',
    fontSize: 18,
    fontFamily: 'Monotype Corsiva',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  menu: {
    position: 'absolute',
    flex: 1,
    bottom: 15,
    left: '5%',
    width: '90%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default HomePage;
