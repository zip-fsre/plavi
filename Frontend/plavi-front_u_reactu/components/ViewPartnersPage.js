import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Pozadina from './ui/Pozadina';

export const ViewPartner = ({ navigation, route }) => {
  const { partner } = route.params;

  return (
    <Pozadina>
      <View style={styles.container}>
        <Text style={styles.title}>Detalji partnera</Text>
        <Text style={styles.detailText}>Naziv: {partner.naziv}</Text>
        <Text style={styles.detailText}>Vrsta: {partner.vrsta}</Text>
        <Text style={styles.detailText}>Opis: {partner.opis}</Text>
        <Text style={styles.detailText}>Cijena: {partner.cijena} €</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeButtonText}>Zatvori</Text>
        </TouchableOpacity>
      </View>
    </Pozadina>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '90%',
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Monotype Corsiva',
    fontSize: 40,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e8c789',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: '100%',
    fontSize: 16,
    fontFamily: 'Monotype Corsiva',
    color: '#e8c789',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  saveButton: {
    backgroundColor: '#e8c789',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Monotype Corsiva',
  },
  detailText: {
    fontSize: 18,
    fontFamily: 'Monotype Corsiva',
    color: '#e8c789',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e8c789',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Monotype Corsiva',
    color: 'black',
  },
});
