import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Pozadina from './ui/Pozadina';
import Event from './ui/Event'
import { ScrollView } from 'react-native';
import  Button  from "./ui/Button";
import { usePage } from '../Routes';
import Layout from './Layout';


const EventsPage = () => {
  const {currentPage, setCurrentPage, pages} = usePage();
  const [events, setEvents] = useState([]);

  const handleAddEvent = () => {
    console.log("Dodaj događaj!");
  }
  const handleEditEvent = () => {
    console.log("Uredi događaj!");

  }


  //funkcija koja kupi evente iz backenda
  const getEvents = async () => {
    try {
      const response = await fetch('http://localhost:5149/api/Dogadjaj/');
      const data = await response.json();
      setEvents(data);
      return data;
    }
    catch (error) {
      console.error(error);
    }
  }


  //dohvat podataka po učitavanju stranice
  useEffect(() => {
    async function fetchEvents() {
      const data = await getEvents(); // Dohvat podataka kada se getEvents odradi
      setEvents(data); 
      console.log(data);
    }
    fetchEvents(); 
  }, []); // Hint: prazan [] pokreće samo jednom funkciju (pri učitavanju stranice)
  

  //kartica dogadjaja (prikaz)
const renderEvent = ({item}) => {

  return (
    <View style={styles.container}>
      <Event onPress={() => setCurrentPage(pages['EditEventPage'])} naziv={item.naziv} vrsta={item.svrha} opis={item.napomena} datum={item.datum}/> {/* komponenta Event je dizajn prikaza kartice */}
    </View>
  );

};

  return (
    <Pozadina>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Događaji</Text> 
          </View>
          <ScrollView style={styles.partneri}>
            <FlatList data={events} renderItem={renderEvent} />
            <Event onPress={handleEditEvent} naziv='Prvi događaj' vrsta='Vjenčanje' opis='Ivan Matić - 063 223 321'/>
            {/*<Event onPress={handleEditEvent} naziv='Prvi događaj' vrsta='Vjenčanje' opis='Ivan Matić - 063 223 321'/>
            <Event onPress={handleEditEvent} naziv='Drugi događaj' vrsta='Vjenčanje' opis='Ana Marić - 063 654 455'/>*/}
          
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
    fontSize: 70,
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

*/
/*
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