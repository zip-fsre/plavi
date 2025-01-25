import react, {useEffect, useState} from "react"
import Pozadina from "./ui/Pozadina";
import { View, Text, StyleSheet, FlatList } from "react-native";
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
                <Text style={styles.text}>Id: {id}</Text>
                
                {events ? ( //ispis kada se dohvati podaci
                <>
                    <Text style={styles.text}>Naziv: {events.naziv}</Text>
                    <Text style={styles.text}>Opis: {events.opis}</Text>
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

container:{
    flex: 1,
    alignSelf: 'center',
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
  },

})