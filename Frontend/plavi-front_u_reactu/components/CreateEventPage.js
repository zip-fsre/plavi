import react, {useEffect, useState} from "react"
import Pozadina from "./ui/Pozadina";
import { View, Text, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { usePage } from '../Routes';
import DatePicker from 'react-datepicker';
import Button from "./ui/Button";
import Guest from "./ui/Guest";
import Partner from "./ui/DogadjajPartner"
import Icon from 'react-native-vector-icons/MaterialIcons';



const CreateEventPage = () => {
    const { currentPage, setCurrentPage, pages } = usePage();
    const { id } = currentPage;
    const IdeviPartnera = [-1];
    const ProvizijePartnera = [-1];
    
    //opcenite varijable o dogadjaju
    const [startDate, setStartDateInput] = useState('');
    const [naziv, setNaziv] = useState('');
    const [svrha, setSvrha] = useState('');
    const [klijent, setKlijent] = useState('');
    const [kontaktKlijenta, setKontaktKlijenta] = useState('');
    const [kontaktSponzora, setKontaktSponzora] = useState('');
    const [napomena, setNapomena] = useState(''); 
    //varijable o gostima
    const [gosti, setGosti] = useState([]); //gosti koje povucemo iz baze, a kasnije i "finalna" lista gostiju koju saljemo u bazu
    const [brojGostiju, setBrojGostiju] = useState(0); //racuna koliko je gostiju zbog postavljanja ID-eva u Flatlisti (nije najtocnije jer i ne mora biti posto se ID ne salje u bazu, ovo je samo za prikaz na frontu kada se generira novi gost)
    const [uredjeniGost, setUredjeniGost] = useState(""); //sluzi za komunikaciju child i parent komponente (Guest.js i ovaj EditEventPage.js)
    //varijable o partnerima
    const [partneri, setPartneri] = useState([]); //partneri koje povucemo iz baze, a kasnije i "finalna" lista partnera koju saljemo u bazu
    const [brojPartnera, setBrojPartnera] = useState(0); //racuna koliko je partnera zbog postavljanja ID-eva u Flatlisti (nije najtocnije jer i ne mora biti posto se ID ne salje u bazu, ovo je samo za prikaz na frontu kada se generira novi gost)
    const [uredjeniPartner, setUredjeniPartner] = useState(""); //sluzi za komunikaciju child i parent komponente (DogadjajPartner.js i ovaj CreateEventPage.js)

    const handleDataFromChildGuest = (data) => {
      setUredjeniGost(data);
    };

    const handleDataFromChildPartner = (data) => {
      setUredjeniPartner(data);
    };
    

    /* varijable za pohranu lokalno (onChange se mijenjaju) pa slanje dalje u bazu */
    const [events, setEvents] = useState({
      startDate: startDate,
      naziv: naziv,
      svrha: svrha,
      klijent: klijent,
      kontaktKlijenta: kontaktKlijenta,
      kontaktSponzora: kontaktSponzora,
      napomena: napomena
    });

  const fetchPartners = async () => {
    const pom = (await fetch("http://localhost:5149/api/Partneri"));
    const pom2 = await pom.json();
    const SviPartneri = ["Odaberite partnera"];
    pom2.forEach(element => {
      SviPartneri.push(element.naziv);
      IdeviPartnera.push(element.id);
      ProvizijePartnera.push(element.id);
    });
    return SviPartneri;
  }
  const SviPartneri = fetchPartners();
    
  //dohvat podataka po učitavanju stranice
  useEffect(() => {
  }, []); // Hint: prazan [] pokreće samo jednom funkciju (pri učitavanju stranice)


  useEffect(() => {
    if (gosti && gosti.length > 0) {
      // Provjeri postoji li stvarna promjena
      const updatedGuests = gosti.map((guest) =>
        guest.id === uredjeniGost.id ? uredjeniGost : guest 
      );
  
        setGosti(updatedGuests); 
    }
  }, [uredjeniGost]);

  useEffect(() => {
    if (partneri && partneri.length > 0) {
      // Provjeri postoji li stvarna promjena
      const updatedPartneri = partneri.map((partner) =>
        partner.id === uredjeniPartner.id ? uredjeniPartner : partner 
      );
  
        setPartneri(updatedPartneri); 
    }
  }, [uredjeniPartner]);


  /* prikazuje sve goste u guest listi */
  const renderGuests = ({item, index }) => {

   return (
    <View style={styles.guestStyle}>
      <Guest idGosta={item.id} statusDolaska={item.statusDolaska} brojStola={item.brojStola} imePrezime={item.imeIPrezime} redniBroj={index+1} sendUpdateToParent={handleDataFromChildGuest} />
      <TouchableOpacity onPress={() => handleDeleteGuest(item.id)}>
        <Icon name="delete" size={24} color="#e8c789" style={styles.deleteIcon} />
      </TouchableOpacity>
    </View>
   );
  };

  /* prikazuje sve goste u guest listi */
  const renderPartners = ({item, index }) => {

    return (
     <View style={styles.guestStyle}>
       <Partner idPartnera={item.id} NaziviPartnera={item.NaziviPartnera} listaIdeva={IdeviPartnera} listaProvizija={ProvizijePartnera} redniBroj={index+1} sendUpdateToParent={handleDataFromChildPartner} />
       <TouchableOpacity onPress={() => handleDeletePartner(item.id)}>
         <Icon name="delete" size={24} color="#e8c789" style={styles.deleteIcon} />
       </TouchableOpacity>
     </View>
    );
   };



  const handleDeleteGuest = (guestId) => {
    // brise gosta LOKALNO iz arraya gosti
    setGosti(prevGosti => prevGosti.filter(guest => guest.id !== guestId));
  };

  const handleDeletePartner = (partnerId) => {
    // brise partnera LOKALNO iz arraya partneri
    setPartneri(prevPartneri => prevPartneri.filter(partner => partner.id !== partnerId));
  };

  const addNewGuest = () => {
    setGosti(prevGosti => {
        const newId = brojGostiju + 1;
        setBrojGostiju(newId);
        return [...prevGosti, { id: newId, imeIPrezime: "Novi Gost", statusDolaska: "Nepotvrđen", brojStola: 1, idDogadjajaa: events.id, sendUpdateToParent: handleDataFromChildGuest}];
    });
  };

  const addNewPartner = () => {
    SviPartneri.then((value) => {
      setPartneri(prevPartneri => {
      const newId = brojPartnera + 1;
      setBrojPartnera(newId);
      return [...prevPartneri, { id: newId, NaziviPartnera: value, listaIdeva: IdeviPartnera, listaProvizija: ProvizijePartnera, idDogadjajaa: events.id, sendUpdateToParent: handleDataFromChildPartner}];
  });
    });
    
  };
  
  const handleCreate = async () => {
    setEvents({
      startDate: startDate,
      naziv: naziv,
      svrha: svrha,
      klijent: klijent,
      kontaktKlijenta: kontaktKlijenta,
      kontaktSponzora: kontaktSponzora,
      napomena: napomena
    });
    const myresponse = await fetch(`http://localhost:5149/api/Dogadjaj/`, { 
      method: 'POST',     
      body: JSON.stringify({
        naziv: naziv,
        svrha: svrha,
        klijent: klijent,
        kontaktKlijenta: kontaktKlijenta,
        kontaktSponzora: kontaktSponzora,
        napomena: napomena,
        datum: new Date(startDate).toISOString().split('T')[0],
      }),
      headers: { "Content-Type": "application/json" },
    });
    const mydata = await myresponse.json();

    const finalGuests = gosti.map(guest => ({
      imeIPrezime: guest.imeIPrezime ? guest.imeIPrezime : guest.imePrezime || "N/A", //ISPOSTAVILO SE da je nekad imePrezime a nekad imeIPrezime varijabla za ime i prezime gosta pa se ovdje to ispravlja
      brojStola: guest.brojStola || 0,
      idDogadjajaa: mydata.id,
      statusDolaska: guest.statusDolaska || "nepoznato"
    }));

    fetch(`http://localhost:5149/api/Gost/Vise`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(finalGuests),
    }).then(() => {
      console.log("Promjene gostiju spremljene! (POST za goste poslan)",{finalGuests});
    });

    const finalPartners = partneri.map(partner => ({
      idPartnera: partner.idOdabranogPartnera,
      idAranzmana: partner.OdabraniAranzmanId || 0,
      idDogadjaja: mydata.id,
      statusPartnera: partner.StatusPartnera || "nepoznato",
      izmjena: partner.Izmjena || "",
      konacnaCijena: Number(partner.KonacnaCijena) || 0,
      dodatakNaProviziju: Number(partner.Provizija) || 0
    }));

    fetch(`http://localhost:5149/api/MedjutablicaPt1/Vise`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(finalPartners),
    }).then(() => {
      console.log("Promjene partnera spremljene! (POST za partnere poslan)",{finalPartners});
      setCurrentPage(pages['Events']);
    });


  }

  return (
      <Pozadina>
          <View style={styles.container}>
              <Text style={styles.title}>Uredi događaj</Text> 
              <Text style={styles.headerText}>Id: </Text>
              <>
              <ScrollView style={styles.scrollView}>
                {/* naziv i vrsta */}
                <Text style={styles.categoryText}>Naziv:</Text>
                <TextInput style={styles.input} placeholder={events.naziv} value={naziv} onChangeText={setNaziv}></TextInput>

                <Text style={styles.categoryText}>Vrsta:</Text>
                <TextInput style={styles.input} placeholder={events.svrha} value={svrha} onChangeText={setSvrha}></TextInput>

                {/* klijent i kontakt */}

                  <Text style={styles.categoryText}>Klijent:</Text>
                  <TextInput style={styles.input} placeholder={events.klijent} value={klijent} onChangeText={setKlijent}></TextInput>

                  <Text style={styles.categoryText}>Kontakt klijenta:</Text>
                  <TextInput style={styles.input} placeholder={events.kontaktKlijenta} value={kontaktKlijenta} onChangeText={setKontaktKlijenta}></TextInput>

                {/* glavni sponzor*/}

                  <Text style={styles.categoryText}>Kontakt glavnog sponzora:</Text>
                  <TextInput style={styles.input} placeholder={events.kontaktSponzora} value={kontaktSponzora} onChangeText={setKontaktSponzora}></TextInput>

                {/* napomena*/}

                  <Text style={styles.categoryText}>Napomena:</Text>
                  <TextInput style={styles.input} placeholder={events.napomena} value={napomena} onChangeText={setNapomena}></TextInput>

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
                  <Text style={styles.categoryText}>Lista partnera:</Text>
                  <View style={styles.addGuestView}>
                    <Button title="+ Novi partner" onPress={addNewPartner}></Button>
                  </View>
                  {partneri ? (
                    <FlatList data={partneri} renderItem={renderPartners} keyExtractor={(item) => item.id.toString()} ></FlatList>
                  ):
                    <Text style={styles.categoryText}>Nema partnera</Text>
                  }
                </View>


                {/* Gosti*/}
                <View style={styles.itemContainer}>
                  <Text style={styles.categoryText}>Lista gostiju:</Text>
                  <View style={styles.addGuestView}>
                    <Button title="+ Novi gost" onPress={addNewGuest}></Button>
                  </View>
                  {gosti ? (
                    <FlatList data={gosti} renderItem={renderGuests} keyExtractor={(item) => item.id.toString()} ></FlatList>
                  ):
                    <Text style={styles.categoryText}>Nema gostiju</Text>
                  }
                </View>
                
                <View style={styles.buttons}>
                  <Button title="Napravi događaj" onPress={handleCreate}></Button>
                </View>

              </ScrollView>
              </>

          </View>
      </Pozadina>
  );
}

export default CreateEventPage;

const styles = new StyleSheet.create({
  addGuestView:{
    marginBottom: 10,
  },
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