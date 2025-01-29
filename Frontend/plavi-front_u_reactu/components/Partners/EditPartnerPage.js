import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
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

  // **Dohvaćanje partnera i njegovih aranžmana**
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
          provizija: String(data.provizija), // Pretvorba u string za TextInput
        });

        // Dohvaćanje aranžmana za partnera
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

  // **Ažuriranje partnera**
  const handleEditPartner = async () => {
    if (!partner.naziv || !partner.vrsta || !partner.napomena || !partner.provizija) {
      Alert.alert("Greška", "Molimo ispunite sva polja!");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/Partneri/${id}`, {
        method: "PUT", // Koristimo PUT umjesto POST za ažuriranje
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

      // **Ažuriranje aranžmana**
      for (const aranzman of arrangements) {
        if (aranzman.naziv && aranzman.opis && aranzman.cijena) {
          const aranzmanResponse = await fetch(`${BASE_URL}/Aranzmani/${aranzman.id}`, {
            method: "PUT", // PUT za ažuriranje aranžmana
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
      setCurrentPage(pages["Partners"]); // Povratak na stranicu s partnerima
    } catch (error) {
      console.error(error);
      Alert.alert("Greška", "Dogodila se greška pri ažuriranju partnera.");
    }
  };

  // Dodavanje novog aranžmana
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

export default EditPartner;
