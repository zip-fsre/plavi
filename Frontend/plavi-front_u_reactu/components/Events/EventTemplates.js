import React, { useState , useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Pozadina from '../ui/Pozadina';
import HoverButton from '../ui/Button';
import { usePage } from '../../Routes';


const EventTemplates = () => {
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
  
    if (selectedTemplate === 'malo') {
      setCurrentPage({  ...pages['createEvent'], template: {naziv: "Malo vjenčanje", svrha: "Vjenčanje"},
    templatePartneri: [{IdPartnera: 6, IdAranzmana: 53, statusPartnera: "Nepotvrđen", Izmjena: "Opcija samo klapskih", konacnaCijena: 700, dodatakNaProviziju: 6}, 
        {IdPartnera: 12, IdAranzmana: 20, statusPartnera: "Nepotvrđen", Izmjena: "", konacnaCijena: 750, dodatakNaProviziju: 6}
    ]}); 
    } else if (selectedTemplate === 'veliko') {
        setCurrentPage({  ...pages['createEvent'], template: {naziv: "Veliko vjenčanje", svrha: "Vjenčanje"},
            templatePartneri: [{IdPartnera: 7, IdAranzmana: 10, statusPartnera: "Nepotvrđen", Izmjena: "DJ svira do 5", konacnaCijena: 1500, dodatakNaProviziju: 10}, 
            {IdPartnera: 11, IdAranzmana: 19, statusPartnera: "Nepotvrđen", Izmjena: "", konacnaCijena: 3500, dodatakNaProviziju: 6},
            {IdPartnera: 12, IdAranzmana: 21, statusPartnera: "Nepotvrđen", Izmjena: "10 narudžbi", konacnaCijena: 4000, dodatakNaProviziju: 9}]
    })} else if (selectedTemplate === 'okupljanje'){
        setCurrentPage({  ...pages['createEvent'], template: {naziv: "Rođendan ili slično", svrha: "Okupljanje"},
            templatePartneri: [{IdPartnera: 12, IdAranzmana: 20, statusPartnera: "Nepotvrđen", Izmjena: "", konacnaCijena: 400, dodatakNaProviziju: 6},
                {IdPartnera: 6, IdAranzmana: 52, statusPartnera: "Nepotvrđen", Izmjena: "", konacnaCijena: 400, dodatakNaProviziju: 6}
            ]}); 
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
            <Picker.Item label="Malo vjencanje" value="malo" />
            <Picker.Item label="Veliko vjencanje" value="veliko" />
            <Picker.Item label="Manje okupljanje" value="okupljanje" />
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

export default EventTemplates;