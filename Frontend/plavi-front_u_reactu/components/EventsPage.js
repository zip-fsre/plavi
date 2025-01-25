import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Pozadina from './ui/Pozadina';
import Event from './ui/Event'
import { ScrollView } from 'react-native';

const EventsPage = () => {

  const handleAddEvent = () => {
    console.log("Dodaj događaj!");
  }
  const handleEditEvent = () => {
    console.log("Uredi događaj!");
  }

  return (
    <Pozadina>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Događaji</Text> 
          </View>
          <ScrollView style={styles.partneri}>
            <Event onPress={handleEditEvent} naziv='Prvi događaj' vrsta='Vjenčanje' opis='Ivan Matić - 063 223 321'/>
            <Event onPress={handleEditEvent} naziv='Drugi događaj' vrsta='Vjenčanje' opis='Ana Marić - 063 654 455'/>
            <Event onPress={handleEditEvent} naziv='Treci događaj' vrsta='Vjenčanje' opis='Ivan Galić - 063 232 321'/>
            <Event onPress={handleEditEvent} naziv='Cetvrti događaj' vrsta='Matura' opis='Antonija Matić - 063 235 544'/>
            <Event onPress={handleEditEvent} naziv='Peti događaj' vrsta='Vjenčanje' opis='Krešo Matić - 063 123 344'/>
            <Event onPress={handleEditEvent} naziv='Sesti događaj' vrsta='Krizma' opis='Mate Matić - 063 444 321'/>
          </ScrollView>
        </View>
    </Pozadina>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',  
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 190,
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Alex Brush',
    fontSize: 120,
    marginBottom: 10,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  description: {
    color: '#e8c789',
    fontSize: 18,
    fontFamily: 'Monotype Corsiva',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  menu: {
    position: 'absolute',
    flex: 1,
    bottom: 15,
    left: '5%',
    width: '95%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  partneri: {
    maxHeight: '55%',
  },
});

export default EventsPage;


/*
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Pozadina from './ui/Pozadina';
import SmallButton from './ui/SmallButton'; 
import HoverButton from './ui/Button';
import Partner from './ui/Partner'

const PartnersPage = () => {
  const handleAddPartner = () => {
    console.log("Dodaj partnera!");
  }
  const handleEditPartner = () => {
    console.log("Uredi partnera!");
  }

  return (
    <Pozadina>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Partneri</Text> 
            <SmallButton title="Novi" onPress={handleAddPartner}/>
          </View>
          <ScrollView style={styles.partneri}>
            <Partner onPress={handleEditPartner} naziv='Prvi partner' vrsta='Maneken' opis='Nisam ja za ovoga...'/>
            <Partner onPress={handleEditPartner} naziv='Drugi partner' vrsta='Sviralo' opis='Svira svirku, brine brigu...'/>
            <Partner onPress={handleEditPartner} naziv='Treci partner' vrsta='Plesac' opis='Rekose da udarim po Trusi, nisu znali da mi se tako zove sestra...'/>
            <Partner onPress={handleEditPartner} naziv='Cetvrti partner' vrsta='Fotograf' opis='Slikar sa posebnim potrebama (za aparatom)'/>
            <Partner onPress={handleEditPartner} naziv='Peti partner' vrsta='Restoran' opis='Ja sam vise ovako za pojest, popit...'/>
            <Partner onPress={handleEditPartner} naziv='Sesti partner' vrsta='Ketering' opis='Glupi autocorrect, mislio sam ketamin...'/>
          </ScrollView>
        </View>
    </Pozadina>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
  },
  partneri: {
    maxHeight: 400,
  },
  image: {
    height: 30,
    width: 30,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 190,
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Monotype Corsiva',
    fontSize: 70,
    textAlign: 'left',
    marginBottom: 10,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  description: {
    color: '#e8c789',
    fontSize: 18,
    fontFamily: 'Monotype Corsiva',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
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
});

export default PartnersPage;
*/