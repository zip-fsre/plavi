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
        setSelectedPartner(reportData.odabraniPartner);
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


    const fetchEvents = async () => {
      try {
        const eventsResponse = await fetch('http://localhost:5149/api/Dogadjaj');
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
      } catch (error) {
        console.error('Greška pri dohvaćanju događaja:', error);
      }
    };
    const fetchMedjutablicaPt1 = async () => {
      try {
        const response = await fetch('http://localhost:5149/api/MedjutablicaPt1');
        const medjutablicaPt1Data = await response.json();
        console.log('medjutablicaPt1 edit:', medjutablicaPt1Data);
        setMedjutablicaPt1(medjutablicaPt1Data);
      } catch (error) {
        console.error('Greška pri dohvaćanju medjutablicePt1:', error);
      }
    };

    if (reportId) {
      fetchData();
      fetchMedjutablicaPt1();
    }
    fetchPartners();
    fetchEvents();
  }, [reportId]);

  const handleUpdateReport = async () => {
    if (!reportTitle || !description) {
      console.warn("Molimo unesite naziv i opis izvješća.");
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

    let filteredPartnerData = [];
    console.log('odabrani partner:', selectedPartner);
    if (selectedPartner != -1) {
      const response = await fetch(`http://localhost:5149/api/MedjutablicaPt1/Partner/${selectedPartner}`);
      filteredPartnerData = await response.json();
    } else {
      filteredPartnerData = medjutablicaPt1;
    }
    console.log('filteredPartnerData edit:', filteredPartnerData);
    const filteredEvents = startDate && endDate
      ? events.filter(event => {
          const eventDate = new Date(event.datum);
          const reportStartDate = new Date(startDate).setHours(23, 59, 59, 999);
          const reportEndDate = new Date(endDate).setHours(23, 59, 59, 999);
          return eventDate >= reportStartDate && eventDate <= reportEndDate;
        })
      : events;

    const filteredMedjutablicaPt1 = filteredPartnerData.filter(item =>
      filteredEvents.some(event => event.id === item.idDogadjaja)
    );
      console.log('filteredMedjutablicaPt1 edit:',filteredMedjutablicaPt1)
    try {
       
      await fetch(`http://localhost:5149/api/Izvjesce/Podaci/${reportId}`, {
         method: 'DELETE',
       });

      const response = await fetch(`http://localhost:5149/api/Izvjesce/${reportId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          naziv: reportTitle,
          opis: description,
          pocetak: startDate ? new Date(startDate).toISOString() : null,
          kraj: endDate ? new Date(endDate).toISOString() : null,
          odabraniPartner: selectedPartner,
        }),
      });
        console.log('response', response);
        if (!response.ok) {
          const errorData = await response.json();
          console.log('Error details:', errorData);  // Prikazuje detalje pogreške
        } else {
          console.log('Success:', await response.json());
        }

      for (const item of filteredMedjutablicaPt1) {
        await fetch('http://localhost:5149/api/MedjutablicaPt2', {
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
          <HoverButton title="Nazad" onPress={setCurrentPage({ ...pages['Reports']})} />
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
                    <Picker.Item label="Odaberite partnera" value= {-1}/>
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
      fontSize: 40,
      color: '#e8c789',
      fontFamily: 'Alex Brush',
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
      fontSize: 20,
      opacity: 0.8,
      color: '#222c2b',//'#222c2b',
    },
    datesContainer: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      width: '60%', 
      zIndex:2,
      marginBottom:15,
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
      opacity: 0.8,
      color: '#222c2b',
      width: '60%',
      height:40,
      marginBottom: 15,
      borderRadius:20,
      paddingLeft: 10,
    },
  });

export default EditReport;




