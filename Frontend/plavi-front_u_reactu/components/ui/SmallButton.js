import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SmallButton = ({ title, onPress }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.button, hovered && styles.buttonHover]}
      onPress={onPress}
      onMouseEnter={() => setHovered(true)} 
      onMouseLeave={() => setHovered(false)} 
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#e8c789',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginTop: 0,
    alignSelf: 'center',
    minWidth: 100,
  },
  buttonHover: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    transform: [{ scale: 1.05 }], 
  },
  buttonText: {
    color: '#222c2b',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Monotype Corsiva',
  },
});

export default SmallButton;
