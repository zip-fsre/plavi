import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Pozadina from '../ui/Pozadina';
import '../ui/scrollbar.css';
import { usePage } from '../../Routes';
import TouchableReport from '../ui/TouchableReport';
import Icon from 'react-native-vector-icons/Ionicons';

const BASE_URL = 'http://localhost:5149/api/Izvjesce';

const ExistingReports = () => {
  const { setCurrentPage, pages } = usePage();
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);

   // Funkcija za dohvat izvješća sa servera
   const fetchReports = useCallback(async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) throw new Error('Neuspješan GET zahtjev');
      const data = await response.json();

      const sortedReports = data.sort((a, b) => b.id - a.id);

      setReports(sortedReports); // Spremi podatke u state
      setFilteredReports(sortedReports);
    } catch (error) {
      console.error(error);
      alert('Ne mogu dohvatiti izvješća. Pokušajte kasnije.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [fetchReports])
  );

  // Funkcija za uklanjanje dijakritika
  const removeDiacritics = (text) => {
    return text
      .normalize("NFD") // Razdvaja slova i dijakritičke znakove
      .replace(/[\u0300-\u036f]/g, ""); // Briše dijakritičke znakove
  };

   // Pretraga izvješća
   const handleSearch = (query) => {
    setSearchQuery(query);
    const trimmedQuery = removeDiacritics(query.trim().toLowerCase());
    const filtered = reports.filter(
      (report) =>
        removeDiacritics(report.naziv.toLowerCase()).includes(trimmedQuery) ||
      removeDiacritics(report.opis.toLowerCase()).includes(trimmedQuery)
    );
    setFilteredReports(filtered);
  };

   // Funkcija koja će se pozvati kada pritisneš izvješće
   const handleReportPress = (id) => {
    console.log('Izvješće ID:', id);
    setCurrentPage({ ...pages['CreateReport'], reportId: id });
  };



  return (
    <Pozadina>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Odaberi izvješće za predložak:</Text>

        </View>
         {/* TextInput za pretragu */}
          <Icon name="search" size={20} color="#222c2b" style={styles.searchIcon} />
          <TextInput
          style={styles.searchInput}
          placeholder="Pretraži izvješća..."
          value={searchQuery}
          onChangeText={handleSearch}
        />

        <ScrollView
          style={styles.reportsList}
          keyboardShouldPersistTaps="handled"
        >
           {/* Renderiraj izvješća */}
           {(searchQuery ? filteredReports : reports).map((report) => (
            <TouchableReport
              key ={report.id}
              id={report.id} 
              naziv={report.naziv} 
              opis={report.opis} 
              onPress={handleReportPress}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    alignSelf: 'center',
    backgroundColor: '#95997e',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 44,
    marginBottom: 15,
    marginTop: 15,
    paddingLeft: 20,
    opacity: 0.6,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput:{
    borderWidth: 1, 
    borderColor: "#e8c789",
    padding: 10, 
    margin: "auto", 
    marginTop: 20, 
    marginBottom: 20,
    width: 400,
    fontSize: 20, 
    borderRadius: 5, 
    color: '#e8c789' , 
    fontFamily: 'Monotype Corsiva', 
  },
});

export default ExistingReports;
