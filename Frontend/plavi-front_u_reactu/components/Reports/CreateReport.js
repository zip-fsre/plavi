import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../ui/datepicker.css'; 
import Pozadina from '../ui/Pozadina';
import HoverButton from '../ui/Button';
import { usePage } from '../../Routes';
import { Picker } from '@react-native-picker/picker';

const CreateReport = () => {
  const {currentPage, setCurrentPage, pages } = usePage();
  const { preselectedPartner, preselectedYear, reportId } = currentPage;

  const [reportTitle, setReportTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(-1);
  const [partners, setPartners] = useState([]);
  const [medjutablicaPt1, setMedjutablicaPt1] = useState([]);
  const [events, setEvents] = useState([]);

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


  // Ako je proslijeđen reportId, dohvaćamo podatke izvješća
  useEffect(() => {
    const fetchReportData = async () => {
      if (reportId) {
        try {
          const reportResponse = await fetch(`http://localhost:5149/api/Izvjesce/${reportId}`);
          if (!reportResponse.ok) {
            throw new Error('Greška pri dohvaćanju izvješća');
          }
          const reportData = await reportResponse.json();

          setReportTitle(reportData.naziv);
          setDescription(reportData.opis);
          setSelectedPartner(reportData.odabraniPartner || -1);
          setStartDate(reportData.pocetak ? new Date(reportData.pocetak) : null);
          setEndDate(reportData.kraj ? new Date(reportData.kraj) : null);
        } catch (error) {
          console.error('Greška pri dohvaćanju izvješća:', error);
        }
      }
    };

    fetchReportData();
  }, [reportId]);


    // Postavljanje proslijeđenih vrijednosti na početku
    useEffect(() => {
      if (preselectedYear) {
        const startOfYear = new Date(preselectedYear, 0, 1);

         // Provjera je li odabrana trenutna godina
        const currentYear = new Date().getFullYear();
        let endOfYear;
        if (preselectedYear == currentYear) {
          // Ako je odabrana trenutna godina, postavljamo kraj na danasnji datum
          endOfYear = new Date(); // današnji datum
        } else {
          // Inače, postavljamo kraj na 31.12.
          endOfYear = new Date(preselectedYear, 11, 31);
        }
        setStartDate(startOfYear);
        setEndDate(endOfYear);
        console.log('preselectedYear:', preselectedYear);
        console.log('End date:', endOfYear);
      }
  
      if (preselectedPartner) {
        setSelectedPartner(preselectedPartner);
        console.log('preselectedPartner:', preselectedPartner);
      }
    }, [preselectedYear, preselectedPartner]);

  const handleGenerateReport = async () => {
    if (!reportTitle || !description) {
      alert("Molimo unesite naziv i opis izvješća.");
      return;
    }
    if ((startDate && !endDate) || (!startDate && endDate)) {
      alert("Morate odabrati oba datuma ili nijedan.");
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

      const startDateTime = startDate ? new Date(startDate) : null;
      if (startDateTime) startDateTime.setHours(23, 59, 59, 999);

      const endDateTime = endDate ? new Date(endDate) : null;
      if (endDateTime) endDateTime.setHours(23, 59, 59, 999);

      console.log('datumi:' ,startDateTime, endDateTime);

      // 1. Ako je partner odabran, filtriraj prema partneru
      if (selectedPartner != -1) {
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
            console.log('Filtering event:', event, 'Start:', startDateTime, 'End:', endDateTime, 'Event Date:', eventDate);
            return eventDate >= startDateTime && eventDate <= endDateTime;
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
        pocetak: startDateTime ? startDateTime.toISOString() : null,
        kraj: endDateTime ? endDateTime.toISOString()  : null,
        odabraniPartner: selectedPartner,
      };
  
      console.log("Slanje izvješća na backend:", reportData);
      const reportResponse = await fetch('http://localhost:5149/api/Izvjesce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
  
      if (!reportResponse.ok) {
        const errorDetails = await reportResponse.json()
        console.error("Greška pri stvaranju izvješća! Status:", reportResponse.status);
        console.error("Detalji greške:", errorDetails);
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
          onValueChange={setSelectedPartner}
          style={styles.picker}
        >
          <Picker.Item label="Odaberite partnera" value={-1} />
          {partners.map((partner) => (
            <Picker.Item key={partner.id} label={partner.naziv} value={partner.id} />
          ))}
        </Picker>

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
    borderRadius:20,
    paddingLeft: 10,
  },
});

export default CreateReport;
