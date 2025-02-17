import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import { usePage } from '../../Routes';
import Pozadina from "../ui/Pozadina";
import Guest from "../ui/Guest";
import Partner from "../ui/DogadjajPartner";
import Icon from 'react-native-vector-icons/MaterialIcons';

const EventDetailsPage = () => {
  const { currentPage } = usePage();
  const { id } = currentPage;  // Dobijanje id-a iz currentPage
  const [events, setEvents] = useState({});
  const [gosti, setGosti] = useState([]);
  const [partneri, setPartneri] = useState([]);

  // Provjera da li je id dostupan
  useEffect(() => {
    if (id) {
      getEventDetails();
      getGuests();
      getPartners();
    } else {
      console.error("ID nije postavljen!");
    }
  }, [id]); // Koristi id kao dependency, da se useEffect pokreće kada id bude dostupan

  // Fetch event details
  const getEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5149/api/Dogadjaj/${id}`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  // Fetch guests
  const getGuests = async () => {
    if (!id) return;  // Osiguraj da id postoji prije nego što pozoveš API
    try {
      const response = await fetch(`http://localhost:5149/api/Dogadjaj/Gosti/${id}`);
      const data = await response.json();
      setGosti(data);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  };

  // Fetch partners
  const getPartners = async () => {
    if (!id) return;  // Osiguraj da id postoji prije nego što pozoveš API
    try {
      const response = await fetch(`http://localhost:5149/api/Dogadjaj/Partners/${id}`);
      const data = await response.json();
      setPartneri(data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  // Render guests
  const renderGuests = ({ item, index }) => (
    <View style={styles.guestStyle}>
      <Guest
        idGosta={item.id}
        statusDolaska={item.statusDolaska}
        brojStola={item.brojStola}
        imePrezime={item.imeIPrezime}
        redniBroj={index + 1}
      />
    </View>
  );

  // Render partners
  const renderPartners = ({ item, index }) => (
    <View style={styles.partnerStyle}>
      <Partner
        NaziviPartnera={item.NaziviPartnera}
        KonacnaCijena={item.KonacnaCijena}
        Provizija={item.Provizija}
        StatusPartnera={item.StatusPartnera}
        redniBroj={index + 1}
      />
    </View>
  );

  return (
    <Pozadina>
      <View style={styles.container}>
        <Text style={styles.title}>Detalji događaja</Text>
        <Text style={styles.headerText}>Id: {id}</Text>

        {events ? (
          <ScrollView style={styles.scrollView}>
            <Text style={styles.categoryText}>Naziv: {events.naziv}</Text>
            <Text style={styles.categoryText}>Vrsta: {events.svrha}</Text>
            <Text style={styles.categoryText}>Klijent: {events.klijent}</Text>
            <Text style={styles.categoryText}>Kontakt klijenta: {events.kontaktKlijenta}</Text>
            <Text style={styles.categoryText}>Kontakt glavnog sponzora: {events.kontaktSponzora}</Text>
            <Text style={styles.categoryText}>Napomena: {events.napomena}</Text>
            <Text style={styles.categoryText}>Datum: {new Date(events.datum).toLocaleDateString()}</Text>

            {/* Display guests */}
            <View style={styles.itemContainer}>
              <Text style={styles.categoryText}>Lista gostiju:</Text>
              {gosti.length > 0 ? (
                <FlatList data={gosti} renderItem={renderGuests} keyExtractor={(item) => item.id.toString()} />
              ) : (
                <Text style={styles.categoryText}>Nema gostiju</Text>
              )}
            </View>

            {/* Display partners */}
            <View style={styles.itemContainer}>
              <Text style={styles.categoryText}>Lista partnera:</Text>
              {partneri.length > 0 ? (
                <FlatList data={partneri} renderItem={renderPartners} keyExtractor={(item) => item.id.toString()} />
              ) : (
                <Text style={styles.categoryText}>Nema partnera</Text>
              )}
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.text}>Učitavam podatke...</Text>
        )}
      </View>
    </Pozadina>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    color: '#e8c789',
  },
  categoryText: {
    fontSize: 16,
    marginBottom: 10,
  },
  itemContainer: {
    marginTop: 20,
  },
  guestStyle: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  partnerStyle: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  text: {
    fontSize: 16,
    color: 'gray',
  },
  scrollView: {
    marginBottom: 20,
  },
});

export default EventDetailsPage;
