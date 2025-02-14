import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const TouchableReport = ({ id, naziv, opis, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(id)} style={styles.report}>
      <View style={styles.textBox}>
        <Text style={styles.title}>{naziv}</Text>
        <Text style={styles.description}>{opis}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default TouchableReport;

const styles = StyleSheet.create({
  report: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#222c2b',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '80%',
    alignSelf: 'center',
  },
  textBox: {
    width: '100%',
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Monotype Corsiva',
    textAlign: 'left',
    fontSize: 21,
  },
  description: {
    color: '#e8c789',
    fontSize: 18,
    fontFamily: 'Monotype Corsiva',
    textAlign: 'left',
    lineHeight: 24,
    marginTop: 5,
  },
});
