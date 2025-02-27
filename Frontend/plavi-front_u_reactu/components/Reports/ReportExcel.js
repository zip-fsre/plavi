import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../ui/datepicker.css'; 
import Pozadina from '../ui/Pozadina';
import HoverButton from '../ui/Button';
import { usePage } from '../../Routes';
import { Picker } from '@react-native-picker/picker';
import * as XLSX from 'xlsx';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

const ReportExcel = () => {
  const { setCurrentPage, pages } = usePage();

  const [reportTitle, setReportTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [partners, setPartners] = useState([]);
  const [medjutablicaPt1, setMedjutablicaPt1] = useState([]);
  const [events, setEvents] = useState([]);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
        copyToCacheDirectory: true,
      });
  
      if (result.canceled) {
        console.log('Odabir datoteke otkazan');
        return;
      }
  
      const file = result.assets[0];
  
      if (!file) {
        console.error('Greška: Nema odabrane datoteke.');
        return;
      }
  
      const response = await fetch(file.uri);
      const blob = await response.blob();
  
      const reader = new FileReader();
      reader.onload = async (e) => {
        const binaryString = e.target.result;
        const workbook = XLSX.read(binaryString, { type: 'binary' });
  
        const sheetNames = workbook.SheetNames;
        console.log('Nazivi listova u Excelu:', sheetNames);
  
        const mainSheetName = sheetNames[0]; 
        const mainSheet = workbook.Sheets[mainSheetName];
        const jsonData = XLSX.utils.sheet_to_json(mainSheet);
        console.log('Podaci iz glavnog lista:', jsonData);
  
        const partnerSheetName = sheetNames.find(name => name.toLowerCase().includes('partner'));
        if (partnerSheetName) {
          const partnerSheet = workbook.Sheets[partnerSheetName];
          const partnerData = XLSX.utils.sheet_to_json(partnerSheet);
          console.log('Podaci o partnerima iz lista:', partnerData);
  
          partnerData.forEach((item, index) => {
            console.log(`Ključevi objekta ${index} iz lista partnera:`, Object.keys(item));
          });
  
          if (partnerData.length > 0) {
            setSelectedPartner(partnerData[0]['ID Partnera']); 
            console.log('Odabrani partner ID:', partnerData[0]['ID Partnera']);
          } else {
            console.error('Greška: Nema partnera u listi.');
          }
        } else {
          console.error('Greška: List s podacima o partnerima nije pronađen.');
          return;
        }
  
        if (jsonData.length > 0 && jsonData[0]) {
          console.log("JSON Podaci:", jsonData[0]); 
          console.log('Ključevi prvog objekta iz JSON-a:', Object.keys(jsonData[0])); 
  
          setReportTitle(jsonData[0]['Naziv izvješća'] || '');
          setDescription(jsonData[0]['Opis izvješća'] || '');
  
          const parseDate = (dateString) => {
            if (!dateString) {
              console.log("Datum nije definiran:", dateString); 
              return null; 
            }
  
            const cleanedDateString = dateString.trim();
            const date = new Date(cleanedDateString);
            return isNaN(date.getTime()) ? null : date;  
          };
  
          const formatDate = (date) => {
            if (!date) return '';
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear(); 
            return `${day}.${month}.${year}`; 
          };
  
          const startDate = jsonData[0].DatumOd;
          const endDate = jsonData[0].DatumDo;
  
          console.log("DatumOd:", startDate);
          console.log("DatumDo:", endDate);
  
          const formattedStartDate = parseDate(startDate);  
          const formattedEndDate = parseDate(endDate);  
  
          console.log("Start Date (DatumOd):", formattedStartDate ? formatDate(formattedStartDate) : 'Nema datuma');
          console.log("End Date (DatumDo):", formattedEndDate ? formatDate(formattedEndDate) : 'Nema datuma');
  
          setStartDate(formattedStartDate || new Date());  
          setEndDate(formattedEndDate || new Date());
        }
      };
  
      reader.readAsBinaryString(blob);
    } catch (error) {
      console.error('Greška pri učitavanju datoteke:', error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const partnerResponse = await fetch('http://localhost:5149/api/Partneri');
        const partnerData = await partnerResponse.json();
        setPartners(partnerData);

        const medjutablicaResponse = await fetch('http://localhost:5149/api/MedjutablicaPt1');
        const medjutablicaData = await medjutablicaResponse.json();
        setMedjutablicaPt1(medjutablicaData);

        const eventsResponse = await fetch('http://localhost:5149/api/Dogadjaj');
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleGenerateReport = async () => {
    if (!reportTitle || !description) {
      console.warn("Molimo unesite naziv i opis izvješća.");
      return;
    }

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      alert("Početni datum mora biti manji od završnog datuma.");
      return;
    }
  
    console.log("Početak generiranja izvješća...");
    console.log("Početni datum:", startDate);
    console.log("Završni datum:", endDate);
    console.log("Odabrani partner ID:", selectedPartner);
  
    try {

      let filteredPartnerData = [];
      const startDateTime = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const endDateTime = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    console.log('datumi:' ,startDateTime, endDateTime);

  
      // 1. Ako je partner odabran, filtriraj prema partneru
      if (selectedPartner) {
        const filteredPartnerDataResponse = await fetch(`http://localhost:5149/api/MedjutablicaPt1/Partner/${selectedPartner}`);
        filteredPartnerData = await filteredPartnerDataResponse.json();
        console.log("Filtered MedjutablicaPt1 by Partner:", filteredPartnerData);
      } else {
        // Ako partner nije odabran, uzmi sve podatke
        filteredPartnerData = medjutablicaPt1;
      }
  
      // 2. Filtriraj događaje prema datumu ako su datumi uneseni
      const filteredEvents = startDate && endDate
       ? events.filter(event => {
      const eventDate = new Date(event.datum);
      const reportStartDate = new Date(startDate);
      const reportEndDate = new Date(endDate);

      // Normalize both dates to ignore the time part by setting the time to midnight
      reportStartDate.setHours(0, 0, 0, 0);
      reportEndDate.setHours(23, 59, 59, 999);

      // Strip the time from eventDate to compare only the date part
      eventDate.setHours(0, 0, 0, 0);
      console.log('Filtering event:', event, 'Start:', reportStartDate, 'End:', reportEndDate, 'Event Date:', eventDate);
      return eventDate >= reportStartDate && eventDate <= reportEndDate;
    })
  : events;
  
      console.log("Filtered Events:", filteredEvents);
  
      // 3. Filtriraj MedjutablicaPt1 prema filtriranim događajima
      const filteredMedjutablicaPt1 = filteredPartnerData.filter(item => {
        const matchingEvent = filteredEvents.find(event => event.id === item.idDogadjaja);
        return matchingEvent;
      });
  
      console.log("Filtered MedjutablicaPt1 with Events:", filteredMedjutablicaPt1);
  
      // 4. Kreiranje izvještaja
      const reportData = {
        naziv: reportTitle,
        opis: description,
        pocetak: startDate ? new Date(startDateTime).toISOString() : null,
        kraj: endDate ? new Date(endDateTime).toISOString() : null,
        odabraniPartner: selectedPartner || null,
      };
  
      console.log("Slanje izvješća na backend:", reportData);
      const reportResponse = await fetch('http://localhost:5149/api/Izvjesce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
  
      if (!reportResponse.ok) {
        console.error("Greška pri stvaranju izvješća! Status:", reportResponse.status);
        alert("Došlo je do pogreške pri stvaranju izvještaja.");
        return;
      }
  
      const createdReport = await reportResponse.json();
      console.log("Izvješće uspješno kreirano:", createdReport);
  
      // 5. Kreiranje veza u MedjutablicaPt2
      console.log("Spremanje veza između izvješća i medjutablica...");
      for (const item of filteredMedjutablicaPt1) {
        const newMedjutablicaPt2 = {
          idIzvjesca: createdReport.id, // ID izvješća
          idMedju1: item.id, // ID medjutablicePt1
        };
  
        console.log("Slanje u MedjutablicaPt2:", newMedjutablicaPt2);
  
        try {
          const response = await fetch('http://localhost:5149/api/MedjutablicaPt2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMedjutablicaPt2)
          });
  
          if (!response.ok) {
            console.error(`Greška pri dodavanju u MedjutablicaPt2! Status: ${response.status}`);
            return;
          }
  
          const responseData = await response.json();
          console.log('Uspješno dodano u MedjutablicaPt2:', responseData);
        } catch (error) {
          console.error(`Pogreška kod dodavanja u MedjutablicaPt2:, error`);
        }
      }
  
      // 6. Navigacija na ViewReport s ID-em izvješća
      console.log(`Navigacija na ViewReport (ID: ${createdReport.id})`);
      setCurrentPage({ ...pages['ViewReport'], reportId: createdReport.id });
  
    } catch (error) {
      console.error("Neočekivana greška:", error);
      alert("Dogodila se greška pri stvaranju izvješća.");
    }
  };

  return (
    <Pozadina>
      <View style={styles.container}>
        <Text style={styles.title}>Kreiraj izvješće</Text>

        
        {/* Input za naziv izvješća */}
        <TextInput
          style={styles.input}
          placeholder="Naziv izvješća"
          value={reportTitle}
          onChangeText={setReportTitle}
        />

        {/* Input za opis izvješća */}
        <TextInput
          style={styles.input}
          placeholder="Opis izvješća"
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.datesContainer}>
          {/* Input za datum od */}
          <View style={styles.dateInputContainer}>
            <Text style={styles.label}>Datum od:</Text>
            <DatePicker
              selected={startDate}
             onChange={(date) => setStartDate(date)}
              dateFormat="dd.MM.yyyy"
              placeholderText="Odaberite datum"
              className="custom-input"
              calendarClassName="custom-calendar"
              zIndex="2"
            />
          </View>

          {/* Input za datum do */}
          <View style={styles.dateInputContainer}>
            <Text style={styles.label}>Datum do:</Text>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd.MM.yyyy"
              placeholderText="Odaberite datum"
              className="custom-input"
              calendarClassName="custom-calendar"
              zIndex="2"
              
            />
          </View>
        </View>

        {/* Picker za odabir partnera */}
        <Picker
        selectedValue={selectedPartner}
        onValueChange={(value) => setSelectedPartner(value || null)}  // Ako nije odabrano, postavi na null
        style={styles.picker}
        >
        <Picker.Item label="Odaberite partnera" value={null} />
        {partners.map((partner) => (
        <Picker.Item key={partner.id} label={partner.naziv} value={partner.id} />
         ))}
        </Picker>


        <HoverButton title="Učitaj Excel" onPress={handleFileUpload} />
        <HoverButton title="Generiraj izvješće" onPress={handleGenerateReport} />
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
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e8c789',
  },
  input: {
    width: '60%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: '#95997e',
    fontSize: 18,
    opacity: 0.6,
    color: '#222c2b',
  },
  datesContainer: {
    flexDirection: 'row', // Postavlja djecu u red
    justifyContent: 'space-between', // Raspoređuje prostor između djece
    width: '60%', // Širina roditeljskog elementa
    marginBottom: 15,
    zIndex:2,
  },
  dateInputContainer: {
    flex: 1, 
    marginHorizontal: 5, 
    alignItems: 'center', 
    justifyContent: 'center',
    width: '50%',
  },
  picker: {
    backgroundColor: '#95997e',
    opacity: 0.6,
    color: '#222c2b',
    width: '60%',
    height:40,
    marginBottom: 15,
  },
});

export default ReportExcel;
