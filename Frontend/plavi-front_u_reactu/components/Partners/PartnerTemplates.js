import React, { useState , useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Pozadina from '../ui/Pozadina';
import HoverButton from '../ui/Button';
import { usePage } from '../../Routes';


const PartnerTemplates = () => {
  const { currentPage, setCurrentPage, pages } = usePage();

  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedOption, setSelectedOption] = useState(-1); 
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    console.log('Initial Selected Option:', selectedOption);
  }, []);

  const handleTemplateChange = (value) => {
    console.log('Template Selected:', value);
    setSelectedTemplate(value);
    setSelectedOption(-1);
  };
   
  const handleOkPress = () => {
  
    if (selectedTemplate === 'bend') {
      setCurrentPage({  ...pages['AddPartner'], template: {naziv: "Ime benda", vrsta: "Bend", napomena: "", provizija: 5},
    templateAranzmani: [{naziv: "Playlista 1", opis: "Ponuda 1, Zanr 1, Pjevac 1", cijena: 100}, {naziv: "Playlista 2", opis: "Ponuda 2, Zanr 2, Pjevac 2", cijena: 200}]}); 
    } else if (selectedTemplate === 'hrana') {
        setCurrentPage({  ...pages['AddPartner'], template: {naziv: "Ime restorana", vrsta: "Hrana", napomena: "", provizija: 7},
            templateAranzmani: [{naziv: "Ponuda 1", opis: "Broj tekova 1, vrsta hrane 1", cijena: 100}, {naziv: "Ponuda 2", opis: "Broj tekova 2, vrsta hrane 2", cijena: 200}]}); 
    } else if (selectedTemplate === 'prostor'){
        setCurrentPage({  ...pages['AddPartner'], template: {naziv: "Ime sale/prostora", vrsta: "Prostor", napomena: "", provizija: 10},
            templateAranzmani: [{naziv: "Ponuda 1", opis: "Satnica 1, Broj mjesta 1", cijena: 100}, {naziv: "Ponuda 2", opis: "Satnica 2, Broj mjesta 2", cijena: 200}]}); 
    }
  };


  return (
    <Pozadina>
      <View style={styles.container}>
        <Text style={styles.title}>Odaberite predložak izvješća:</Text>
        
        {/* Glavni dropdown */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedTemplate}
            onValueChange={handleTemplateChange}
            style={styles.picker}
          >
            <Picker.Item label="Odaberite predložak..." value="" />
            <Picker.Item label="Predlozak za prostor" value="prostor" />
            <Picker.Item label="Predlozak za bend" value="bend" />
            <Picker.Item label="Predlozak za hranu" value="hrana" />
          </Picker>
        </View>
        {selectedTemplate ? <HoverButton title="OK" onPress={handleOkPress}/> : null}
        
      </View>
    </Pozadina>
  );
};

const styles = StyleSheet.create({
  container: {
    height:50,
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Alex Brush',
    fontSize: 48,
    textAlign: 'left',
    marginBottom: 10,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e8c789',
  },
  pickerContainer: {
    alignItems:'center',
  },
  picker: {
    backgroundColor: '#95997e',
    opacity: 0.6,
    color: '#222c2b',
    width: '60%',
    height:40,
    marginBottom: 15,
    borderRadius:20,
    paddingLeft: 10,
  },
});

export default PartnerTemplates;