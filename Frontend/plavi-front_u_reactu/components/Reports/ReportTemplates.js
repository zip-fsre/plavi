import React, { useState , useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Pozadina from '../ui/Pozadina';
import HoverButton from '../ui/Button';
import { usePage } from '../../Routes';


const ReportTemplates = () => {
  const { currentPage, setCurrentPage, pages } = usePage();

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedOption, setSelectedOption] = useState(-1); 
  const [selectedPartner, setSelectedPartner] = useState(-1);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    console.log('Available Years:', availableYears);
    console.log('Initial Selected Option:', selectedOption);
  }, []);

   useEffect(() => {
      const fetchData = async () => {
        try {
          const partnerResponse = await fetch('http://localhost:5149/api/Partneri');
          const partnerData = await partnerResponse.json();
          setPartners(partnerData);
        } catch (error) {
            console.error('Error fetching data:', error);
          }
      };
  
      fetchData();
    }, []);
  const handleTemplateChange = (value) => {
    console.log('Template Selected:', value);
    setSelectedTemplate(value);
    setSelectedOption(-1); 
    setSelectedPartner(-1);
  };
   
  const handleOkPress = () => {
  
    if (selectedTemplate === 'single_partner') {
      setCurrentPage({  ...pages['CreateReport'], preselectedPartner: selectedPartner}); 
    } else if (selectedTemplate === 'single_year') {
      setCurrentPage({  ...pages['CreateReport'], preselectedYear: selectedOption}); 
    } else if (selectedTemplate === 'all_events'){
      setCurrentPage(pages['CreateReport']); 
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
            <Picker.Item label="Za sve događaje" value="all_events" />
            <Picker.Item label="Za pojedinog partnera" value="single_partner" />
            <Picker.Item label="Za pojedinu godinu" value="single_year" />
          </Picker>
        </View>

        {/* Dodatni dropdown na temelju izbora */}
        {selectedTemplate === 'single_partner' && (
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Odaberite partnera:</Text>
            <Picker
                      selectedValue={selectedPartner}
                      onValueChange={setSelectedPartner}
                      style={styles.picker}
                    >
                      <Picker.Item label="Odaberite partnera" value={-1} />
                      {partners.map((partner) => (
                        <Picker.Item key={partner.id} label={partner.naziv} value={partner.id} />
                      ))}
                    </Picker>
          </View>
        )}

        {selectedTemplate === 'single_year' && (
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Odaberite godinu:</Text>
            <Picker
              selectedValue={selectedOption}
              onValueChange={setSelectedOption}
              style={styles.picker}
            >
              <Picker.Item label="Odaberite godinu" value={-1} />
              {availableYears.map((year) => (
                <Picker.Item key={year} label={year.toString()} value={year.toString()} />
              ))}
            </Picker>
          </View>
        )}
         {(selectedTemplate === 'all_events' || 
          (selectedTemplate === 'single_partner' && selectedPartner !== -1) || 
          (selectedTemplate === 'single_year' && selectedOption !== -1)) && (
          <HoverButton title="OK" onPress={handleOkPress} />
        )}
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

export default ReportTemplates;