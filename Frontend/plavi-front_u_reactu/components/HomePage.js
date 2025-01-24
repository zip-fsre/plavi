import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Pozadina from './ui/Pozadina';
import HoverButton from './ui/Button'; 

const HomePage = () => {
  const tester = async () => {
    try { 
      const response = await fetch('http://localhost:5149/api/Partneri');
      const data = await response.json(); console.log(data); 
    } catch (error) { 
      console.error(error); 
    }}

  return (
    <Pozadina>
      <View style={styles.container}>
          <Text style={styles.title}>Planify</Text>
          <Text style={styles.description}>
            Dobrodošli na Planify! Organizirajte svoje događaje na najbolji mogući način.
          </Text>
        <HoverButton title="Testiraj" onPress={() => tester()} />
      </View>
    </Pozadina>
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