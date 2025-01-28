import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Pozadina from '../ui/Pozadina';
import { usePage } from '../../Routes';


const ArrangementInput = ({ arrangement, index, onChange }) => (
  <View style={styles.arrangementContainer}>
    <TextInput
      style={styles.input}
      placeholder="Naziv aranžmana"
      placeholderTextColor="#ccc"
      value={arrangement.naziv}
      onChangeText={(text) => onChange(index, 'naziv', text)}
    />
    <TextInput
      style={styles.input}
      placeholder="Opis aranžmana"
      placeholderTextColor="#ccc"
      value={arrangement.opis}
      onChangeText={(text) => onChange(index, 'opis', text)}
    />
    <TextInput
      style={styles.input}
      placeholder="Cijena aranžmana"
      placeholderTextColor="#ccc"
      value={arrangement.cijena}
      onChangeText={(text) => onChange(index, 'cijena', text)}
      keyboardType="numeric"
    />
  </View>
);

export const AddPartner = () => {
  const { pages, setCurrentPage, currentPage } = usePage();
  const [newPartner, setNewPartner] = useState({
    naziv: '',
    vrsta: '',
    napomena: '',
    provizija: '',
  });

  const [arrangements, setArrangements] = useState([{ naziv: '', opis: '', cijena: '' }]);

  const handleCreatePartner = () => {
    if (newPartner.naziv && newPartner.vrsta && newPartner.napomena && newPartner.provizija) {
      console.log('Dodan novi partner!');
      setCurrentPage(pages['Partners']);
    } else {
      Alert.alert('Greška', 'Molimo ispunite sva polja!');
    }
  };

  const handleAddArrangement = () => {
    setArrangements([...arrangements, { naziv: '', opis: '', cijena: '' }]);
  };

  const splitArrangementsIntoRows = (arrangements, itemsPerRow) => {
    const rows = [];
    for (let i = 0; i < arrangements.length; i += itemsPerRow) {
      rows.push(arrangements.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  const arrangementRows = splitArrangementsIntoRows(arrangements, 3);

  return (
    <Pozadina>
      <View style={styles.container}>
        <Text style={styles.title}>Novi partner</Text>
        <ScrollView style={styles.scrollView}>
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
            placeholder="Provizija partnera"
            placeholderTextColor="#ccc"
            value={newPartner.provizija}
            onChangeText={(text) => setNewPartner({ ...newPartner, provizija: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Napomena"
            placeholderTextColor="#ccc"
            value={newPartner.napomena}
            onChangeText={(text) => setNewPartner({ ...newPartner, napomena: text })}
          />

          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Aranzmani</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddArrangement}>
                <Text style={styles.addButtonText}>+ Dodaj aranžman</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleCreatePartner}>
                <Text style={styles.saveButtonText}>Stvori partnera</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.arrangementsWrapper}>
            {arrangementRows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.arrangementRow}>
                {row.map((arrangement, index) => (
                  <ArrangementInput
                    key={index}
                    arrangement={arrangement}
                    index={index + rowIndex * 3}
                    onChange={(idx, field, value) => {
                      const updatedArrangements = [...arrangements];
                      updatedArrangements[idx][field] = value;
                      setArrangements(updatedArrangements);
                    }}
                  />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
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
    fontFamily: 'Alex Brush',
    fontSize: 48,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 20,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  subtitle: {
    color: '#e8c789',
    fontFamily: 'Alex Brush',
    fontSize: 30,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  addButton: {
    backgroundColor: '#e8c789',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    fontSize: 20,
    fontFamily: 'Monotype Corsiva',
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#e8c789',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButtonText: {
    fontSize: 20,
    fontFamily: 'Monotype Corsiva',
    color: '#fff',
  },
  scrollView: {
    maxHeight: '60%',
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e8c789',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: '80%',
    fontSize: 20,
    fontFamily: 'Monotype Corsiva',
    color: '#e8c789',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  arrangementsWrapper: {
    flexGrow: 1,
  },
  arrangementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  arrangementContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default AddPartner;
