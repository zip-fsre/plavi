import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../ui/datepicker.css'; 
import Pozadina from '../ui/Pozadina';
import HoverButton from '../ui/Button';
import { usePage } from '../../Routes';
import { Picker } from '@react-native-picker/picker';

const EditReport = () => {
  const {currentPage, setCurrentPage, pages } = usePage();
  const { reportId } = currentPage;

  const [reportTitle, setReportTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medjutablicaPt2, setMedjutablicaPt2] = useState([]);
  const [medjutablicaPt1, setMedjutablicaPt1] = useState([]); 
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportResponse = await fetch(`http://localhost:5149/api/Izvjesce/${reportId}`);
        const reportData = await reportResponse.json();
        setReportTitle(reportData.naziv);
        setDescription(reportData.opis);
        setStartDate(reportData.pocetak ? new Date(reportData.pocetak) : null);
        setEndDate(reportData.kraj ? new Date(reportData.kraj) : null);
      } catch (error) {
        setError('Greška pri dohvaćanju izvješća');
      } finally {
        setLoading(false);
      }
    };
    const fetchPartners = async () => {
      try {
        const partnerResponse = await fetch('http://localhost:5149/api/Partneri');
        const partnerData = await partnerResponse.json();
        setPartners(partnerData);
      } catch (error) {
        console.error('Greška pri dohvaćanju partnera:', error);
      }
    };

    const fetchMedjutablica = async () => {
      try {
        const medjutablicaResponse = await fetch(`http://localhost:5149/api/Izvjesce/Podatci/${reportId}`);
        const medjutablicaData = await medjutablicaResponse.json();
        console.log('medjutablica2edit:', medjutablicaData);
        setMedjutablicaPt2(medjutablicaData);
      } catch (error) {
        console.error('Greška pri dohvaćanju medjutablice:', error);
      }
    };

    const fetchEvents = async () => {
      try {
        const eventsResponse = await fetch('http://localhost:5149/api/Dogadjaj');
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
      } catch (error) {
        console.error('Greška pri dohvaćanju događaja:', error);
      }
    };

    if (reportId) {
      fetchData();
      fetchMedjutablica();
    }
    fetchPartners();
    fetchEvents();
  }, [reportId]);

  const handleUpdateReport = async () => {
    if (!reportTitle || !description) {
      console.warn("Molimo unesite naziv i opis izvješća.");
      return;
    }

    let filteredPartnerData = [];
    if (selectedPartner) {
      const response = await fetch(`http://localhost:5149/api/MedjutablicaPt1/Partner/${selectedPartner}`);
      filteredPartnerData = await response.json();
    } else {
      filteredPartnerData = medjutablicaPt1;
    }
    console.log('filteredPartnerData edit:', filteredPartnerData);
    const filteredEvents = startDate && endDate
      ? events.filter(event => {
          const eventDate = new Date(event.datum);
          const reportStartDate = new Date(startDate).setHours(0, 0, 0, 0);
          const reportEndDate = new Date(endDate).setHours(23, 59, 59, 999);
          return eventDate >= reportStartDate && eventDate <= reportEndDate;
        })
      : events;

    const filteredMedjutablicaPt1 = filteredPartnerData.filter(item =>
      filteredEvents.some(event => event.id === item.idDogadjaja)
    );
      console.log('filteredMedjutablicaPt1 edit:',filteredMedjutablicaPt1)
    try {
      const response = await fetch(`http://localhost:5149/api/Izvjesce/${reportId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          naziv: reportTitle,
          opis: description,
          pocetak: startDate ? new Date(startDate).toISOString() : null,
          kraj: endDate ? new Date(endDate).toISOString() : null,
        }),
      });

      if (!response.ok) {
        alert('Došlo je do pogreške pri ažuriranju izvješća.');
        return;
      }

      for (const item of filteredMedjutablicaPt1) {
        await fetch(`http://localhost:5149/api/MedjutablicaPt2/${item.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idIzvjesca: reportId, idMedju1: item.id }),
        });
      }

      setCurrentPage({ ...pages['ViewReport'], reportId });
    } catch (error) {
      alert('Dogodila se greška pri ažuriranju izvješća.');
    }
  };
   
  if (loading) {
    return (
      <Pozadina>
        <View style={styles.container}>
          <Text>Učitavanje izvješća...</Text>
        </View>
      </Pozadina>
    );
  }

  if (error) {
    return (
      <Pozadina>
        <View style={styles.container}>
          <Text style={styles.errorText}>{error}</Text>
          <HoverButton title="Nazad" onPress={setCurrentPage({ ...pages['ReportsPage'], reportId })} />
        </View>
      </Pozadina>
    );
  }

    return (
        <Pozadina>
            <View style={styles.container}>
                <Text style={styles.title}>Uredi izvješće</Text>

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

                {/* Picker za partnera */}
                <Picker
                    selectedValue={selectedPartner}
                    onValueChange={setSelectedPartner}
                    style={styles.picker}
                >
                    <Picker.Item label="Odaberite partnera" value="" />
                    {partners.map((partner) => (
                        <Picker.Item key={partner.id} label={partner.naziv} value={partner.id} />
                    ))}
                </Picker>

                {/* Gumb za spremanje promjena */}
                <HoverButton title="Spremi promjene" onPress={handleUpdateReport} />
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
      flex: 1, // Dijeli prostor ravnomjerno između dva elementa
      marginHorizontal: 5, // Razmak između dva inputa
      alignItems: 'center', // Centriranje elementa horizontalno
      justifyContent: 'center', // Centriranje elementa vertikalno
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

export default EditReport;




