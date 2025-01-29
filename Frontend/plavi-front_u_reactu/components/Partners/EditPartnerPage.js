import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
import Pozadina from "../ui/Pozadina";
import { usePage } from "../../Routes";

const BASE_URL = "http://localhost:5149/api"; // Točan URL backend-a

const ArrangementInput = ({ arrangement, index, onChange }) => (
  <View style={styles.arrangementContainer}>
    <TextInput
      style={styles.input}
      placeholder="Naziv aranžmana"
      placeholderTextColor="#ccc"
      value={arrangement.naziv}
      onChangeText={(text) => onChange(index, "naziv", text)}
    />
    <TextInput
      style={styles.input}
      placeholder="Opis aranžmana"
      placeholderTextColor="#ccc"
      value={arrangement.opis}
      onChangeText={(text) => onChange(index, "opis", text)}
    />
    <TextInput
      style={styles.input}
      placeholder="Cijena aranžmana"
      placeholderTextColor="#ccc"
      value={arrangement.cijena}
      onChangeText={(text) => onChange(index, "cijena", text)}
      keyboardType="numeric"
    />
  </View>
);

export const EditPartner = () => {
  const { currentPage, setCurrentPage, pages } = usePage();
  const { id } = currentPage;

  const [partner, setPartner] = useState({
    naziv: "",
    vrsta: "",
    napomena: "",
    provizija: "",
  });

  const [arrangements, setArrangements] = useState([]);

  useEffect(() => {
    const handleFetchPartner = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Partneri/${id}`);
        if (!response.ok) throw new Error("Neuspjelo dohvaćanje partnera.");
        
        const data = await response.json();
        setPartner({
          naziv: data.naziv,
          vrsta: data.tip,
          napomena: data.napomena,
          provizija: String(data.provizija), 
        });

        
        const arrangementsResponse = await fetch(`${BASE_URL}/Partneri/Aranzmani/${id}`);
        if (!arrangementsResponse.ok) throw new Error("Neuspjelo dohvaćanje aranžmana.");
        
        const arrangementsData = await arrangementsResponse.json();
        setArrangements(arrangementsData || []);
      } catch (error) {
        console.error(error);
        Alert.alert("Greška", "Dogodila se greška pri dohvaćanju podataka.");
      }
    };

    handleFetchPartner();
  }, [id]);
  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const partnerSheet = XLSX.utils.json_to_sheet([partner]);
    XLSX.utils.book_append_sheet(wb, partnerSheet, "Partner");
    const arrangementsSheet = XLSX.utils.json_to_sheet(arrangements);
    XLSX.utils.book_append_sheet(wb, arrangementsSheet, "Aranžmani");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "Partner.xlsx");
  };

  const handleEditPartner = async () => {
    if (!partner.naziv || !partner.vrsta || !partner.napomena || !partner.provizija) {
      Alert.alert("Greška", "Molimo ispunite sva polja!");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/Partneri/${id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Naziv: partner.naziv,
          Tip: partner.vrsta,
          Napomena: partner.napomena,
          Provizija: parseFloat(partner.provizija),
        }),
      });

      if (!response.ok) throw new Error("Neuspjelo ažuriranje partnera.");

      for (const aranzman of arrangements) {
        if (aranzman.naziv && aranzman.opis && aranzman.cijena) {
          const aranzmanResponse = await fetch(`${BASE_URL}/Aranzmani/${aranzman.id}`, {
            method: "PUT", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              IdPartnera: id,
              Naziv: aranzman.naziv,
              Opis: aranzman.opis,
              Cijena: parseFloat(aranzman.cijena),
            }),
          });

          if (!aranzmanResponse.ok) {
            throw new Error("Neuspjelo ažuriranje aranžmana!");
          }
        }
      }

      Alert.alert("Uspjeh", "Partner i aranžmani su uspješno ažurirani!");
      setCurrentPage(pages["Partners"]);
    } catch (error) {
      console.error(error);
      Alert.alert("Greška", "Dogodila se greška pri ažuriranju partnera.");
    }
  };

  
  const handleAddArrangement = () => {
    setArrangements([...arrangements, { naziv: "", opis: "", cijena: "" }]);
  };

  return (
    <Pozadina>
      <View style={styles.container}>
        <Text style={styles.title}>Uredi partnera</Text>
        <ScrollView style={styles.scrollView}>
          <TextInput
            style={styles.input}
            placeholder="Naziv partnera"
            placeholderTextColor="#ccc"
            value={partner.naziv}
            onChangeText={(text) => setPartner({ ...partner, naziv: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Vrsta partnera"
            placeholderTextColor="#ccc"
            value={partner.vrsta}
            onChangeText={(text) => setPartner({ ...partner, vrsta: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Provizija partnera"
            placeholderTextColor="#ccc"
            value={partner.provizija}
            onChangeText={(text) => setPartner({ ...partner, provizija: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Napomena"
            placeholderTextColor="#ccc"
            value={partner.napomena}
            onChangeText={(text) => setPartner({ ...partner, napomena: text })}
          />

          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Aranžmani</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddArrangement}>
                <Text style={styles.addButtonText}>+ Dodaj aranžman</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleEditPartner}>
                <Text style={styles.saveButtonText}>Spremi promjene</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleExportToExcel}>
                <Text style={styles.saveButtonText}>Izvezi u Excel</Text>
              </TouchableOpacity>
            </View>
          </View>

          {arrangements.map((arrangement, index) => (
            <ArrangementInput
              key={index}
              arrangement={arrangement}
              index={index}
              onChange={(idx, field, value) => {
                const updatedArrangements = [...arrangements];
                updatedArrangements[idx][field] = value;
                setArrangements(updatedArrangements);
              }}
            />
          ))}
        </ScrollView>
      </View>
    </Pozadina>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, alignSelf: "center", width: "90%", paddingTop: 20, maxHeight: '80%', maxWidth: '70%' },
  title: { fontSize: 48, fontFamily: 'Alex Brush', color: "#e8c789", marginBottom: 20 },
  subtitleContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  subtitle: { fontSize: 30, color: "#e8c789" , fontFamily: 'Alex Brush', },
  buttonGroup: { flexDirection: "row" },
  scrollView: { maxHeight: 500 , },
  addButton: { backgroundColor: "#e8c789", fontFamily: 'Monotype Corsiva', padding: 10, borderRadius: 5, marginLeft: 10 },
  addButtonText: { fontFamily: 'Monotype Corsiva', fontSize: 24, },
  saveButtonText: { fontFamily: 'Monotype Corsiva', fontSize: 24, },
  saveButton: { backgroundColor: "#e8c789", fontFamily: 'Monotype Corsiva', padding: 10, borderRadius: 5, marginLeft: 10 },
  input: { borderWidth: 1, marginLeft: 25, borderColor: "#e8c789", maxWidth: '80%', padding: 10, fontSize: 20, marginVertical: 10, borderRadius: 5, color: '#e8c789' , fontFamily: 'Monotype Corsiva', },
});

export default EditPartner;
