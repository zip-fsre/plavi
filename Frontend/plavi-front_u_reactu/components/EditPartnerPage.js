import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Pozadina from './ui/Pozadina';
import { usePage } from '../Routes'; 

export const EditPartner = () => {
  const { pages, currentPage, setCurrentPage } = usePage();
  const { id } = currentPage;
  const [editPartner, setEditPartner] = React.useState({
    naziv: "Nesto",
    vrsta: "drugo",
    opis: "Neki opis",
    cijena: 2500
  });
  console.log(id);

  const handleSaveEditPartner = () => {
    if (editPartner.naziv && editPartner.vrsta && editPartner.opis && editPartner.cijena) {
      //Ovdje povezati sa backom za spremanje promjena
      setCurrentPage(pages['Partners'])
    } else {
      alert('Molimo ispunite sva polja!');
    }
  };

  return (
    <Pozadina>
      <View style={styles.container}>
        <Text style={styles.title}>Uredi partnera</Text>
        <TextInput
          style={styles.input}
          placeholder="Naziv partnera"
          placeholderTextColor="#ccc"
          value={editPartner.naziv}
          onChangeText={(text) => setEditPartner({ ...editPartner, naziv: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Vrsta partnera"
          placeholderTextColor="#ccc"
          value={editPartner.vrsta}
          onChangeText={(text) => setEditPartner({ ...editPartner, vrsta: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Cijena partnera (€)"
          placeholderTextColor="#ccc"
          value={editPartner.cijena}
          onChangeText={(text) => setEditPartner({ ...editPartner, cijena: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Opis partnera"
          placeholderTextColor="#ccc"
          value={editPartner.opis}
          onChangeText={(text) => setEditPartner({ ...editPartner, opis: text })}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveEditPartner}>
          <Text style={styles.saveButtonText}>Spremi promjene</Text>
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

export default EditPartner;
