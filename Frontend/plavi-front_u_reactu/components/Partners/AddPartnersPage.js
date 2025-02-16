import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import Pozadina from "../ui/Pozadina";
import { usePage } from "../../Routes";
import Icon from "react-native-vector-icons/MaterialIcons"; 

const BASE_URL = "http://localhost:5149/api"; // URL backend-a

const ArrangementInput = ({ arrangement, index, onChange, onDelete }) => (
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
      <View style={styles.priceAndDeleteContainer}>
        <TextInput
          style={[styles.input, styles.priceInput]}
          placeholder="Cijena aranžmana"
          placeholderTextColor="#ccc"
          value={arrangement.cijena}
          onChangeText={(text) => onChange(index, "cijena", text)}
          keyboardType="numeric"
        />
        {/* Gumb za brisanje pored cijene */}
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(index)}>
          <Icon name="delete" size={24} color="#d9534f" />
        </TouchableOpacity>
      </View>
    </View>
);

export const AddPartner = () => {
  const { currentPage, pages, setCurrentPage } = usePage();
  const [newPartner, setNewPartner] = useState({
    naziv: "",
    vrsta: "",
    napomena: "",
    provizija: "",
  });
  
  const { template, templateAranzmani, partnerId } = currentPage;

  const [arrangements, setArrangements] = useState([{ naziv: "", opis: "", cijena: "" }]);

  useEffect(() => {
    if(partnerId){
      fetchPartnerData();
    }
    else if(template){
      setNewPartner(template);
      setArrangements(templateAranzmani);
    }
  }, []);

  const fetchPartnerData = async () => {
    const response = await fetch(`http://localhost:5149/api/Partneri/${partnerId}`);
    const data = await response.json();

    setNewPartner({naziv: data.naziv, vrsta: data.tip, napomena: data.napomena, provizija: data.provizija});
    fetchAranzmaniData();
  }

  const fetchAranzmaniData = async () => {
    const response = await fetch(`http://localhost:5149/api/Partneri/Aranzmani/${partnerId}`);
    const data = await response.json();

    const aranzmen = data.map(aranzman => ({
      naziv: aranzman.naziv,
      opis: aranzman.opis,
      cijena: aranzman.cijena
    }));
    setArrangements(aranzmen);
  }

  // Funkcija koja prvo dodaje partnera, zatim aranžmane koji mu pripadaju
  const handleCreatePartner = async () => {
    if (!newPartner.naziv || !newPartner.vrsta || !newPartner.napomena || !newPartner.provizija) {
      Alert.alert("Greška", "Molimo ispunite sva polja!");
      return;
    }

    try {
      // Prvo dodajemo partnera
      const partnerResponse = await fetch(`${BASE_URL}/Partneri`, {
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
          await fetch(`${BASE_URL}/Aranzman`, {
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

  const handleDeleteArrangement = async (index) => {
    console.log("Pokušaj brisanja aranžmana s indexom:", index);
  
    const aranzmanZaBrisanje = arrangements[index];
  
    if (!aranzmanZaBrisanje) {
      console.error("Greška: Aranžman na ovom indexu ne postoji!");
      return;
    }
  
    if (aranzmanZaBrisanje.id) {
      try {
        console.log(`Šaljem DELETE zahtjev za ID: ${aranzmanZaBrisanje.id}`);
        const response = await fetch(`${BASE_URL}/Aranzman/${aranzmanZaBrisanje.id}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          throw new Error("Greška pri brisanju aranžmana iz baze.");
        }
  
        console.log(`Aranžman ID ${aranzmanZaBrisanje.id} uspješno obrisan iz baze.`);
      } catch (error) {
        console.error("Greška pri brisanju aranžmana:", error);
        return;
      }
    }
  
    const updatedArrangements = arrangements.filter((_, i) => i !== index);
    console.log("Novo stanje aranžmana nakon brisanja:", updatedArrangements);
    setArrangements(updatedArrangements);
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
              onDelete={handleDeleteArrangement} 
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
  deleteButton: {
    marginLeft: 10, 
  },
  arrangementContainer: {
    flexDirection: "column",
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e8c789",
    borderRadius: 5,
  },
  priceAndDeleteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceInput: {
    flex: 1, 
  },
});

export default AddPartner;
