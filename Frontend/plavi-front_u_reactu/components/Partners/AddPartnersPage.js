import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import Pozadina from "../ui/Pozadina";
import { usePage } from "../../Routes";

const BASE_URL = "http://localhost:5149/api/Partneri"; // URL backend-a

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

export const AddPartner = () => {
  const { pages, setCurrentPage } = usePage();
  const [newPartner, setNewPartner] = useState({
    naziv: "",
    vrsta: "",
    napomena: "",
    provizija: "",
  });

  const [arrangements, setArrangements] = useState([{ naziv: "", opis: "", cijena: "" }]);

  // Funkcija koja prvo dodaje partnera, zatim aranžmane koji mu pripadaju
  const handleCreatePartner = async () => {
    if (!newPartner.naziv || !newPartner.vrsta || !newPartner.napomena || !newPartner.provizija) {
      Alert.alert("Greška", "Molimo ispunite sva polja!");
      return;
    }

    try {
      // Prvo dodajemo partnera
      const partnerResponse = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Naziv: newPartner.naziv,
          Tip: newPartner.vrsta,
          Napomena: newPartner.napomena,
          Provizija: parseFloat(newPartner.provizija),
        }),
      });

      if (!partnerResponse.ok) {
        throw new Error("Neuspješno dodavanje partnera!");
      }

      const partnerData = await partnerResponse.json();
      const partnerId = partnerData.id; // Dobijemo ID partnera iz odgovora

      // Sada dodajemo aranžmane povezane s ovim partnerom
      for (let arrangement of arrangements) {
        if (arrangement.naziv && arrangement.opis && arrangement.cijena) {
          await fetch(`${BASE_URL}/Aranzmani`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Naziv: arrangement.naziv,
              Opis: arrangement.opis,
              Cijena: parseFloat(arrangement.cijena),
              IdPartnera: partnerId, // Vežemo aranžman za kreiranog partnera
            }),
          });
        }
      }

      Alert.alert("Uspjeh", "Partner i aranžmani su uspješno dodani!");
      setCurrentPage(pages["Partners"]); // Povratak na stranicu s partnerima
    } catch (error) {
      console.error(error);
      Alert.alert("Greška", "Dogodila se greška pri dodavanju partnera i aranžmana.");
    }
  };

  const handleAddArrangement = () => {
    setArrangements([...arrangements, { naziv: "", opis: "", cijena: "" }]);
  };

  return (
    <Pozadina>
      <View style={styles.container}>
        <Text style={styles.title}>Novi partner</Text>
        <ScrollView style={styles.scrollView}>
          <TextInput
            style={styles.input}
            placeholder="Naziv partnera"
            placeholderTextColor="#ccc"
            value={newPartner.naziv}
            onChangeText={(text) => setNewPartner({ ...newPartner, naziv: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Vrsta partnera"
            placeholderTextColor="#ccc"
            value={newPartner.vrsta}
            onChangeText={(text) => setNewPartner({ ...newPartner, vrsta: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Provizija partnera"
            placeholderTextColor="#ccc"
            value={newPartner.provizija}
            onChangeText={(text) => setNewPartner({ ...newPartner, provizija: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Napomena"
            placeholderTextColor="#ccc"
            value={newPartner.napomena}
            onChangeText={(text) => setNewPartner({ ...newPartner, napomena: text })}
          />

          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Aranžmani</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddArrangement}>
                <Text style={styles.addButtonText}>+ Dodaj aranžman</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleCreatePartner}>
                <Text style={styles.saveButtonText}>Stvori partnera</Text>
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
  container: { flex: 1, alignSelf: "center", width: "90%", paddingTop: 20 },
  title: { fontSize: 48, color: "#e8c789", marginBottom: 20 },
  subtitleContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  subtitle: { fontSize: 30, color: "#e8c789" },
  buttonGroup: { flexDirection: "row" },
  addButton: { backgroundColor: "#e8c789", padding: 10, borderRadius: 5, marginLeft: 10 },
  saveButton: { backgroundColor: "#e8c789", padding: 10, borderRadius: 5, marginLeft: 10 },
  input: { borderWidth: 1, borderColor: "#e8c789", padding: 10, marginVertical: 10, borderRadius: 5 },
});

export default AddPartner;
