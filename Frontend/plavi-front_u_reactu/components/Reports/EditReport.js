import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Picker } from 'react-native';
import Pozadina from '../ui/Pozadina';
import HoverButton from '../ui/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../ui/datepicker.css'; 
import { useReportContext } from '../../ReportContext';

const EditReport = ({ navigation }) => {
    const { reportData, description, startDate, endDate, reportTitle, selectedPartner,
         setReportTitle, setDescription, setStartDate, setEndDate, setSelectedPartner } = useReportContext();
    
    // Popis partnera
    const partners = ["Bend Orkestar", "DJ Krmak", "Band XYZ"];

    // State za upravljanje unosima
    const [editedReportTitle, setEditedReportTitle] = useState(reportTitle || '');
    const [editedReportDescription, setEditedReportDescription] = useState(description || '');
    const [editedStartDate, setEditedStartDate] = useState(
        startDate ? new Date(startDate.split('.').reverse().join('-')) : null
      );
      const [editedEndDate, setEditedEndDate] = useState(
        endDate ? new Date(endDate.split('.').reverse().join('-')) : null
      );
    const [editedSelectedPartner, setEditedSelectedPartner] = useState(selectedPartner || '');

    // Funkcija za spremanje promjena
    const handleSaveChanges = () => {
        // Spremanje promjena u kontekst
        
        setReportTitle(editedReportTitle);
        setDescription(editedReportDescription);
        setStartDate(editedStartDate ? editedStartDate.toLocaleDateString('hr-HR') : '');
        setEndDate(editedEndDate ? editedEndDate.toLocaleDateString('hr-HR') : '');
        setSelectedPartner(editedSelectedPartner);

        // Navigacija natrag na ViewReport
        navigation.navigate('ViewReport');
    };

    useEffect(() => {
        // Ako želite, možete pozvati handleSaveChanges kad se komponente učitaju
        setEditedReportTitle(reportTitle);
        setEditedReportDescription(description);
        setEditedStartDate(startDate ? new Date(startDate.split('.').reverse().join('-')) : null);
        setEditedEndDate(endDate ? new Date(endDate.split('.').reverse().join('-')) : null);
        setEditedSelectedPartner(selectedPartner);
    }, [reportTitle, description, startDate, endDate, selectedPartner]);

    return (
        <Pozadina>
            <View style={styles.container}>
                <Text style={styles.title}>Uredi izvješće</Text>

                {/* Input za naziv izvješća */}
                <TextInput
                    style={styles.input}
                    placeholder="Naziv izvješća"
                    value={editedReportTitle} // Koristi state za naziv izvješća
                    onChangeText={setEditedReportTitle}
                />

                {/* Input za opis izvješća */}
                <TextInput
                    style={styles.input}
                    placeholder="Opis izvješća"
                    value={editedReportDescription} // Koristi state za opis izvješća
                    onChangeText={setEditedReportDescription}
                />

               <View style={styles.datesContainer}>
                        {/* Input za datum od */}
                        <View style={styles.dateInputContainer}>
                          <Text style={styles.label}>Datum od:</Text>
                          <DatePicker
                            selected={editedStartDate}
                            onChange={(date) => setEditedStartDate(date)}
                            dateFormat="dd.MM.yyyy"
                            placeholderText="Odaberite datum"
                            className="custom-input"
                            calendarClassName="custom-calendar"
                            zIndex="2"
                          />
                        </View>
              
                        {/* Input za datum do */}
                        <View style={styles.dateInputContainer}>
                          <Text style={styles.label}>Datum do:</Text>
                          <DatePicker
                             selected={editedEndDate}
                             onChange={(date) => setEditedEndDate(date)}
                            dateFormat="dd.MM.yyyy"
                            placeholderText="Odaberite datum"
                            className="custom-input"
                            calendarClassName="custom-calendar"
                            zIndex="2"
                            
                          />
                        </View>
                      </View>

                {/* Picker za partnera */}
                <Picker
                    selectedValue={editedSelectedPartner}
                    onValueChange={setEditedSelectedPartner}
                    style={styles.picker}
                >
                    <Picker.Item label="Odaberite partnera" value="" />
                    {partners.map((partner, index) => (
                        <Picker.Item key={index} label={partner} value={partner} />
                    ))}
                </Picker>

                {/* Gumb za spremanje promjena */}
                <HoverButton title="Spremi promjene" onPress={handleSaveChanges} />
            </View>
        </Pozadina>
    );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 30,
      color: '#e8c789',
      fontFamily: 'Monotype Corsiva',
      marginBottom: 20,
    },
    label: {
      marginBottom: 8,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#e8c789',
    },
    input: {
      width: '60%',
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 20,
      marginBottom: 15,
      paddingLeft: 10,
      backgroundColor: '#95997e',
      fontSize: 18,
      opacity: 0.6,
      color: '#222c2b',
    },
    datesContainer: {
      flexDirection: 'row', // Postavlja djecu u red
      justifyContent: 'space-between', // Raspoređuje prostor između djece
      width: '60%', // Širina roditeljskog elementa
      marginBottom: 15,
      zIndex:2,
    },
    dateInputContainer: {
      flex: 1, // Dijeli prostor ravnomjerno između dva elementa
      marginHorizontal: 5, // Razmak između dva inputa
      alignItems: 'center', // Centriranje elementa horizontalno
      justifyContent: 'center', // Centriranje elementa vertikalno
      width: '50%',
    },
    picker: {
      backgroundColor: '#95997e',
      opacity: 0.6,
      color: '#222c2b',
      width: '60%',
      height:40,
      marginBottom: 15,
    },
  });

export default EditReport;




