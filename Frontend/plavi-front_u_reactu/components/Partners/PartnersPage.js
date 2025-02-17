import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Pozadina from '../ui/Pozadina';
import SmallButton from '../ui/SmallButton';
import { usePage } from '../../Routes';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver'

const BASE_URL = 'http://localhost:5149/api/Partneri'; 

const PartnersPage = () => {
  const { setCurrentPage, pages } = usePage();
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]); 
  const [searchText, setSearchText] = useState('');

  const fetchPartners = async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      setPartners(data);
      setFilteredPartners(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Greška', 'Ne mogu dohvatiti podatke o partnerima.');
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = partners.filter((partner) =>
        partner.naziv.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPartners(filtered);
    } else {
      setFilteredPartners(partners);
    }
  };

  const handleDeletePartner = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });

      if (response.ok) {
        Alert.alert('Uspjeh', 'Partner je uspješno obrisan!');
        fetchPartners();
      } else {
        Alert.alert('Greška', 'Nešto nije u redu. Pokušajte ponovno.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Greška', 'Dogodila se greška pri brisanju partnera.');
    }
  };

  const handleAddPartner = () => {
    setCurrentPage(pages['PartnersPickScreen']);
  };

  const handleEditPartner = (partner) => {
    setCurrentPage({
      ...pages['EditPartner'],
      id: partner.id,
    });
  };

  const handleViewPartner = (partner) => {
    setCurrentPage({
      ...pages['ViewPartner'],
      id: partner.id,
    });
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleExportToExcel = async () => {
    try {
      const wb = XLSX.utils.book_new();
      
      const partnerResponse = await fetch(BASE_URL);
      const partners = await partnerResponse.json();
  
      const partnerSheet = XLSX.utils.json_to_sheet(partners);
      XLSX.utils.book_append_sheet(wb, partnerSheet, 'Partneri');

      const existingSheetNames = new Set(['Partneri']);

      for (const partner of partners) {
        const { id, naziv } = partner;
        const sanitizedSheetName = `Aranzmani_${naziv}`.substring(0, 31);
        let uniqueSheetName = sanitizedSheetName;
        let counter = 1;

        while (existingSheetNames.has(uniqueSheetName)) {
          uniqueSheetName = `${sanitizedSheetName}_${counter++}`;
        }

        existingSheetNames.add(uniqueSheetName);

        const aranzmaniResponse = await fetch(`${BASE_URL}/Aranzmani/${id}`);
        const aranzmani = aranzmaniResponse.ok ? await aranzmaniResponse.json() : [];

        const sheetData = aranzmani.length ? aranzmani : [{ Poruka: 'Nema aranžmana' }];
        const aranzmaniSheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(wb, aranzmaniSheet, uniqueSheetName);
      }
  

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

      Alert.alert('Uspjeh', 'Excel datoteka je generirana. Za preuzimanje koristite odgovarajuću biblioteku za pohranu datoteka u React Native.');
    } catch (error) {
      console.error('Greška pri izvozu u Excel:', error);
      Alert.alert('Greška', 'Dogodila se greška prilikom izvoza u Excel.');
    }
  };

  return (
    <Pozadina>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Partneri</Text>
          <SmallButton title="Novi" onPress={handleAddPartner} style={styles.newButton} />
          <SmallButton title="Izvezi u Excel" style={styles.saveButton} onPress={handleExportToExcel} />
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Traži partnera po imenu..."
          value={searchText}
          onChangeText={handleSearch}
        />

        <ScrollView style={styles.partneri}>
          {filteredPartners.map((partner) => (
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
    maxHeight: 600,
  },
  partneri: {
    maxHeight: 500,
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