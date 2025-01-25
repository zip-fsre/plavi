import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Pozadina from './ui/Pozadina';
import SmallButton from './ui/SmallButton';
import { usePage } from '../Routes'; 

const PartnersPage = () => {
  const { setCurrentPage, pages } = usePage(); 
  const [partners, setPartners] = useState([
    { naziv: 'Prvi partner', vrsta: 'Maneken', opis: 'Nisam ja za ovoga...', cijena: '1000' },
    { naziv: 'Drugi partner', vrsta: 'Sviralo', opis: 'Svira svirku, brine brigu...', cijena: '1500' },
  ]);

  const handleAddPartner = () => {
    setCurrentPage(pages.AddPartner);
  };

  
  const handleEditPartner = (index) => {
    const selectedPartner = partners[index];
    setCurrentPage({
      ...pages.EditPartner,
      props: { partner: selectedPartner, index, setPartners },
    });
  };

  const handleViewPartner = (index) => {
    const selectedPartner = partners[index];
    setCurrentPage({
      ...pages.ViewPartner,
      props: { partner: selectedPartner },
    });
  };

  return (
    <Pozadina>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Partneri</Text>
          <SmallButton title="Novi" onPress={handleAddPartner} style={styles.newButton} />
        </View>

        <ScrollView style={styles.partneri}>
          {partners.map((partner, index) => (
            <View key={index} style={styles.partnerContainer}>
              <View style={styles.partnerTextContainer}>
                <Text style={styles.partnerName}>{partner.naziv}</Text>
                <Text style={styles.partnerDetails}>{partner.vrsta}</Text>
                <Text style={styles.partnerDetails}>{partner.opis}</Text>
                <Text style={styles.partnerDetails}>Cijena: {partner.cijena} €</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handleViewPartner(index)}>
                  <Icon name="info" size={24} color="#e8c789" style={styles.viewIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEditPartner(index)}>
                  <Icon name="edit" size={24} color="#e8c789" style={styles.editIcon} />
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
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Monotype Corsiva',
    fontSize: 40,
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
    alignItems: 'center',
    backgroundColor: '#1a2322',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
  },
  partnerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  partnerName: {
    fontSize: 20,
    fontFamily: 'Monotype Corsiva',
    color: '#e8c789',
    marginBottom: 5,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  partnerDetails: {
    fontSize: 16,
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
});

export default PartnersPage;
