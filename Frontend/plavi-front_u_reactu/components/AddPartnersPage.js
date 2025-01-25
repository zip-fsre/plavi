import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Pozadina from './ui/Pozadina';
import { usePage } from '../Routes'; 


export const AddPartner = () => {
  const { setCurrentPage, currentPage } = usePage(); 
  const { setPartners } = currentPage.props; 
  const [newPartner, setNewPartner] = useState({
    naziv: '',
    vrsta: '',
    opis: '',
    cijena: '',
  });

  console.log('Props:', currentPage.props);

  const handleCreatePartner = () => {
    if (newPartner.naziv && newPartner.vrsta && newPartner.opis && newPartner.cijena) {
      setPartners((prevPartners) => [...prevPartners, newPartner]); 
      setCurrentPage({ name: 'PartnersPage' }); 
    } else {
      Alert.alert('Greška', 'Molimo ispunite sva polja!'); 
    }
  };

  return (
    <Pozadina>
      <View style={styles.container}>
        <Text style={styles.title}>Novi partner</Text>

        <TextInput
          style={styles.input}
          placeholder="Naziv partnera"
          placeholderTextColor="#ccc"
          value={newPartner.naziv}
          onChangeText={(text) => setNewPartner({ ...newPartner, naziv: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Vrsta partnera"
          placeholderTextColor="#ccc"
          value={newPartner.vrsta}
          onChangeText={(text) => setNewPartner({ ...newPartner, vrsta: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Cijena partnera (€)"
          placeholderTextColor="#ccc"
          value={newPartner.cijena}
          onChangeText={(text) => setNewPartner({ ...newPartner, cijena: text })}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Opis partnera"
          placeholderTextColor="#ccc"
          value={newPartner.opis}
          onChangeText={(text) => setNewPartner({ ...newPartner, opis: text })}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleCreatePartner}>
          <Text style={styles.saveButtonText}>Stvori partnera</Text>
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
    paddingTop: 20,
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
});

export default AddPartner;
