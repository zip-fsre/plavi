import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 

const Pozadina = ({ children }) => {
  const cornerImageStyle = {
    position: 'absolute',
    width: 500,
    height: 600,
    opacity: 0.85,
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#95997e', '#222c2b']} 
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientBackground}
      />
      <View style={styles.content}>
        <Image
          source={require('../../assets/flower4.png')}
          style={[
            cornerImageStyle,
            { top: -200, right: -200, transform: [{ rotate: '-45deg' }] },
          ]}
        />

        <Image
          source={require('../../assets/flower4.png')}
          style={[
            cornerImageStyle,
            { bottom: -200, left: -200, transform: [{ rotate: '45deg' }] },
          ]}
        />
        <View style={styles.childrenContainer}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject, 
  },
  content: {
    backgroundColor: '#222c2b',
    borderWidth: 8,
    borderColor: '#e8c789',
    borderRadius: 0,
    position: 'relative',
    padding: 20,
    width: '80%',
    height: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Palace Script MT',
    fontSize: 68,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    color: '#e8c789',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Monotype Corsiva',
    lineHeight: 24,
  },
});

export default Pozadina;
