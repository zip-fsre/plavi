import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Pozadina from '../ui/Pozadina';
import SmallButton from '../ui/SmallButton';
import { usePage } from '../../Routes'; 

const PartnersPage = () => {
  const { setCurrentPage, pages } = usePage(); 
  const [partners, setPartners] = useState([
    { naziv: 'Prvi partner', vrsta: 'Maneken', napomena: 'Nisam ja za ovoga...', provizija: '10%' },
    { naziv: 'Drugi partner', vrsta: 'Sviralo', napomena: 'Svira svirku, brine brigu...', provizija: '15%' },
  ]);

  const handleAddPartner = () => {
    setCurrentPage(pages['AddPartner']);
  };

  
  const handleEditPartner = (index) => {
    setCurrentPage({...pages['EditPartner'], id: { index },});
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
                <Text style={styles.partnerDetails}>{partner.napomena}</Text>
                <Text style={styles.partnerDetails}>Provizija: {partner.provizija} </Text>
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
});

export default PartnersPage;
