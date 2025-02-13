import React, { useEffect, useState , useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Pozadina from '../ui/Pozadina';
import SmallButton from '../ui/SmallButton';
import { usePage } from '../../Routes';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';


const BASE_URL = 'http://localhost:5149/api/Partneri'; // Zamijeni s točnim URL-om backend-a


export const ViewPartner = () => {
  const { currentPage, setCurrentPage, pages } = usePage();
    const { id } = currentPage;
  const [partnerDetails, setPartnerDetails] = useState({
    naziv: '',
    tip: '',
    napomena: '',
    provizija: '',
    aranzmani: [],
  });


  // Funkcija za dohvaćanje detalja o partneru i njegovim aranžmanima
  const fetchPartnerDetails = async (id) => {
    try {
      // Dohvaćanje osnovnih podataka partnera
      const partnerResponse = await fetch(`${BASE_URL}/${id}`);
      const partner = await partnerResponse.json();

      // Dohvaćanje aranžmana partnera
      const aranzmaniResponse = await fetch(`${BASE_URL}/Aranzmani/${id}`);
      const aranzmani = await aranzmaniResponse.json();

      // Postavljanje podataka u state
      setPartnerDetails({
        ...partner,
        aranzmani,
      });

    } catch (error) {
      console.error(error);
      Alert.alert('Greška', 'Dogodila se greška pri dohvaćanju podataka o partneru.');
    }
  };

  // Dohvaćanje detalja o partneru pri učitavanju komponente
  useEffect(() => {
    if (id) {
      fetchPartnerDetails(id);
    }
  }, [id]);

  const handleExportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      

      const partnerSheet = XLSX.utils.json_to_sheet([partnerDetails]);
      XLSX.utils.book_append_sheet(wb, partnerSheet, 'Partner');
  
      const arrangementsSheet = XLSX.utils.json_to_sheet(partnerDetails.aranzmani);
      XLSX.utils.book_append_sheet(wb, arrangementsSheet, 'Aranžmani');
  
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Partner.xlsx');
  
      Alert.alert('Uspjeh', 'Excel datoteka je uspješno generirana i preuzeta.');
    } catch (error) {
      console.error(error);
      Alert.alert('Greška', 'Dogodila se greška prilikom izvoza u Excel.');
    }
  };

  const handleExportToPDF = () => {
    const data = partnerDetails;

    if (!data || !data.naziv) {
      alert("Nema podataka za partnera.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(data.naziv, 10, 10);
    doc.setFontSize(12);
    doc.text(`Vrsta: ${data.tip}`, 10, 20);
    doc.text(`Napomena: ${data.napomena}`, 10, 30);
    doc.text(`Provizija: ${data.provizija}%`, 10, 40);

    // odvojimo aranzmane malo od opcenitih podataka
    doc.setFontSize(16);
    doc.text('Aranžmani:', 10, 60);
    doc.setFontSize(12);

    data.aranzmani.forEach((pkg, index) => {
      const yOffset = 70 + (index * 40);
      doc.text(`Aranžman: ${pkg.naziv}`, 10, yOffset);
      doc.text(`Opis: ${pkg.opis}`, 10, yOffset + 10);
      doc.text(`Cijena: ${pkg.cijena} kn`, 10, yOffset + 20);
      doc.line(10, yOffset + 25, 200, yOffset + 25); // linija između aranžmana
    });

    // Spremanje PDF-a
    doc.save(`${data.naziv}_Detalji.pdf`);
  };

  useEffect(() => {
    fetchPartnerDetails(id);
  }, []);

  return (
    <Pozadina>
      <View style={styles.container}>
        <Text style={styles.title}>Detalji partnera</Text>
        <ScrollView style={styles.scrollViews}>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Naziv: </Text>
            {partnerDetails.naziv}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Vrsta: </Text>
            {partnerDetails.tip}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Napomena: </Text>
            {partnerDetails.napomena}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Provizija: </Text>
            {partnerDetails.provizija}%
          </Text>

          <Text style={styles.subtitle}>Aranžmani</Text>
          {partnerDetails.aranzmani.length > 0 ? (
            partnerDetails.aranzmani.map((aranzman, index) => (
              <View key={index} style={styles.aranzmanContainer}>
                <Text style={styles.aranzmanText}>
                  <Text style={styles.aranzmanLabel}>Naziv: </Text>
                  {aranzman.naziv}
                </Text>
                <Text style={styles.aranzmanText}>
                  <Text style={styles.aranzmanLabel}>Opis: </Text>
                  {aranzman.opis}
                </Text>
                <Text style={styles.aranzmanText}>
                  <Text style={styles.aranzmanLabel}>Cijena: </Text>
                  {aranzman.cijena} kn
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Nema dodanih aranžmana.</Text>
          )}
        </ScrollView>

        <SmallButton title="Izvezi u Excel"style={styles.saveButton} onPress={handleExportToExcel}/>
        <SmallButton title="Izvezi u PDF" style={styles.saveButton} onPress={handleExportToPDF} />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setCurrentPage(pages['Partners'])}
        >
          <Text style={styles.closeButtonText}>Zatvori</Text>
        </TouchableOpacity>
      </View>
    </Pozadina>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    maxHeight: 450,
    width: '90%',
  },
  scrollView: {
    maxHeight: 200
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Alex Brush',
    fontSize: 48,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 20,
    fontFamily: 'Monotype Corsiva',
    color: '#e8c789',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Alex Brush',
    color: '#e8c789',
    marginVertical: 20,
    textAlign: 'center',
  },
  aranzmanContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e8c789',
    borderRadius: 5
  },
  aranzmanText: {
    fontSize: 18,
    fontFamily: 'Monotype Corsiva',
    color: '#e8c789',
    marginBottom: 5,
  },
  aranzmanLabel: {
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 18,
    fontFamily: 'Monotype Corsiva',
    color: '#e8c789',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e8c789',
    borderRadius: 5,
    alignSelf: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontFamily: 'Monotype Corsiva',
    color: '#fff',
  },
});

export default ViewPartner;
