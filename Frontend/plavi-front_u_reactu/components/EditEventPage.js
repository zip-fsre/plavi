import react, {useEffect, useState} from "react"
import Pozadina from "./ui/Pozadina";
import { View, Text, StyleSheet, FlatList, TextInput } from "react-native";
import { usePage } from '../Routes';
import Event from './ui/Event'


const EditEventPage = () => {

    const { currentPage } = usePage();
    const { id } = currentPage;
    const [events, setEvents] = useState();


      //funkcija koja kupi evente iz backenda
      const getEvents = async () => {
        try {
          const response = await fetch(`http://localhost:5149/api/Dogadjaj/${id}`); //da ovo radi treba koristiti ` navodnike (desni alt+7)
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
        getEvents();
      }, []); // Hint: prazan [] pokreće samo jednom funkciju (pri učitavanju stranice)

      


    return (
        <Pozadina>
            <View style={styles.container}>
                <Text style={styles.title}>Uredi (ime događaja)</Text> 
                <Text style={styles.headerText}>Id: {id}</Text>
                
                {events ? ( //ispis kada se dohvati podaci
                <>
                <View style={styles.infoContainer}>
                    <Text style={styles.headerText}>Naziv:</Text>
                    <TextInput style={styles.text} placeholder={events.naziv}></TextInput>
                    <Text style={styles.headerText}>Opis:</Text>
                    <TextInput style={styles.text} placeholder={events.opis}></TextInput>
                </View>
                </>
                ) : ( //alternativni ispis
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
title: {
    color: '#e8c789',
    fontFamily: 'Monotype Corsiva',
    fontSize: 100,
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
    borderColor: "grey",
    borderRadius: "200",
    borderWidth: 2,
    backgroundColor: '#95997e',
  },

})