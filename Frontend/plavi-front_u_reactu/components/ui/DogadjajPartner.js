import react, { useEffect, useState } from "react";
import { Text, Button, View, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Partner = ({NaziviPartnera, Izmjena, KonacnaCijena, idPartnera, idOdabranogPartnera, listaIdeva, StatusPartnera, Provizija, listaProvizija, OdabraniAranzmanId, redniBroj, sendUpdateToParent }) => {
    const [statusi] = useState(["Nepotvrđen", "Potvrđen","Ne dolazi"]);
    const [updatedPartnera, setUpdatedPartnera] = useState({
      NaziviPartnera: NaziviPartnera || [""],
      Izmjena: Izmjena || "",
      KonacnaCijena: KonacnaCijena || 0,
      OdabraniAranzmanId: OdabraniAranzmanId || 0,
      StatusPartnera: StatusPartnera || "Nepotvrđen",
      Provizija: Provizija || 0,
      redniBroj: redniBroj || "",
      id: idPartnera || "",
      idOdabranogPartnera: idOdabranogPartnera || -1,
      listaIdeva: listaIdeva || [],
      });
    const [selectedPartner, setSelectedPartner] = useState('');
    const [selectedAranzman, setSelectedAranzman] = useState('');

    const [Aranzmani, setAranzmani] = useState(["Odaberite aranzman"]);
    const [IdAranzmana, setIdAranzmana] = useState([0]);
    const [CijeneAranzmana, setCijeneAranzmana] = useState([0]);
    const [IzmjeneAranzmana, setIzmjeneAranzmana] = useState([0]);

    
    const handleChange = (field, value) => {
      setUpdatedPartnera((prevState) => ({ ...prevState, [field]: value })); //Ažuriraj samo određeno polje
    };
    

    const handlePartnerChange = (value) => {
        handleChange("OdabraniAranzmanId", 0);
        setSelectedAranzman(0)
        setSelectedPartner(value);
        handleChange("Provizija", listaProvizija[value]);
        handleChange("idOdabranogPartnera", listaIdeva[value]);
        fetchAranzmane(listaIdeva[value]);
      };

      const fetchAranzmane = async (id) => {
        const pom = (await fetch(`http://localhost:5149/api/Partneri/Aranzmani/${id}`));
        const pom2 = await pom.json();
        const listaAranzmana = pom2.map(element => element.naziv);
        const listaIdAranzmana = pom2.map(element => element.id);
        const listaCijenaAranzmana = pom2.map(element => element.cijena);
        const listaIzmjenaAranzmana = pom2.map(element => element.izmjena);
        setAranzmani(["Odaberite aranzman", ...listaAranzmana]);
        setIdAranzmana([0, ...listaIdAranzmana]);
        setCijeneAranzmana([0, ...listaCijenaAranzmana]);
        setIzmjeneAranzmana(["", ...listaIzmjenaAranzmana]);
      }

      const handleAranzmanChange = (value) => {
        handleChange("OdabraniAranzmanId", IdAranzmana[value]);
        handleChange("KonacnaCijena", CijeneAranzmana[value]);
        setSelectedAranzman(value);
      };

      const pronadjiPartnera = () => {
        for (let i = 0; i < listaIdeva.length; i++) {
          if (listaIdeva[i] === idOdabranogPartnera) return i;
        }
        return -1;
      }

      const pronadjiAranzman = async () => {
        let i = 1;
        while(true){
          if(IdAranzmana[i] == OdabraniAranzmanId){
            setSelectedAranzman(i);
            return i;
          }
          i++;
        }
      }

      useEffect(() => {
        if(idOdabranogPartnera){
          pom = pronadjiPartnera();
          setSelectedPartner(pom);
          fetchAranzmane(idOdabranogPartnera);
        }
      }, []);

      useEffect(() => {
        if(OdabraniAranzmanId && IdAranzmana.length > 1){
          pronadjiAranzman();
        }
      }, [IdAranzmana]);

    useEffect(() => {
      sendUpdateToParent(updatedPartnera); // proslijedi update parent komponenti nakon izmjene bilo cega u updatedPartnera
    },[updatedPartnera]);

    useEffect(() => {
  }, [listaIdeva]);
    

    return(
    <View style={styles.categoryText}>
        <View style={styles.container}><div>
          <Text style={styles.numberStyle}>{redniBroj}.</Text>
          <Picker
              style={styles.naziviPartnera}
              mode="dropdown"
              selectedValue={selectedPartner}
              onValueChange={handlePartnerChange}>
          {NaziviPartnera.map((item, index) => {
              return (<Picker.Item label={item} value={index} key={index}/>) 
          })}
          </Picker>
          <Picker
              mode="dropdown"
              selectedValue={selectedAranzman}
              style={styles.aranzmaniDropdown}
              onValueChange={handleAranzmanChange}>
          {Aranzmani.map((item, index) => {
              return (<Picker.Item label={item} value={index} key={index}/>) 
          })}
          </Picker></div><div>
          <Text style={styles.PartnerStatus}>Provizija:</Text>
        <TextInput style={styles.numInput} value={updatedPartnera.Provizija} 
        onChangeText={(text) => {handleChange("Provizija", text);
          }} placeholder="0"/>
          <Text style={styles.percentageIcon}>%</Text>
          <Text style={styles.PartnerStatus}>Cijena: </Text>
        <TextInput style={styles.numInputPrice} value={updatedPartnera.KonacnaCijena} 
        onChangeText={(text) => {handleChange("KonacnaCijena", text);
          }} placeholder="0"/></div><div>
            <Text style={styles.PartnerStatus}>Izmjena: </Text>
        <TextInput style={styles.nameInput} value={updatedPartnera.Izmjena} 
        onChangeText={(text) => {handleChange("Izmjena", text);
          }} placeholder="Unesite izmjene ako ih ima..."/>
        <Text style={styles.PartnerStatus}>Status dolaska:</Text>

          {/* Picker za partnera */}
          <Picker selectedValue={updatedPartnera.StatusPartnera} onValueChange={(value) => {handleChange("StatusPartnera", value)}} style={styles.pickerComing}> {/* ; handleChange({field:"Provizija", value:value});*/}
              {statusi.map((statusi, index) => (
                  <Picker.Item key={index} label={statusi} value={statusi} />
              ))}
          </Picker></div>
        </View>
    </View>
    );
};

export default Partner;

const styles = new StyleSheet.create({
    pickerComing:{
      backgroundColor: '#222c2b',
      fontFamily: 'Monotype Corsiva',
      color: '#e8c789',
      width: 110,
      height:40,
      borderRadius: 5, 
      marginBottom: 15,
      borderWidth: 1, 
      borderColor: "#e8c789",
      marginRight: 0,
      marginLeft: 10,
      fontSize: 18,

    },

    aranzmaniDropdown:{
      backgroundColor: '#222c2b',
      fontFamily: 'Monotype Corsiva',
      color: '#e8c789',
      width: '30%',
      height: 40,
      minWidth: 200,
      borderRadius: 5, 
      marginBottom: 25,
      marginTop: 20,
      marginLeft: 10,
      borderWidth: 1, 
      borderColor: "#e8c789",
      marginRight: 0,
      fontSize: 18,

    },

    naziviPartnera:{
      backgroundColor: '#222c2b',
      fontFamily: 'Monotype Corsiva',
      color: '#e8c789',
      width: '30%',
      height: 40,
      minWidth: 200,
      borderRadius: 5, 
      marginBottom: 15,
      marginLeft: 10,
      borderWidth: 1, 
      borderColor: "#e8c789",
      marginRight: 0,
      fontSize: 18,
    },

    percentageIcon:{
      marginLeft:0,
      marginRight:10,
      color: '#e8c789',
      fontSize: 24,
      fontFamily: 'Monotype Corsiva',
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 20,
      textShadowColor: 'black',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
      alignContent: "center",
    },
    PartnerStatus:{
        color: '#e8c789',
        fontSize: 24,
        fontFamily: 'Monotype Corsiva',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
        marginLeft: 5,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
        alignContent: "center",
        minWidth: 150,
        },
    tableText:{
        color: '#e8c789',
        fontSize: 24,
        fontFamily: 'Monotype Corsiva',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
        marginLeft: 5,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
        alignContent: "center",
        minWidth: 100,
        },
    numberStyle:{
        color: '#e8c789',
        fontSize: 24,
        fontFamily: 'Monotype Corsiva',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
        marginLeft: 5,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
        alignContent: "center",
        minWidth: 50,
        },
    categoryText:{
        marginTop: 5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        textAlign: 'center',
        lineHeight: 24,
        margin: "auto",
        marginLeft: 10,
        marginRight: 10,
      },
      picker: {
        backgroundColor: '#222c2b',
        fontFamily: 'Monotype Corsiva',
        color: '#e8c789',
        width: '30%',
        height:40,
        borderRadius: 5, 
        marginBottom: 15,
        borderWidth: 1, 
        borderColor: "#e8c789",
        marginRight: 0,
        
      },
      container:{
          flex: 1,
          alignSelf: 'center',
      },
      numInput:{
        color: '#e8c789',
        fontSize: 24,
        fontFamily: 'Monotype Corsiva',
        textAlign: 'center',
        marginBottom: 20,
        marginLeft: 5,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
        width: 40,
        borderRadius: 5, 
        borderWidth: 1, 
        borderColor: "#e8c789",
        marginRight: 5,
      },
      numInputPrice:{
        color: '#e8c789',
        fontSize: 24,
        fontFamily: 'Monotype Corsiva',
        textAlign: 'center',
        marginBottom: 20,
        marginLeft: 5,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
        width: 100,
        borderRadius: 5, 
        borderWidth: 1, 
        borderColor: "#e8c789",
        marginRight: 5,
      },
      nameInput:{
        color: '#e8c789',
        fontSize: 24,
        fontFamily: 'Monotype Corsiva',
        textAlign: 'center',
        marginBottom: 20,
        marginLeft: 5,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
        width: 180,
        borderRadius: 5, 
        borderWidth: 1, 
        borderColor: "#e8c789",
        marginRight: 5,
      },
      deleteIcon: {
        marginTop: 10,
      },

});