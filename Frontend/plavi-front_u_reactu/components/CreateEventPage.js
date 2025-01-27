import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Pozadina from './ui/Pozadina';
import { Picker } from '@react-native-picker/picker';

const CreateEventPage = () => {
  const [imeIPrezime, setImeIPrezime] = useState('');
  const [nazivDogadjaja, setNazivDogadjaja] = useState('');
  const [tipDogadjaja, setTipDogadjaja] = useState('');
  const [brojGostiju, setBrojGostiju] = useState('');
  const [datum, setDatum] = useState('');
  const [napomena, setNapomena] = useState('');

  const handleSubmit = () => {
    if (!imeIPrezime || !nazivDogadjaja || !tipDogadjaja || !brojGostiju || !datum) {
      alert('Molimo popunite sva obavezna polja.');
      return;
    }
    console.log({
      imeIPrezime,
      nazivDogadjaja,
      tipDogadjaja,
      brojGostiju,
      datum,
      napomena,
    });
    alert('Događaj uspješno stvoren!');
  };

  return (
    <Pozadina>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Stvori događaj</Text>

        {/* Forma */}
        <View style={styles.formRow}>
          <View style={styles.column}>
            <Text style={styles.label}>Ime i prezime</Text>
            <TextInput
              style={styles.input}
              placeholder="Unesite ime i prezime"
              value={imeIPrezime}
              onChangeText={setImeIPrezime}
            />
            <Text style={styles.label}>Naziv događaja</Text>
            <TextInput
              style={styles.input}
              placeholder="Unesite naziv događaja"
              value={nazivDogadjaja}
              onChangeText={setNazivDogadjaja}
            />
            <Text style={styles.label}>Broj gostiju</Text>
            <TextInput
              style={styles.input}
              placeholder="Unesite broj gostiju"
              value={brojGostiju}
              keyboardType="numeric"
              onChangeText={setBrojGostiju}
            />
            <Text style={styles.label}>Datum i vrijeme</Text>
            <TextInput
              style={styles.input}
              placeholder="npr. 2025-01-01"
              value={datum}
              onChangeText={setDatum}
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Tip događaja</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipDogadjaja}
                style={styles.picker}
                onValueChange={(itemValue) => setTipDogadjaja(itemValue)}
              >
                <Picker.Item label="Odaberite tip događaja" value="" />
                <Picker.Item label="Vjenčanje" value="vjenčanje" />
                <Picker.Item label="Rođendan" value="rođendan" />
                <Picker.Item label="Krštenje" value="krštenje" />
                <Picker.Item label="Pričest" value="pričest" />
                <Picker.Item label="Krizma" value="krizma" />
                <Picker.Item label="Ostalo" value="ostalo" />
              </Picker>
            </View>
            <Text style={styles.label}>Napomena</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Unesite napomenu"
              value={napomena}
              onChangeText={setNapomena}
              multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
             <Text style={styles.buttonText}>STVORI DOGAĐAJ</Text>
           </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Pozadina>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 55,
    fontFamily: 'Alex Brush',
    color: '#e8c789',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginHorizontal: 15,
  },
  label: {
    fontSize: 20,
    fontFamily: 'Monotype Corsova',
    color: '#e8c789',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e8c789',
    borderRadius: 20,
    padding: 15,
    backgroundColor: '#95997e',
    opacity: 0.6,
    color: '#222c2b',
    marginBottom: 25,
    fontSize: 18,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e8c789',
    opacity: 0.6,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 25,
  },
  picker: {
    backgroundColor: '#95997e',
    opacity: 0.6,
    color: '#222c2b',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#e8c789',
    borderRadius: 20,
    padding: 15,
    backgroundColor: '#95997e',
    opacity: 0.6,
    height: 150,
    textAlignVertical: 'top',
    color: '#222c2b',
    marginBottom: 25,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#95997e',
    opacity: 0.9,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'center',
    width: '50%',
    borderWidth: 2,
    borderColor: '#e8c789',
  },
  buttonText: {
    fontSize: 22,
    fontFamily: 'Monotype Corsova',
    color: '#e8c789',
  },
});

export default CreateEventPage;
