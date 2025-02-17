import react, {useEffect, useState} from "react"
import Pozadina from "../ui/Pozadina";
import { View, Text, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity , Alert} from "react-native";
import { usePage } from '../../Routes';
import Event from '../ui/Event'
import DatePicker from 'react-datepicker';
import Button from "../ui/Button";
import Guest from "../ui/Guest";
import Partner from "../ui/DogadjajPartner"
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";




const EditEventPage = () => {
    const { currentPage, setCurrentPage, pages } = usePage();
    const { id } = currentPage;
    const IdeviPartnera = [-1];
    const ProvizijePartnera = [-1];

    /* varijable za pohranu lokalno (onChange se mijenjaju) pa slanje dalje u bazu */
    //opcenite varijable o dogadjaju
    const [startDate, setStartDateInput] = useState("");
    const [naziv, setNaziv] = useState("");
    const [svrha, setSvrha] = useState("");
    const [klijent, setKlijent] = useState("");
    const [kontaktKlijenta, setKontaktKlijenta] = useState("");
    const [kontaktSponzora, setKontaktSponzora] = useState("");
    const [napomena, setNapomena] = useState(""); 
    //varijable o gostima
    const [gosti, setGosti] = useState([]); //gosti koje povucemo iz baze, a kasnije i "finalna" lista gostiju koju saljemo u bazu
    const [brojGostiju, setBrojGostiju] = useState(0); //racuna koliko je gostiju zbog postavljanja ID-eva u Flatlisti (nije najtocnije jer i ne mora biti posto se ID ne salje u bazu, ovo je samo za prikaz na frontu kada se generira novi gost)
    const [uredjeniGost, setUredjeniGost] = useState(""); //sluzi za komunikaciju child i parent komponente (Guest.js i ovaj EditEventPage.js)
    //varijable o partnerima
    const [partneri, setPartneri] = useState([]); //partneri koje povucemo iz baze, a kasnije i "finalna" lista partnera koju saljemo u bazu
    const [brojPartnera, setBrojPartnera] = useState(0); //racuna koliko je partnera zbog postavljanja ID-eva u Flatlisti (nije najtocnije jer i ne mora biti posto se ID ne salje u bazu, ovo je samo za prikaz na frontu kada se generira novi partner)
    const [uredjeniPartner, setUredjeniPartner] = useState(""); //sluzi za komunikaciju child i parent komponente (DogadjajPartner.js i ovaj EditEventPage.js)


    //sluzi za mijenjanje uredjenog gosta iz child komponente Guest.js
    const handeDataFromChildGuest = (data) => {
      setUredjeniGost(data);
    };

    const handleDataFromChildPartner = (data) => {
      setUredjeniPartner(data);
    };

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
        ProvizijePartnera.push(element.provizija);
      });
      return SviPartneri;
    }
    const SviPartneri = fetchPartners();
  
    //prebaci promijenjene podatke iz uredjeniGost u gosti array (zapravo zamijeni podatke kod gosta o kojem je rijec)
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
      
      
    };

    //BROJI KOLIKO IMA PRIKAZANIH GOSTIJU
    useEffect(() => {
      if (gosti && gosti.length > 0) {
          const maxId = Math.max(...gosti.map(gost => gost.id)); // Pronađi najveći postojeći ID (upitna potreba za ovim ali eto)
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
      setNaziv(data.naziv);
      setSvrha(data.svrha);
      setKlijent(data.klijent);
      setKontaktKlijenta(data.kontaktKlijenta);
      setKontaktSponzora(data.kontaktSponzora);
      setNapomena(data.napomena);
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

  //funkcija koja kupi partnere iz backenda
  const getPartners = async () => {
    try {
      /*const response = await fetch(`http://localhost:5149/api/Gost/${id}`); //da ovo radi treba koristiti ` navodnike (desni alt+7)*/
      const response = await fetch(`http://localhost:5149/api/Dogadjaj/Partners/${id}`);
      const data = await response.json();
      SviPartneri.then((value) => {
        let i = 1;
        data.forEach(element => {
          let pom = {id: i, redniBroj: i, Izmjena: element.izmjena, KonacnaCijena: element.konacnaCijena, NaziviPartnera: value, OdabraniAranzmanId: element.idAranzmana, Provizija: element.dodatakNaProviziju, StatusPartnera: element.statusPartnera, idOdabranogPartnera: element.idPartnera, listaIdeva: IdeviPartnera}
          i++;
          partneri.push(pom);
        });
        setBrojPartnera(i);
      });
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
    getPartners();
  }, []); // Hint: prazan [] pokreće samo jednom funkciju (pri učitavanju stranice)


  const handleExportToExcel = () => {
    if (!events) {
      Alert.alert("Info", "Nema odabranog događaja.");
      return;
    }
  
    if (!gosti.length && !partneri.length) {
      Alert.alert("Info", "Nema podataka za izvoz.");
      return;
    }
  
    const wb = XLSX.utils.book_new();
  
    const eventInfo = [{
      'Naziv događaja': events.naziv || 'N/A',
      'Svrha': events.svrha || 'N/A',
      'Klijent': events.klijent || 'N/A',
      'Kontakt klijenta': events.kontaktKlijenta || 'N/A',
      'Kontakt sponzora': events.kontaktSponzora || 'N/A',
      'Napomena': events.napomena || 'N/A',
      'Datum': events.datum ? new Date(events.datum).toLocaleDateString() : 'N/A',
    }];
  
    const wsEventInfo = XLSX.utils.json_to_sheet(eventInfo);
    XLSX.utils.book_append_sheet(wb, wsEventInfo, "Događaj");
  
    
    if (gosti.length) {
      const guestsData = gosti.map(guest => ({
        "ID Gosta": guest.id,
        "Ime i prezime": guest.imeIPrezime || 'N/A',
        "Broj stola": guest.brojStola || 'N/A',
        "Status dolaska": guest.statusDolaska || 'N/A',
      }));
  
      const wsGuests = XLSX.utils.json_to_sheet(guestsData);
      XLSX.utils.book_append_sheet(wb, wsGuests, "Gosti");
    }
  
    if (partneri.length) {
      const partnersData = partneri.map(partner => ({
        "ID Partnera": partner.idOdabranogPartnera || 'N/A',
        "Naziv partnera": partner.NaziviPartnera && partner.idOdabranogPartnera
          ? partner.NaziviPartnera[partner.idOdabranogPartnera]
          : 'N/A',
        "Konačna cijena": partner.KonacnaCijena || 'N/A',
        "Provizija": partner.Provizija || 'N/A',
        "Status partnera": partner.StatusPartnera || 'N/A',
      }));
  
      const wsPartners = XLSX.utils.json_to_sheet(partnersData);
      XLSX.utils.book_append_sheet(wb, wsPartners, "Partneri");
    }
  
    const summaryData = [{
      "Ukupan broj gostiju": gosti.length,
      "Ukupan broj partnera": partneri.length,
    }];
  
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Rezime");
  
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
    saveAs(blob, `Dogadjaj_${events.id || 'N/A'}.xlsx`);
  
    Alert.alert("Uspjeh", "Excel datoteka je uspješno generirana i preuzeta.");
  };
  
  /* prikazuje sve goste u guest listi */
  const renderGuests = ({item, index }) => {

   return (
    <View style={styles.guestStyle}>
      <Guest idGosta={item.id} statusDolaska={item.statusDolaska} brojStola={item.brojStola} imePrezime={item.imeIPrezime} redniBroj={index+1} sendUpdateToParent={handeDataFromChildGuest} />
      <TouchableOpacity onPress={() => handleDeleteGuest(item.id)}>
        <Icon name="delete" size={24} color="#e8c789" style={styles.deleteIcon} />
      </TouchableOpacity>
    </View>
   );
  };

  const renderPartners = ({item, index }) => {
    return (
     <View style={styles.partnerStyle}>
       <Partner NaziviPartnera={item.NaziviPartnera} listaProvizija={ProvizijePartnera} Izmjena={item.Izmjena} idPartnera={item.id} idOdabranogPartnera={item.idOdabranogPartnera} KonacnaCijena={item.KonacnaCijena} Provizija={item.Provizija} StatusPartnera={item.StatusPartnera} listaIdeva={item.listaIdeva} redniBroj={index+1} OdabraniAranzmanId={item.OdabraniAranzmanId} sendUpdateToParent={handleDataFromChildPartner} />
       <TouchableOpacity onPress={() => handleDeletePartner(item.id)} style={styles.deletePartnerButton}>
         <Icon name="delete" size={34} color="#e8c789" style={styles.deleteIcon} />
       </TouchableOpacity>
     </View>
      );
    }

  /* sprema promjene u bazu */
  const saveChanges = async () => {
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
    
    // Simple POST request with fetch - ZA DOGADJAJE
    await fetch(`http://localhost:5149/api/Dogadjaj/${id}`, { 
      method: 'POST', 
      //body: '{"naziv": "neko ime"}',/      
      body: JSON.stringify({
        ...events, // Zadržava postojeće podatke iz events
      }),
      //mode: "cors",
      //cache: "no-cache",
      //credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      //redirect: "follow",
      //referrerPolicy: "no-referrer",
    }).then(() => console.log("POST za događaj gotov (spremljen)!!!"));

    const finalGuests = gosti.map(guest => ({
      imeIPrezime: guest.imeIPrezime ? guest.imeIPrezime : guest.imePrezime || "N/A", //ISPOSTAVILO SE da je nekad imePrezime a nekad imeIPrezime varijabla za ime i prezime gosta pa se ovdje to ispravlja
      brojStola: guest.brojStola || 0,
      idDogadjajaa: events.id,
      statusDolaska: guest.statusDolaska || "nepoznato"
    }));

    //DELETE brisanje svih gostiju iz ovog dogadjaja u bazi
    await fetch(`http://localhost:5149/api/Gost/Gosti/${events.id}`,{
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
    }).then(()=>console.log("Izbrisani svi gosti! (DELETE poslan)", {finalGuests}));

    //POST REQUEST ZA GOSTE    
    await fetch(`http://localhost:5149/api/Gost/Vise`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(finalGuests),
    }).then(() => {
      console.log("Promjene gostiju spremljene! (POST za goste poslan)",{finalGuests});
    });


    const finalPartners = partneri.map(partner => ({
      idPartnera: partner.idOdabranogPartnera,
      idAranzmana: partner.OdabraniAranzmanId || 0,
      idDogadjaja: events.id,
      statusPartnera: partner.StatusPartnera || "nepoznato",
      izmjena: partner.Izmjena || "",
      konacnaCijena: Number(partner.KonacnaCijena) || 0,
      dodatakNaProviziju: Number(partner.Provizija) || 0
    }));

    //DELETE brisanje svih partnera iz ovog dogadjaja u bazi
    await fetch(`http://localhost:5149/api/Dogadjaj/Partnere/${events.id}`,{
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
    }).then(()=>console.log("Izbrisani svi partneri! (DELETE poslan)", {finalPartners}));

    //POST REQUEST ZA PARTNERE    
    await fetch(`http://localhost:5149/api/MedjutablicaPt1/Vise`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(finalPartners),
    }).then(() => {
      console.log("Promjene partnera spremljene! (POST za partnere poslan)",{finalPartners});
      setCurrentPage(pages['Events']);
    });
    
  };

    /* brise događaj iz baze */
  const deleteEvent = () => {
    // Simple DELETE request with fetch
    fetch(`http://localhost:5149/api/Dogadjaj/${id}`, { method: 'DELETE' })
    .then(() => {
      console.log("Uspješno obrisano!!!");
      setCurrentPage(pages['Events']);
    });
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
        return [...prevGosti, { id: newId, imeIPrezime: "Novi Gost", statusDolaska: "Nepotvrđen", brojStola: 1, idDogadjajaa: events.id, sendUpdateToParent: handeDataFromChildGuest}];
    });
  };

  const addNewPartner = () => {
    SviPartneri.then((value) => {
      setPartneri(prevPartneri => {
      setBrojPartnera(brojPartnera + 1);
      return [...prevPartneri, { id: brojPartnera, NaziviPartnera: value, listaIdeva: IdeviPartnera, Tip: "Neki tip", listaProvizija: ProvizijePartnera, idDogadjajaa: events.id, sendUpdateToParent: handleDataFromChildPartner}];
  });
    });
    
  };
  


  return (
      <Pozadina>
          <View style={styles.container}>
              <Text style={styles.title}>Uredi događaj</Text> 
              <Button title="Export to Excel" onPress={handleExportToExcel} />

              <Text style={styles.headerText}>Id: {id}</Text>
              
              {events ? ( //ispis kada se dohvati podaci
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
                  <Text> </Text>
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
  deletePartnerButton: {
    margin: "auto",
    marginLeft: 0,
    marginRight: 0,
  },

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
  maxHeight: 400,
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

  partnerStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "center",
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    borderRadius: 25,
    elevation: 5,
    margin: 10,
    marginLeft: 30,
    marginRight: 30,
    padding: 5,
    borderWidth: 2,
    borderColor: "#e8c789",
  },



})