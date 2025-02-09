import react, {useEffect, useState} from "react"
import Pozadina from "./ui/Pozadina";
import { View, Text, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { usePage } from '../Routes';
import Event from './ui/Event'
import DatePicker from 'react-datepicker';
import Button from "./ui/Button";
import Guest from "./ui/Guest";
import Icon from 'react-native-vector-icons/MaterialIcons';



const EditEventPage = () => {
    const { currentPage, setCurrentPage, pages } = usePage();
    const { id } = currentPage;

    /* varijable za pohranu lokalno (onChange se mijenjaju) pa slanje dalje u bazu */
    const [events, setEvents] = useState();
    const [startDate, setStartDateInput] = useState();
    const [naziv, setNaziv] = useState();
    const [svrha, setSvrha] = useState();
    const [klijent, setKlijent] = useState();
    const [kontaktKlijenta, setKontaktKlijenta] = useState();
    const [kontaktSponzora, setKontaktSponzora] = useState();
    const [napomena, setNapomena] = useState();
    const [gosti, setGosti] = useState();
    const [brojGostiju, setBrojGostiju] = useState(0);


  

    const showChanges = () => {
      events.datum = startDate;

      if (!(naziv == undefined || naziv == "")) {
        events.naziv = naziv;
      }
      if (!(svrha == undefined || svrha == "")) {
        events.svrha = svrha;
      }
      if (!(klijent == undefined || klijent == "")) {
        events.klijent = klijent;
      }
      if (!(kontaktKlijenta == undefined || kontaktKlijenta == "")) {
        events.kontaktKlijenta = kontaktKlijenta;
      }
      if (!(kontaktSponzora == undefined || kontaktSponzora == "")) {
        events.kontaktSponzora = kontaktSponzora;
      }
      if (!(napomena == undefined || napomena == "")) {
        events.napomena = napomena;
      }

      console.log(events);
      console.log(gosti);
      console.log(brojGostiju);
    };

    //BROJI KOLIKO IMA PRIKAZANIH GOSTIJU
    useEffect(() => {
      if (gosti && gosti.length > 0) {
          const maxId = Math.max(...gosti.map(gost => gost.id)); // Pronađi najveći postojeći ID
          setBrojGostiju(maxId); // Postavi globalni broj gostiju na najveći ID
      }
  }, [gosti]);
  
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
      
      //funkcija koja kupi goste iz backenda
      const getGuests = async () => {
        try {
          /*const response = await fetch(`http://localhost:5149/api/Gost/${id}`); //da ovo radi treba koristiti ` navodnike (desni alt+7)*/
          const response = await fetch(`http://localhost:5149/api/Dogadjaj/Gosti/${id}`);
          const data = await response.json();
          setGosti(data);
          return data;
        }
        catch (error) {
          console.error(error);
        }
      }
    
    
      //dohvat podataka po učitavanju stranice
      useEffect(() => {
        getEvents();
        getGuests();
      }, []); // Hint: prazan [] pokreće samo jednom funkciju (pri učitavanju stranice)

    /* prikazuje sve goste u guest listi */
    const renderGuests = ({item, index }) => {

     return (
      <View style={styles.guestStyle}>
        <Guest idGosta={item.id} statusDolaska={item.statusDolaska} brojStola={item.brojStola} imePrezime={item.imeIPrezime} redniBroj={index+1}/>
        <TouchableOpacity onPress={() => handleDeleteGuest(item.id)}>
          <Icon name="delete" size={24} color="#e8c789" style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
     );
    };

    const renderPartners = () => {
        console.log("Ova tipka ce ispisati partnere");
    };

    /* sprema promjene u bazu */
    const saveChanges = () => {
      if (!(naziv == undefined || naziv == "")) {
        events.naziv = naziv;
      }
      if (!(svrha == undefined || svrha == "")) {
        events.svrha = svrha;
      }
      if (!(klijent == undefined || klijent == "")) {
        events.klijent = klijent;
      }
      if (!(kontaktKlijenta == undefined || kontaktKlijenta == "")) {
        events.kontaktKlijenta = kontaktKlijenta;
      }
      if (!(kontaktSponzora == undefined || kontaktSponzora == "")) {
        events.kontaktSponzora = kontaktSponzora;
      }
      if (!(napomena == undefined || napomena == "")) {
        events.napomena = napomena;
      }
      events.datum = new Date(startDate).toISOString().split('T')[0];
      console.log(events.datum);
    
    // Simple POST request with fetch - ZA DOGADJAJE
    fetch(`http://localhost:5149/api/Dogadjaj/${id}`, { 
      method: 'POST', 
      //body: '{"naziv": "neko ime"}',/      
      body: JSON.stringify({
        ...events, // Zadržava postojeće podatke iz events
        gosts: gosti // Dodaj array gostiju
      }),
      //mode: "cors",
      //cache: "no-cache",
      //credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      //redirect: "follow",
      //referrerPolicy: "no-referrer",
    }).then(() => console.log("Promjene spremljene događaja!!!"));

    //POST REQUEST ZA GOSTE
    /*
    fetch(`http://localhost:5149/api/Dogadjaj/Gosti/${id}`,{
      method: 'POST',
      body: JSON.stringify(gosti),
      headers: {"Content-Type": "application/json"},
    }).then(()=>console.log("Promjene gostiju spremljene!"));
    */
    };

    /* brise događaj iz baze */
    const deleteEvent = () => {
      // Simple DELETE request with fetch
      fetch(`http://localhost:5149/api/Dogadjaj/${id}`, { method: 'DELETE' })
      .then(() => console.log("Uspješno obrisano!!!"));
      setCurrentPage(pages['Events']);
    };
    const handleDeleteGuest = (guestId) => {
      // brise gosta LOKALNO iz arraya gosti
      setGosti(prevGosti => prevGosti.filter(guest => guest.id !== guestId));
    };

    const addNewGuest = () => {
      setGosti(prevGosti => {
          const newId = brojGostiju + 1;
          setBrojGostiju(newId);
          
          return [...prevGosti, { id: newId, imePrezime: "Novi Gost", statusDolaska: "Nepotvrđen", brojStola: 1 }];
      });
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
                  <Text style={styles.categoryText}>Naziv:</Text>
                  <TextInput style={styles.input} placeholder={events.naziv} onChangeText={setNaziv}></TextInput>

                  <Text style={styles.categoryText}>Vrsta:</Text>
                  <TextInput style={styles.input} placeholder={events.svrha} onChangeText={setSvrha}></TextInput>

                  {/* klijent i kontakt */}

                    <Text style={styles.categoryText}>Klijent:</Text>
                    <TextInput style={styles.input} placeholder={events.klijent} onChangeText={setKlijent}></TextInput>

                    <Text style={styles.categoryText}>Kontakt klijenta:</Text>
                    <TextInput style={styles.input} placeholder={events.kontaktKlijenta} onChangeText={setKontaktKlijenta}></TextInput>

                  {/* glavni sponzor*/}

                    <Text style={styles.categoryText}>Kontakt glavnog sponzora:</Text>
                    <TextInput style={styles.input} placeholder={events.kontaktSponzora} onChangeText={setKontaktSponzora}></TextInput>

                  {/* napomena*/}

                    <Text style={styles.categoryText}>Napomena:</Text>
                    <TextInput style={styles.input} placeholder={events.napomena} onChangeText={setNapomena}></TextInput>

                  {/* Input za datum*/}
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

                  {/* PARTNERI SADA SLIJEDE BOŽE POMOZI */}
                  <View style={styles.itemContainer}>
                    <Text> </Text>
                  </View>


                  {/* Gosti*/}
                  <View style={styles.itemContainer}>
                    <Text style={styles.categoryText}>Lista gostiju:</Text>
                    <Button title="+ Novi gost" onPress={addNewGuest}></Button>
                    {gosti ? (
                      <FlatList data={gosti} renderItem={renderGuests} keyExtractor={(item) => item.id.toString()} ></FlatList>
                    ):
                      <Text style={styles.categoryText}>Nema gostiju</Text>
                    }
                  </View>

                  <Text style={styles.categoryText}>Lista partnera:</Text>
                  <FlatList data={events.gosts} renderItem={renderPartners}></FlatList>
                  
                  <View style={styles.buttons}>
                    <Button title="Spremi promjene" onPress={saveChanges}></Button>
                    <Button title="Izbriši događaj" onPress={deleteEvent} bgColor="#b51010"></Button>
                    <Button title="Prikaži nove podatke" onPress={showChanges} bgColor="blue"></Button>
                  </View>

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
    categoryText:{
      color: '#e8c789',
      fontSize: 24,
      fontFamily: 'Monotype Corsiva',
      textAlign: 'center',
      lineHeight: 24,
      margin: "auto",
      marginLeft: 10,
      fontWeight: "bold",
      textShadowColor: 'black',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
      },
scrollView:{
  maxHeight: 500,
  width: 800,
  },
dateText:{
      color: '#e8c789',
      fontSize: 24,
      fontFamily: 'Monotype Corsiva',
      textAlign: 'center',
      lineHeight: 24,
      marginTop: 10,
      marginBottom: 10,
      fontWeight: "bold",
      textShadowColor: 'black',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
},

datePick:{
  margin: "auto",
  zIndex: 1,
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
itemContainer:{
  
},
deleteIcon: {
  marginTop: 10,
  marginRight: 10,
},
buttons:{
  display: 'flex',
  flexDirection: 'row',
  justifyContent: "center",
  gap: 20,
},
guestStyle:{
  display: 'flex',
  flexDirection: 'row',
  justifyContent: "center",
  gap: 20,
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

  input: { 
    borderWidth: 1, 
    borderColor: "#e8c789",
    padding: 10, 
    margin: 10, 
    fontSize: 20, 
    borderRadius: 5, 
    color: '#e8c789' , 
    fontFamily: 'Monotype Corsiva', 
  },



})