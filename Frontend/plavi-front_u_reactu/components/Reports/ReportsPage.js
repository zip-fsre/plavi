import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Pozadina from '../ui/Pozadina';
import SmallButton from '../ui/SmallButton';
import '../ui/scrollbar.css';
import { usePage } from '../../Routes';
import Report from '../ui/Report';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Icon from 'react-native-vector-icons/Ionicons';

const BASE_URL = 'http://localhost:5149/api/Izvjesce';

const ReportsPage = () => {
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

  const handleDeleteReport = (deletedId) => {
    setReports((prevReports) => prevReports.filter(report => report.id !== deletedId));
    setFilteredReports((prevReports) => prevReports.filter((report) => report.id !== deletedId));
  };

  const handleExportReportsToExcel = async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) throw new Error('Neuspješan GET zahtjev');

      const reportsData = await response.json();
      if (reportsData.length === 0) {
        Alert.alert("Info", "Nema izvješća za izvoz.");
        return;
      }

      const wb = XLSX.utils.book_new();
      const sheet = XLSX.utils.json_to_sheet(reportsData);
      XLSX.utils.book_append_sheet(wb, sheet, "Izvješća");
      
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "Izvjesca.xlsx");

      Alert.alert("Uspjeh", "Excel datoteka je uspješno generirana.");
    } catch (error) {
      console.error("Greška pri izvozu izvješća:", error);
      Alert.alert("Greška", "Dogodila se greška prilikom izvoza u Excel.");
    }
  };

  return (
    <Pozadina>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Izvješća</Text>
          <SmallButton
          style={styles.exportButton}
          title="Izvezi u Excel"
          onPress={handleExportReportsToExcel}
        />
          <SmallButton
            style={styles.createButtonContainer}
            title="Kreiraj izvješće"
            onPress={() => setCurrentPage(pages['ReportsPickScreen'])}
          />
        </View>

         {/* TextInput za pretragu */}
         <TextInput
          style={styles.searchInput}
          placeholder="Pretraži izvješća..."
          value={searchQuery}
          onChangeText={handleSearch}
        />

        <Text style={styles.reportsTitle}>Nedavna izvješća:</Text>
        <ScrollView
          style={styles.reportsList}
          keyboardShouldPersistTaps="handled"
        >
           {/* Renderiraj izvješća */}
           {(searchQuery ? filteredReports : reports).map((report) => (
            <Report 
              key ={report.id}
              id={report.id} 
              naziv={report.naziv} 
              opis={report.opis} 
              onDelete={handleDeleteReport} 
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
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 44
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

export default ReportsPage;
