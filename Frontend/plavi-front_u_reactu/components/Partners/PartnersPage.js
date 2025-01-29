import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Pozadina from '../ui/Pozadina';
import SmallButton from '../ui/SmallButton';
import { usePage } from '../../Routes';

const BASE_URL = 'https://your-backend-url.com/api/Partneri'; // Zamijeni s točnim URL-om backend-a

const PartnersPage = () => {
  const { setCurrentPage, pages } = usePage();
  const [partners, setPartners] = useState([]);

  // Funkcija za dohvaćanje partnera s backend-a
  const fetchPartners = async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      setPartners(data); // Postavljanje dohvaćenih partnera u state
    } catch (error) {
      console.error(error);
      Alert.alert('Greška', 'Ne mogu dohvatiti podatke o partnerima.');
    }
  };

  // Funkcija za brisanje partnera
  const handleDeletePartner = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Uspjeh', 'Partner je uspješno obrisan!');
        fetchPartners(); // Ponovno dohvaćanje partnera nakon brisanja
      } else {
        Alert.alert('Greška', 'Nešto nije u redu. Pokušajte ponovno.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Greška', 'Dogodila se greška pri brisanju partnera.');
    }
  };

  // Funkcija za dodavanje novog partnera
  const handleAddPartner = () => {
    setCurrentPage(pages['AddPartner']);
  };

  // Funkcija za uređivanje partnera
  const handleEditPartner = (partner) => {
    setCurrentPage({
      ...pages['EditPartner'],
      props: { partner },
    });
  };

  // Funkcija za pregled detalja partnera
  const handleViewPartner = (partner) => {
    setCurrentPage({
      ...pages['ViewPartner'],
      props: { partner },
    });
  };

  // Dohvaćanje partnera prilikom učitavanja komponente
  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <Pozadina>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Partneri</Text>
          <SmallButton title="Novi" onPress={handleAddPartner} style={styles.newButton} />
        </View>

        <ScrollView style={styles.partneri}>
          {partners.map((partner) => (
            <View key={partner.id} style={styles.partnerContainer}>
              <View style={styles.partnerTextContainer}>
                <Text style={styles.partnerName}>{partner.naziv}</Text>
                <Text style={styles.partnerDetails}>{partner.tip}</Text>
                <Text style={styles.partnerDetails}>{partner.napomena}</Text>
                <Text style={styles.partnerDetails}>Provizija: {partner.provizija}%</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handleViewPartner(partner)}>
                  <Icon name="info" size={24} color="#e8c789" style={styles.viewIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEditPartner(partner)}>
                  <Icon name="edit" size={24} color="#e8c789" style={styles.editIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePartner(partner.id)}>
                  <Icon name="delete" size={24} color="#e8c789" style={styles.deleteIcon} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  },
  partneri: {
    maxHeight: 800,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
    width: '80%',
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Alex Brush',
    fontSize: 48,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  newButton: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
  },
  partnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: '60%',
  },
  partnerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  partnerName: {
    fontSize: 24,
    fontFamily: 'Monotype Corsiva',
    color: '#e8c789',
    marginBottom: 5,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  partnerDetails: {
    fontSize: 20,
    fontFamily: 'Monotype Corsiva',
    color: '#e8c789',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewIcon: {
    marginHorizontal: 5,
  },
  editIcon: {
    marginHorizontal: 5,
  },
  deleteIcon: {
    marginHorizontal: 5,
  },
});

export default PartnersPage;
