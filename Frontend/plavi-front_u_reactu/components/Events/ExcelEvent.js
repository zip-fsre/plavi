import react, {useEffect, useState} from "react"
import Pozadina from "../ui/Pozadina";
import { View, Text, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { usePage } from '../../Routes';
import DatePicker from 'react-datepicker';
import Button from "../ui/Button";
import Guest from "../ui/Guest";
import Partner from "../ui/DogadjajPartner"
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';
import SmallButton from "../ui/SmallButton";
import { Alert } from 'react-native'



const ExcelEvent = () => {
    const { currentPage, setCurrentPage, pages } = usePage();
    const { id, dogadjajId, template, templatePartneri } = currentPage;
    const IdeviPartnera = [-1];
    const ProvizijePartnera = [-1];
    const [excelData, setExcelData] = useState(null);
    
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
    const handleFileUpload = async () => {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
          copyToCacheDirectory: true,
        });
    
        if (result.canceled) {
          console.log('Odabir datoteke otkazan');
          return;
        }
    
        const file = result.assets[0];
    
        if (!file) {
          console.error('Greška: Nema odabrane datoteke.');
          return;
        }
    
        const response = await fetch(file.uri);
        const blob = await response.blob();
    
        const reader = new FileReader();
        reader.onload = async (e) => {
          const binaryString = e.target.result;
          const workbook = XLSX.read(binaryString, { type: 'binary' });
    
          const sheetNames = workbook.SheetNames;
          console.log('Nazivi listova u Excelu:', sheetNames);
    
          // Mapping event, guests, partners, and summary
          const eventSheet = sheetNames.includes('Događaj') ? workbook.Sheets['Događaj'] : null;
          const guestsSheet = sheetNames.includes('Gosti') ? workbook.Sheets['Gosti'] : null;
          const partnersSheet = sheetNames.includes('Partneri') ? workbook.Sheets['Partneri'] : null;
          const summarySheet = sheetNames.includes('Rezime') ? workbook.Sheets['Rezime'] : null;
    
          if (eventSheet) {
            const eventData = XLSX.utils.sheet_to_json(eventSheet);
            console.log('Podaci iz lista Događaj:', eventData);
            if (eventData.length > 0) {
              const event = eventData[0]; // Assuming only one event
              setNaziv(event["Naziv događaja"] || '');
              setSvrha(event.Svrha || '');
              setKlijent(event.Klijent || '');
              setKontaktKlijenta(event["Kontakt klijenta"] || '');
              setKontaktSponzora(event["Kontakt sponzora"] || '');
              setNapomena(event.Napomena || '');
              setStartDateInput(event.Datum ? new Date(event.Datum) : '');
            }
          }
    
          if (guestsSheet) {
            const guestsData = XLSX.utils.sheet_to_json(guestsSheet);
            console.log('Podaci iz lista Gosti:', guestsData);
            setGosti(guestsData.map((guest, index) => ({
              id: index + 1, // Assuming new IDs for guests
              imeIPrezime: guest["Ime i prezime"] || 'N/A',
              brojStola: guest["Broj stola"] || 0,
              statusDolaska: guest["Status dolaska"] || 'Nepotvrđen',
            })));
          }
          if (partnersSheet) {
            const partnerData = XLSX.utils.sheet_to_json(partnersSheet);
            console.log('Podaci iz lista Partneri:', partnerData);
            SviPartneri.then((value) => {
            setPartneri(partnerData.map((partner, index) => ({
              id: index + 1, // Assuming new IDs for partners
              redniBroj: index + 1,
              Izmjena: "partner.",
              KonacnaCijena: partner["Konačna cijena"] || 0,
              NaziviPartnera: value || 'N/A',
              OdabraniAranzmanId: partner["ID Aranzmana"] || 0,
              Provizija: partner.Provizija || 0,
              StatusPartnera: partner["Status partnera"] || 'Neaktivno',
              idOdabranogPartnera: partner["ID Partnera"] || 0,
              listaIdeva: IdeviPartnera,
              // Additional fields mapping as needed
            })));});
          }
    
          if (summarySheet) {
            const summaryData = XLSX.utils.sheet_to_json(summarySheet);
            console.log('Podaci iz lista Rezime:', summaryData);
          }
        };
    
        reader.readAsBinaryString(blob);
      } catch (error) {
        console.error('Greška pri učitavanju datoteke:', error);
      }
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
  

  //BROJI KOLIKO IMA PRIKAZANIH GOSTIJU
  useEffect(() => {
    if (gosti && gosti.length > 0) {
        const maxId = Math.max(...gosti.map(gost => gost.id)); // Pronađi najveći postojeći ID (upitna potreba za ovim ali eto)
        setBrojGostiju(maxId); // Postavi globalni broj gostiju na najveći ID
    }
}, [gosti]);

  //funkcija koja kupi evente iz backenda
  const fetchEventData = async () => {
    try {
      const response = await fetch(`http://localhost:5149/api/Dogadjaj/${dogadjajId}`); //da ovo radi treba koristiti ` navodnike (desni alt+7)
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
      const response = await fetch(`http://localhost:5149/api/Dogadjaj/Gosti/${dogadjajId}`);
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
      const response = await fetch(`http://localhost:5149/api/Dogadjaj/Partners/${dogadjajId}`);
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
    if(dogadjajId){
      fetchEventData();
      getGuests();
      getPartners();
    }
    else if(template){
      setEvents(template);
      SviPartneri.then((value) => {
        let i = 1;
        templatePartneri.forEach(element => {
          let pom = {id: i, redniBroj: i, Izmjena: element.Izmjena, KonacnaCijena: element.konacnaCijena, NaziviPartnera: value, OdabraniAranzmanId: element.IdAranzmana, Provizija: element.dodatakNaProviziju, StatusPartnera: element.statusPartnera, idOdabranogPartnera: element.IdPartnera, listaIdeva: IdeviPartnera}
          i++;
          partneri.push(pom);
        });
        setBrojPartnera(i);
      });
    }
  }, []); // Hint: prazan [] pokreće samo jednom funkciju (pri učitavanju stranice)


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
     <View style={styles.partnerStyle}>
       <Partner NaziviPartnera={item.NaziviPartnera} listaProvizija={ProvizijePartnera} Izmjena={item.Izmjena} idPartnera={item.id} idOdabranogPartnera={item.idOdabranogPartnera} KonacnaCijena={item.KonacnaCijena} Provizija={item.Provizija} StatusPartnera={item.StatusPartnera} listaIdeva={item.listaIdeva} redniBroj={index+1} OdabraniAranzmanId={item.OdabraniAranzmanId} sendUpdateToParent={handleDataFromChildPartner} />
       <TouchableOpacity onPress={() => handleDeletePartner(item.id)} style={styles.deletePartnerButton}>
         <Icon name="delete" size={34} color="#e8c789" style={styles.deleteIcon} />
       </TouchableOpacity>
     </View>
      );
    }



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
              <Text style={styles.title}>Stvori događaj</Text> 
              <SmallButton title="Importiraj Excel" onPress={handleFileUpload} />
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

export default ExcelEvent;

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