import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Pozadina from '../ui/Pozadina';
import HoverButton from '../ui/Button';
import { usePage } from '../../Routes';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ViewReport = () => {
  const { currentPage, setCurrentPage, pages } = usePage();
  const { reportId } = currentPage;
  console.log('Report ID:', reportId);

  const [reportData, setReportData] = useState(null);
  const [arrangements, setArrangements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);

  useEffect(() => {
    if (!reportId) return;

    const fetchReport = async () => {
      try {
        console.log('Fetching report for reportId:', reportId);
        const response = await fetch(`http://localhost:5149/api/Izvjesce/${reportId}`);
        if (!response.ok) throw new Error('Greška prilikom dohvaćanja izvješća.');
        const data = await response.json();
        console.log('Fetched report data:', data);
        setReportData(data);
        fetchMedjutablicaPt2(data.id);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching report:', err);
        setLoading(false);
      }
    };

    const fetchMedjutablicaPt2 = async (reportId) => {
      try {
        
        const response = await fetch(`http://localhost:5149/api/Izvjesce/Podatci/${reportId}`);
        if (!response.ok) throw new Error('Greška prilikom dohvaćanja MedjutablicaPt2.');
        const medjutablicaPt2Records = await response.json();
        console.log('Fetched MedjutablicaPt2 records:', medjutablicaPt2Records);
    
        fetchMedjutablicaPt1(medjutablicaPt2Records);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching MedjutablicaPt2:', err);
      }
    };

    
    const fetchMedjutablicaPt1 = async (medjutablicaPt2Records) => {
      try {
        const medjutablicaPt2Ids = medjutablicaPt2Records.map(record => record.idMedju1);
        console.log('MedjutablicaPt2 Ids:', medjutablicaPt2Ids);
    
        const response = await fetch('http://localhost:5149/api/MedjutablicaPt1');
        if (!response.ok) throw new Error('Greška prilikom dohvaćanja MedjutablicaPt1.');
        const medjutablicaPt1Records = await response.json();
        console.log('Fetched all MedjutablicaPt1 records:', medjutablicaPt1Records);
    
        const filteredMedjutablicaPt1Records = medjutablicaPt1Records.filter(record =>
          medjutablicaPt2Ids.includes(record.id)
        );
        console.log('Filtered MedjutablicaPt1 records:', filteredMedjutablicaPt1Records);
        if (filteredMedjutablicaPt1Records.length === 0) {
          setError("Nema dostupnih aranžmana za ovo izvješće.");
          setLoading(false);
        }
    
        if (filteredMedjutablicaPt1Records.length > 0) {
          fetchEvents(filteredMedjutablicaPt1Records);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching MedjutablicaPt1:', err);
      }
    };

    const fetchEvents = async (filteredMedjutablicaPt1Records) => {
      try {
        const response = await fetch('http://localhost:5149/api/Dogadjaj');
        if (!response.ok) throw new Error('Greška prilikom dohvaćanja događaja.');
        const allEvents = await response.json();
    
        console.log('Fetched all events:', allEvents);
    
        const enrichedMedjutablicaPt1 = filteredMedjutablicaPt1Records.map(record => {
          const event = allEvents.find(evt => evt.id === record.idDogadjaja);
          return {
            ...record,
            datum: event ? event.datum : null // Dodaj datum događaja
          };
        });
    
        console.log('Enriched MedjutablicaPt1 records:', enrichedMedjutablicaPt1);
    
        fetchArrangements(enrichedMedjutablicaPt1);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching events:', err);
      }
    };
    

    
    const fetchArrangements = async (enrichedMedjutablicaPt1) => {
      try {
        const response = await fetch('http://localhost:5149/api/Aranzman');
        if (!response.ok) throw new Error('Greška prilikom dohvaćanja aranžmana.');
        const allArrangements = await response.json();
    
        // Mapiraj podatke tako da sačuvaš konacnaCijena iz MedjutablicaPt1
        const finalArrangements = enrichedMedjutablicaPt1.map(record => {
          const aranzman = allArrangements.find(arr => arr.id === record.idAranzmana);
          return {
            id: record.idAranzmana,
            naziv: aranzman ? aranzman.naziv : "Nepoznato",
            konacnaCijena: record.konacnaCijena,
            dodatakNaProviziju: record? record.dodatakNaProviziju : 0,
            datum: record? record.datum : null
          };
        });
    
        console.log('Final arrangements:', finalArrangements);
    
        setArrangements(finalArrangements);
        setTotalPrice(finalArrangements.reduce((sum, arr) => sum + arr.konacnaCijena, 0));
        setTotalCommission(finalArrangements.reduce((sum, arr) => sum + (arr.konacnaCijena * arr.dodatakNaProviziju) / 100, 0));
      
        if (finalArrangements.length === 0) {
          setError("Nema dostupnih aranžmana za ovo izvješće.");
        }

      } catch (err) {
        setError(err.message);
        console.error('Error fetching arrangements:', err);
      } finally {
        setLoading(false);
      }
    };
    

    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <Pozadina>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Učitavanje izvješća...</Text>
        </View>
      </Pozadina>
    );
  }

 
  const handleExportToExcel = () => {
    if (!reportData || arrangements.length === 0) {
      Alert.alert("Info", "Nema podataka za izvoz.");
      return;
    }
  
    const wb = XLSX.utils.book_new();
  
    const reportInfo = [
      {
        'Naziv izvješća': reportData.naziv || 'N/A',
        'Opis izvješća': reportData.opis || 'N/A',
      }
    ];
  
    const wsReportInfo = XLSX.utils.json_to_sheet(reportInfo);
    XLSX.utils.book_append_sheet(wb, wsReportInfo, "Izvješće");
  
    const sheetData = arrangements.map(arr => ({
      "Naziv aranžmana": arr.naziv,
      "Cijena (KM)": arr.konacnaCijena,
      "Provizija (%)": arr.dodatakNaProviziju,
      "Datum održavanja": arr.datum ? new Date(arr.datum).toLocaleDateString() : 'N/A'
    }));
  
    const wsArrangements = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, wsArrangements, "Aranžmani");
  
    const summaryData = [
      {
        "Ukupna cijena": totalPrice,
        "Ukupna provizija": totalCommission,
      }
    ];
  
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Rezime");
  
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
    saveAs(blob, `Izvjesce_${reportId}.xlsx`);
  };
  
  if (error) {
    return (
      <Pozadina>
        <View style={styles.container}>
          <Text style={styles.errorText}>{error}</Text>
          <HoverButton title="Nazad"  onPress={() => setCurrentPage({ ...pages['Reports']})}/>
        </View>
      </Pozadina>
    );
  }

  return (
    <Pozadina>
      <View style={styles.container}>
        <Text style={styles.title}>Izvješće: {reportData.naziv || 'N/A'}</Text>
        <Text style={styles.description}>Opis izvješća: {reportData.opis || 'N/A'}</Text>

        <ScrollView style={styles.reportList} contentContainerStyle={styles.reportListContent}>
          {arrangements.map((arr, index) => (
            <View key={index} style={styles.reportItem}>
              <Text style={styles.reportText}>Naziv aranžmana: {arr.naziv}</Text>
              <Text style={styles.reportText}>Cijena: {arr.konacnaCijena} KM</Text>
              <Text style={styles.reportText}>Provizija: {arr.dodatakNaProviziju}%</Text>
              <Text style={styles.reportText}>Datum održavanja: {arr.datum ? new Date(arr.datum).toLocaleDateString() : 'N/A'}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.totalPrice}>Ukupna cijena: {totalPrice} KM</Text>
        <Text style={styles.totalPrice}>Ukupna provizija: {totalCommission} KM</Text>
      
      <View style={styles.ostaliSuSamoDugmici}>
        <HoverButton
          title="Uredi izvješće"
          onPress={() => setCurrentPage({ ...pages['EditReport'], reportId })}
        />
        <HoverButton
         title="Izvezi u Excel" 
         onPress={handleExportToExcel} 
         />
      </View>
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
    marginBottom: 20,
  },
  reportList: {
    width: '100%',
    maxHeight: 300, 
    marginBottom: 10,
  },
  reportListContent: {
    paddingBottom: 20, 
    alignItems: 'center',
  },
  ostaliSuSamoDugmici: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
    width: '80%',
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
