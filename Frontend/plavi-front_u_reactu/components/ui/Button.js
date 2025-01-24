import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress, bgColor, textColor }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <TouchableOpacity
    style={[styles.button, hovered && styles.buttonHover, {backgroundColor: bgColor || "#e8c789"}]}
    onPress={onPress}
    onMouseEnter={() => setHovered(true)} 
    onMouseLeave={() => setHovered(false)} 
  >
  <Text style={[styles.buttonText, {color: textColor || "#222c2b"}]}>{title}</Text>
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
    marginTop: 20,
    alignSelf: 'center',
    minWidth: 120,
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

export default Button;

/*

import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress, bgColor, textColor }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.button, hovered && styles.buttonHover, {backgroundColor: bgColor || "#e8c789"}]}
      onPress={onPress}
      onMouseEnter={() => setHovered(true)} 
      onMouseLeave={() => setHovered(false)} 
    >
    <Text style={[styles.buttonText, {color: textColor || "#222c2b"}]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginTop: 20,
    minWidth: 120,
  },
  buttonHover: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    transform: [{ scale: 1.05 }], 
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Arial',
  },
});

export default Button;


*/