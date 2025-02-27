import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Pozadina from '../ui/Pozadina';
import '../ui/scrollbar.css';
import { usePage } from '../../Routes';
import TouchablePartner from '../ui/TouchablePartner';

const BASE_URL = 'http://localhost:5149/api/Partneri';

const ExistingPartners = () => {
  const { currentPage, setCurrentPage, pages } = usePage();
  const [partneri, setPartneri] = useState([]);

   // Funkcija za dohvat partnere sa servera
   const fetchPartneri = useCallback(async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) throw new Error('Neuspješan GET zahtjev');
      const data = await response.json();

      const sortedPartneri = data.sort((a, b) => b.id - a.id);

      setPartneri(sortedPartneri); // Spremi podatke u state
    } catch (error) {
      console.error(error);
      alert('Ne mogu dohvatiti partnere. Pokušajte kasnije.');
    }
  }, []);

  useEffect(() => {
    fetchPartneri();
  }, [fetchPartneri]);

  useFocusEffect(
    useCallback(() => {
      fetchPartneri();
    }, [fetchPartneri])
  );
   // Funkcija koja će se pozvati kada pritisneš partnera
   const handlePartnerPress = (id) => {
    console.log('Partner ID:', id);
    setCurrentPage({ ...pages['AddPartner'], partnerId: id });
  };



  return (
    <Pozadina>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Odaberi partnera za predložak:</Text>
        </View>
        <ScrollView
          style={styles.reportsList}
          keyboardShouldPersistTaps="handled"
        >
           {/* Renderiraj partnere */}
           {partneri.map((partner) => (
            <TouchablePartner
              key ={partner.id}
              id={partner.id} 
              naziv={partner.naziv} 
              opis={partner.opis} 
              onPress={handlePartnerPress}
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

export default ExistingPartners;
