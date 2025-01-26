import react, {useEffect, useState} from "react"
import Pozadina from "./ui/Pozadina";
import { View, Text, StyleSheet, FlatList, TextInput, ScrollView } from "react-native";
import { usePage } from '../Routes';
import Event from './ui/Event'
import DatePicker from 'react-datepicker';
import Button from "./ui/Button";


const EditEventPage = () => {

    const { currentPage } = usePage();
    const { id } = currentPage;
    const [events, setEvents] = useState();
    const [startDate, setStartDateInput] = useState();



      //funkcija koja kupi evente iz backenda
      const getEvents = async () => {
        try {
          const response = await fetch(`http://localhost:5149/api/Dogadjaj/${id}`); //da ovo radi treba koristiti ` navodnike (desni alt+7)
          const data = await response.json();
          setEvents(data);
          setStartDateInput(data.datum);
          return data;
        }
        catch (error) {
          console.error(error);
        }
      }
    
    
      //dohvat podataka po učitavanju stranice
      useEffect(() => {
        getEvents();
      }, []); // Hint: prazan [] pokreće samo jednom funkciju (pri učitavanju stranice)

      /* prikazuje sve goste u guest listi */
    const renderGuests = ({item}) => {

     return (
      <View style={styles.headerText}>{item}</View>
     );
    };

    /* sprema promjene u bazu */
    const saveChanges = () => {

      console.log("Promjene (ce biti) spremljene kada se isprogramiraju");
      
    };


    return (
        <Pozadina>
            <View style={styles.container}>
                <Text style={styles.title}>Uredi događaj</Text> 
                <Text style={styles.headerText}>Id: {id}</Text>
                
                {events ? ( //ispis kada se dohvati podaci
                <>
                <ScrollView style={styles.scrollView}>
                  {/* naziv i vrsta */}
                  <View style={styles.infoContainer}>
                    <Text style={styles.headerText}>Naziv:</Text>
                    <TextInput style={styles.text} placeholder={events.naziv}></TextInput>
                  </View>
                  <View style={styles.infoContainer}>
                    <Text style={styles.headerText}>Vrsta:</Text>
                    <TextInput style={styles.text} placeholder={events.svrha}></TextInput>
                  </View>

                  {/* klijent i kontakt */}
                  <View style={styles.infoContainer}>
                      <Text style={styles.headerText}>Klijent:</Text>
                      <TextInput style={styles.text} placeholder={events.klijent}></TextInput>
                  </View>
                  <View style={styles.infoContainer}>
                    <Text style={styles.headerText}>Kontakt klijenta:</Text>
                    <TextInput style={styles.text} placeholder={events.kontakt_klijenta}></TextInput>
                  </View>

                  {/* glavni sponzor*/}
                  <View style={styles.infoContainer}>
                      <Text style={styles.headerText}>Kontakt glavnog sponzora:</Text>
                      <TextInput style={styles.text} placeholder={events.kontakt_sponzora}></TextInput>
                  </View>
                  {/* napomena*/}
                  <View style={styles.infoContainer}>
                      <Text style={styles.headerText}>Napomena:</Text>
                      <TextInput style={styles.text} placeholder={events.napomena}></TextInput>
                  </View>
                  {/* Input za datum*/}
                  <View style={styles.infoContainer}>
                    <View style={styles.infoContainer}>
                      <Text style={styles.dateText}>Datum:</Text>
                      <View style={styles.datePick}>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDateInput(date)}
                          dateFormat="dd.MM.yyyy"
                          placeholderText="Odaberite datum"
                          className="custom-input"
                          calendarClassName="custom-calendar"
                          zIndex="2"
                        />
                      </View>
                    </View>
                  </View>

                  {/* PARTNERI SADA SLIJEDE BOŽE POMOZI */}
                  <View style={styles.infoContainer}>
                    <Text> </Text>
                  </View>
                  {/* Gosti*/}
                  <View style={styles.infoContainer}>
                    <Text style={styles.headerText}>Lista gostiju:</Text>
                    <FlatList data={events.gosts} renderItem={renderGuests}></FlatList>
                  </View>
                  <Button title="Spremi promjene" onPress={saveChanges}></Button>
                </ScrollView>
                </>
                ) : ( //ispis dok nema podataka
                <Text style={styles.text}>Učitavam podatke...</Text>
                )}

            </View>
        </Pozadina>
    );
}

export default EditEventPage;

const styles = new StyleSheet.create({
headerText:{
    color: '#e8c789',
    fontSize: 24,
    fontFamily: 'Monotype Corsiva',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    },
scrollView:{
  maxHeight: '60%',
    },
dateText:{
      color: '#e8c789',
      fontSize: 24,
      fontFamily: 'Monotype Corsiva',
      textAlign: 'center',
      lineHeight: 24,
      marginTop: 10,
      fontWeight: "bold",
      textShadowColor: 'black',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
},

datePick:{
  marginLeft: 100,
  marginRight: 5,
},

container:{
    flex: 1,
    alignSelf: 'center',
},

infoContainer:{
    display: 'flex',
    flexDirection: 'row',
    gap: 50,
},
dateInputContainer: {
  flex: 1, // Dijeli prostor ravnomjerno između dva elementa
  flexDirection: 'row',
  gap: 50,
  justifyContent: 'center', // Centriranje elementa vertikalno
},
title: {
    color: '#e8c789',
    fontFamily: 'Alex Brush',
    fontSize: 70,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  text:{
    color: '#e8c789',
    fontSize: 18,
    fontFamily: 'Monotype Corsiva',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    borderColor: "#394a48",
    borderWidth: 2,
    backgroundColor: '#95997e',
    placeholderTextColor: "#6b5b3c",
    marginLeft: "auto",
    marginRight: 5,
  },

})