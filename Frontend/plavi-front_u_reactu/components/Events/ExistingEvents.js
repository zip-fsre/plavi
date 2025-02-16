import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Pozadina from '../ui/Pozadina';
import '../ui/scrollbar.css';
import { usePage } from '../../Routes';
import TouchableDogadjaj from '../ui/TouchableDogadjaj';

const BASE_URL = 'http://localhost:5149/api/Dogadjaj';

const ExistingEvents = () => {
  const { currentPage, setCurrentPage, pages } = usePage();
  const [dogadjaji, setDogadjaji] = useState([]);

   // Funkcija za dohvat dogadjaje sa servera
   const fetchDogadjaji = useCallback(async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) throw new Error('Neuspješan GET zahtjev');
      const data = await response.json();

      const sortedDogadjaji = data.sort((a, b) => b.id - a.id);

      setDogadjaji(sortedDogadjaji); // Spremi podatke u state
    } catch (error) {
      console.error(error);
      alert('Ne mogu dohvatiti dogadjaje. Pokušajte kasnije.');
    }
  }, []);

  useEffect(() => {
    fetchDogadjaji();
  }, [fetchDogadjaji]);

  useFocusEffect(
    useCallback(() => {
      fetchDogadjaji();
    }, [fetchDogadjaji])
  );
   // Funkcija koja će se pozvati kada pritisneš dogadjdaje
   const handleDogadjajPress = (id) => {
    console.log('Dogadjaj ID:', id);
    setCurrentPage({ ...pages['createEvent'], dogadjajId: id });
  };



  return (
    <Pozadina>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Odaberi dogadjaj za predložak:</Text>
        </View>
        <ScrollView
          style={styles.reportsList}
          keyboardShouldPersistTaps="handled"
        >
           {/* Renderiraj izvješća */}
           {dogadjaji.map((dogadjaj) => (
            <TouchableDogadjaj
              key={dogadjaj.id}
              id={dogadjaj.id} 
              naziv={dogadjaj.naziv} 
              vrsta={dogadjaj.vrsta} 
              onPress={handleDogadjajPress}
            />
          ))}
         </ScrollView>
      </View>
    </Pozadina>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: '70%',
    marginBottom: 10,
    marginLeft: 20,
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Alex Brush',
    fontSize: 48,
    textAlign: 'left',
    marginBottom: 10,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  menu: {
    position: 'absolute',
    flex: 1,
    bottom: 15,
    left: '5%',
    width: '90%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    height: 30,
    width: 30,
  },
  createButtonContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e8c789',
    borderRadius: 10,
  },
  reportsList: {
      maxHeight: 400,
      marginTop: 25,
      alignSelf: 'center',
  },
  reportsTitle: {
    fontSize: 25,
    color: '#e8c789',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Monotype Corsiva',
  },
});

export default ExistingEvents;
