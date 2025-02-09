import react, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Guest = ({imePrezime, idGosta, brojStola, statusDolaska, redniBroj }) => {

    const [statusi] = useState(["Nepotvrđen", "Potvrđen","Ne dolazi"]);
    const [updatedGuest, setUpdatedGuest] = useState({
      imePrezime: imePrezime || "",
      brojStola: brojStola || "",
      statusDolaska: statusDolaska || "",
      redniBroj: redniBroj || ""
      });


    const handleChange = (field, value) => {
      setUpdatedGuest((prevState) => ({ ...prevState, [field]: value })); // Ažuriraj samo određeno polje
  };

    return(
    <View style={styles.categoryText}>
      <Text style={styles.numberStyle}>{redniBroj}.</Text>
      <TextInput style={styles.nameInput} value={updatedGuest.imePrezime}
       onChangeText={(text) => {handleChange("imePrezime", text);}} placeholder="Ime i prezime gosta"
      ></TextInput>
      <Text style={styles.tableText}>Broj stola:</Text>
      <TextInput style={styles.numInput} keyboardType="number-pad" value={updatedGuest.brojStola} 
      onChangeText={(text) => {handleChange("brojStola", text.replace(/[^0-9]/g));}} placeholder="0"/>
      <Text style={styles.guestStatus}>Status dolaska:</Text>

        {/* Picker za gosta */}
        <Picker selectedValue={updatedGuest.statusDolaska} onValueChange={(value) => {handleChange("statusDolaska", value)}} style={styles.picker}> {/* ; handleChange({field:"statusDolaska", value:value});*/}
            {statusi.map((statusi, index) => (
                <Picker.Item key={index} label={statusi} value={statusi} />
            ))}
        </Picker>
    </View>
    );
};

export default Guest;

const styles = new StyleSheet.create({

    guestStatus:{
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