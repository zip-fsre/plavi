import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import Pozadina from '../ui/Pozadina';
import Event from '../ui/Event'
import { ScrollView } from 'react-native';
import  Button  from "../ui/Button";
import { usePage } from '../../Routes';
import Layout from '../Layout';
import * as XLSX from 'xlsx'; 
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';


const EventsPage = () => {
  const {currentPage, setCurrentPage, pages} = usePage();
  const [events, setEvents] = useState([]);

  const handleAddEvent = () => {
    console.log("Dodaj događaj!");
  }
  const handleEditEvent = () => {
    alert("Ovo je samo placeholder događaj koji nema veze s backendom! Ovdje je samo kao primjer kako izgleda uredno unesen događaj");
  }


  //funkcija koja kupi evente iz backenda
  const getEvents = async () => {
    try {
      const response = await fetch('http://localhost:5149/api/Dogadjaj/');
      const data = await response.json();
      setEvents(data);
      return data;
    }
    catch (error) {
      console.error(error);
    }
  }


  //dohvat podataka po učitavanju stranice
  useEffect(() => {
    async function fetchEvents() {
      const data = await getEvents(); // Dohvat podataka kada se getEvents odradi
      setEvents(data); 
    }
    fetchEvents(); 
  }, []); // Hint: prazan [] pokreće samo jednom funkciju (pri učitavanju stranice)
  

  //kartica dogadjaja (prikaz)
const renderEvent = ({item}) => {
  return (
    <View style={styles.eventContainer}>
      <Event onPress={() => setCurrentPage({...pages['EditEventPage'], id: item.id})} naziv={item.naziv} vrsta={item.svrha} opis={item.napomena} datum={item.datum}/>
    </View>
  );

};

const handleExportToExcel = () => {
  const wb = XLSX.utils.book_new(); 
  const ws = XLSX.utils.json_to_sheet(events); 
  XLSX.utils.book_append_sheet(wb, ws, 'Događaji'); 

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  const fileName = `Događaji_${new Date().toISOString()}.xlsx`;
  saveAs(blob, fileName);

  Alert.alert('Uspjeh', 'Excel datoteka je uspješno generirana i preuzeta.');
};

const handleExportToPDF = () => {
  if (!events || events.length === 0) {
    alert("Nema podataka za događaje.");
    return;
  }

  const doc = new jsPDF();
  let yOffset = 20; 

  events.forEach((event, index) => {
    if (yOffset > 250) { 
      doc.addPage();
      yOffset = 20; 
    }

    doc.setFontSize(18);
    doc.text(`Naziv: ${event.naziv}`, 10, yOffset);

    doc.setFontSize(12);

    doc.text(`Vrsta: ${event.svrha}`, 10, yOffset + 10);
    doc.text(`Datum: ${event.datum}`, 10, yOffset + 20);
    doc.text(`Napomena: ${event.napomena}`, 10, yOffset + 30);
    doc.text(`Klijent: ${event.klijent}`, 10, yOffset + 40);
    doc.text(`Kontakt klijenta: ${event.kontaktKlijenta}`, 10, yOffset + 50);
    doc.text(`Kontakt sponzora: ${event.kontaktSponzora}`, 10, yOffset + 60);
    doc.line(10, yOffset + 65, 200, yOffset + 65); 

    yOffset += 75; 
  });

  doc.save(`Događaji_${new Date().toISOString()}.pdf`);
};

  return (
    <Pozadina>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Događaji</Text> 
            <Button title="Izvezi u Excel" onPress={handleExportToExcel} />
            <Button title="Izvezi u PDF" onPress={handleExportToPDF} />

          </View>
          <ScrollView style={styles.partneri}>
            <FlatList data={events} renderItem={renderEvent} />
            {/*<Event onPress={handleEditEvent} naziv='Prvi događaj' vrsta='Vjenčanje' opis='Ivan Matić - 063 223 321'/>
            <Event onPress={handleEditEvent} naziv='Drugi događaj' vrsta='Vjenčanje' opis='Ana Marić - 063 654 455'/>*/}
          
          </ScrollView>
        </View>
    </Pozadina>
  );
};

const styles = StyleSheet.create({
  eventContainer:{
    flex: 1,
    alignSelf: 'center', 
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    margin: 10,
    padding: 5,
  },

  container: {
    flex: 1,
    alignSelf: 'center',  

  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 190,
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Alex Brush',
    fontSize: 70,
    marginBottom: 10,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  description: {
    color: '#e8c789',
    fontSize: 18,
    fontFamily: 'Monotype Corsiva',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  menu: {
    position: 'absolute',
    flex: 1,
    bottom: 15,
    left: '5%',
    width: '95%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  partneri: {
    maxHeight: 500,
  },
});

export default EventsPage;

