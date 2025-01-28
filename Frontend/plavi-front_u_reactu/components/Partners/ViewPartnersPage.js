import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Pozadina from '../ui/Pozadina';
import { usePage } from '../../Routes'; 

export const ViewPartner = () => {
  const { pages, currentPage, setCurrentPage } = usePage();
  const { id } = currentPage;

  return (
    <Pozadina>
      <View style={styles.container}>
        <Text style={styles.title}>Detalji partnera</Text>
        <Text style={styles.detailText}>Naziv: {'partner.naziv'}</Text>
        <Text style={styles.detailText}>Vrsta: {'partner.vrsta'}</Text>
        <Text style={styles.detailText}>Napomena: {'partner.napomena'}</Text>
        <Text style={styles.detailText}>Provizija: {'partner.provizija'} </Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => setCurrentPage(pages['Partners'])}>
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
    fontFamily: 'Alex Brush',
    fontSize: 48,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 20,
    fontFamily: 'Monotype Corsiva',
    alignSelf: 'center',
    color: '#e8c789',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e8c789',
    borderRadius: 5,
    alignSelf: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontFamily: 'Monotype Corsiva',
  },
});

export default ViewPartner;
