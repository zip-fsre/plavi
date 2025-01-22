import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Pozadina from '../ui/Pozadina';
import HoverButton from '../ui/Button';
import { useReportContext } from '../../ReportContext';

const ViewReport = ({ navigation }) => {
  const { reportData, description, startDate, endDate, reportTitle, selectedPartner } = useReportContext();

  const [filteredData, setFilteredData] = useState(reportData || []);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculateCommission = (price, commissionRate) => {
    return (price * commissionRate) / 100;
  };

  // Filtriranje podataka prema datumu i partneru
  const handleGenerateReport = () => {
    console.log("Filtriranje izvješća:");
    console.log("Početni datum:", startDate);
    console.log("Završni datum:", endDate);
    console.log("Odabrani partner:", selectedPartner);
  
    const newFilteredData = reportData.filter(item => {
      // Parsiranje datuma u standardni format (yyyy-MM-dd)
      const eventDate = new Date(item.date.split('.').reverse().join('-')); // pretvori "dd.MM.yyyy" u "yyyy-MM-dd"
      const start = startDate ? new Date(startDate.split('.').reverse().join('-')) : null; // Start date
      const end = endDate ? new Date(endDate.split('.').reverse().join('-')) : null; // End date
  
      const dateMatch = start && end ? eventDate >= start && eventDate <= end : true;
      const partnerMatch = selectedPartner ? item.partner === selectedPartner : true;
  
      console.log(`Provjera za event ${item.event}:`, dateMatch, partnerMatch); // Logiranje svake provjere
  
      return dateMatch && partnerMatch;
    });
  
    console.log("Filtrirani podaci:", newFilteredData);
  
    const newTotalPrice = newFilteredData.reduce((total, item) => total + item.price, 0);
    setFilteredData(newFilteredData);
    setTotalPrice(newTotalPrice);
  
    console.log("Ukupna cijena:", newTotalPrice);
  };

  // Automatsko pozivanje funkcije pri učitavanju komponente ili kada se promijene parametri
  useEffect(() => {
    console.log("Ažuriranje parametara za izvješće:");
    console.log("reportData:", reportData);
    console.log("description:", description);
    console.log("startDate:", startDate);
    console.log("endDate:", endDate);
    console.log("selectedPartner:", selectedPartner);
    handleGenerateReport();
  }, [reportData, description, startDate, endDate, selectedPartner]); // Ovisnosti

  if (!reportData || reportData.length === 0) {
    return (
      <Pozadina>
        <View style={styles.container}>
          <Text style={styles.errorText}>Izvješće nije pronađeno.</Text>
          <HoverButton title="Nazad" onPress={() => navigation.goBack()} />
        </View>
      </Pozadina>
    );
  }

  // Pretvori datume u string prije prosljeđivanja
  const start = new Date(startDate).toLocaleDateString('hr-HR');
  const end = new Date(endDate).toLocaleDateString('hr-HR');

  return (
    <Pozadina>
      <View style={styles.container}>
        <Text style={styles.title}>Izvješće: {reportTitle || 'N/A'}</Text>
        <Text style={styles.description}>Opis izvješća: {description || 'N/A'}</Text>

        <ScrollView 
          style={styles.reportList} 
          contentContainerStyle={styles.reportListContent}
        >
          {filteredData.length > 0 ? (
            filteredData.map((event, index) => {
              const commission = calculateCommission(event.price, event.commission);
              return (
                <View key={index} style={styles.reportItem}>
                  <Text style={styles.reportText}>Naziv aranžmana: {event.event}</Text>
                  <Text style={styles.reportText}>Opis: {event.description}</Text>
                  <Text style={styles.reportText}>Provizija: {event.commission}%</Text>
                  <Text style={styles.reportText}>Datum održavanja: {event.date}</Text>
                  <Text style={styles.reportText}>Provizija u količini: {commission} KM</Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.errorText}>Nema aranžmana za odabrani datum i partnera.</Text>
          )}
        </ScrollView>

        <Text style={styles.totalPrice}>Ukupna cijena: {totalPrice || 0} KM</Text>
        <Text style={styles.totalPrice}>
          Ukupna provizija: {filteredData.reduce((total, event) => total + calculateCommission(event.price, event.commission), 0)} KM
        </Text>

        <HoverButton
          title="Uredi izvješće"
          onPress={() =>
            navigation.navigate('EditReport', { 
              reportData: filteredData,  
              description,  
              startDate: start, // Koristite već definirane stringove
              endDate: end,
              reportTitle,
              selectedPartner 
            })
          }
        />
      </View>
    </Pozadina>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: '#e8c789',
    fontFamily: 'Monotype Corsiva',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: '#e8c789',
    fontFamily: 'Monotype Corsiva',
    marginBottom: 20,
  },
  reportList: {
    width: '100%',
    maxHeight: 300, // Ograničena visina za skrolanje
    marginBottom: 10,
  },
  reportListContent: {
    paddingBottom: 20, // Prostor za dodatni razmak na dnu
    alignItems: 'center',
  },
  reportItem: {
    backgroundColor: '#f5f5dc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    width:'60%',
  },
  reportText: {
    fontSize: 16,
    color: '#333',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#e8c789',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
});

export default ViewReport;
