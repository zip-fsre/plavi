import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Picker } from 'react-native';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../ui/datepicker.css'; 
import Pozadina from '../ui/Pozadina';
import HoverButton from '../ui/Button';
import { useReportContext } from '../../ReportContext';
import { usePage } from '../../Routes'

const CreateReport = ({ navigation }) => {
  const {currentPage, setCurrentPage, pages} = usePage();
  const { setReportData, setDescription, setStartDate, setEndDate, setReportTitle, setSelectedPartner } = useReportContext();

  const [startDate, setStartDateInput] = useState(null); // Početni datum je null
  const [endDate, setEndDateInput] = useState(null);
  const [selectedPartner, setSelectedPartnerInput] = useState('');
  const [reportTitle, setReportTitleInput] = useState('');
  const [reportDescription, setReportDescriptionInput] = useState('');

  const partners = ["Bend Orkestar", "DJ Krmak", "Bend XYZ"];
  const events = [
    { date: "12.12.2024", partner: "Bend Orkestar", event: "Vjenčanje žnj", price: 250, description: "Svirali su na vjenčanju", commission: 10 },
    { date: "15.03.2025", partner: "DJ Krmak", event: "Vjenčanje neko nmp", price: 200, description: "Pustio je neku playlistu", commission: 8 },
    { date: "14.03.2025", partner: "DJ Krmak", event: "hrkljuš", price: 200, description: "najbolja igra sto je postojala", commission: 8 },
  ];

  const handleNavigation = () => {
    setReportData(events);
    setDescription(reportDescription);
    setStartDate(startDate ? startDate.toLocaleDateString('hr-HR') : '');
    setEndDate(endDate ? endDate.toLocaleDateString('hr-HR') : '');
    setReportTitle(reportTitle);
    setSelectedPartner(selectedPartner);
    console.log("Odabrani datumi:", {
      startDate: startDate ? startDate.toLocaleDateString('hr-HR') : 'nije odabran',
      endDate: endDate ? endDate.toLocaleDateString('hr-HR') : 'nije odabran',
    });
    console.log("Odabrani partner:", selectedPartner);
    console.log("Naziv izvješća:", reportTitle);
    console.log("Opis izvješća:", reportDescription);


    setCurrentPage(pages['ViewReport']);
  };

  return (
    <Pozadina>
      <View style={styles.container}>
        <Text style={styles.title}>Kreiraj izvješće</Text>

        
        {/* Input za naziv izvješća */}
        <TextInput
          style={styles.input}
          placeholder="Naziv izvješća"
          value={reportTitle}
          onChangeText={setReportTitleInput}
        />

        {/* Input za opis izvješća */}
        <TextInput
          style={styles.input}
          placeholder="Opis izvješća"
          value={reportDescription}
          onChangeText={setReportDescriptionInput}
        />
        <View style={styles.datesContainer}>
          {/* Input za datum od */}
          <View style={styles.dateInputContainer}>
            <Text style={styles.label}>Datum od:</Text>
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

          {/* Input za datum do */}
          <View style={styles.dateInputContainer}>
            <Text style={styles.label}>Datum do:</Text>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDateInput(date)}
              dateFormat="dd.MM.yyyy"
              placeholderText="Odaberite datum"
              className="custom-input"
              calendarClassName="custom-calendar"
              zIndex="2"
              
            />
          </View>
        </View>

        {/* Picker za odabir partnera */}
        <Picker
          selectedValue={selectedPartner}
          onValueChange={setSelectedPartnerInput}
          style={styles.picker}
        >
          <Picker.Item label="Odaberite partnera" value="" />
          {partners.map((partner, index) => (
            <Picker.Item key={index} label={partner} value={partner} />
          ))}
        </Picker>

        <HoverButton title="Generiraj izvješće" onPress={handleNavigation} />
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

export default CreateReport;
