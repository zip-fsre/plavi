import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Pozadina from './ui/Pozadina';
import SmallButton from './ui/SmallButton'; 

const PartnersPage = () => {
  const [partners, setPartners] = useState([
    { naziv: 'Prvi partner', vrsta: 'Maneken', opis: 'Nisam ja za ovoga...', cijena: '1000' },
    { naziv: 'Drugi partner', vrsta: 'Sviralo', opis: 'Svira svirku, brine brigu...', cijena: '1500' },
  ]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isViewModalVisible, setViewModalVisible] = useState(false);
  const [currentViewPartner, setCurrentViewPartner] = useState(null);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [newPartner, setNewPartner] = useState({ naziv: '', vrsta: '', opis: '', cijena: '' });
  const [editPartner, setEditPartner] = useState({ naziv: '', vrsta: '', opis: '', cijena: '' });

  const handleAddPartner = () => {
    setModalVisible(true);
  };

  const handleCreatePartner = () => {
    if (newPartner.naziv && newPartner.vrsta && newPartner.opis && newPartner.cijena) {
      setPartners([...partners, newPartner]);
      setNewPartner({ naziv: '', vrsta: '', opis: '', cijena: '' });
      setModalVisible(false);
    } else {
      alert('Molimo ispunite sva polja!');
    }
  };

  const handleDeletePartner = (index) => {
    const updatedPartners = partners.filter((_, i) => i !== index);
    setPartners(updatedPartners);
  };

  const handleEditPartner = (index) => {
    setCurrentEditIndex(index);
    setEditPartner(partners[index]);
    setEditModalVisible(true);
  };

  const handleSaveEditPartner = () => {
    if (editPartner.naziv && editPartner.vrsta && editPartner.opis && editPartner.cijena) {
      const updatedPartners = partners.map((partner, index) => (
        index === currentEditIndex ? editPartner : partner
      ));
      setPartners(updatedPartners);
      setEditModalVisible(false);
      setCurrentEditIndex(null);
    } else {
      alert('Molimo ispunite sva polja!');
    }
  };

  const handleViewPartner = (partner) => {
    setCurrentViewPartner(partner);
    setViewModalVisible(true);
  };

  return (
    <Pozadina>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Partneri</Text>
          <SmallButton title="Novi" onPress={handleAddPartner} style={styles.newButton} />
        </View>

        <ScrollView style={styles.partneri}>
          {partners.map((partner, index) => (
            <View key={index} style={styles.partnerContainer}>
              <View style={styles.partnerTextContainer}>
                <Text style={styles.partnerName}>{partner.naziv}</Text>
                <Text style={styles.partnerDetails}>{partner.vrsta}</Text>
                <Text style={styles.partnerDetails}>{partner.opis}</Text>
                <Text style={styles.partnerDetails}>Cijena: {partner.cijena} €</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handleViewPartner(partner)}>
                  <Icon name="info" size={24} color="#e8c789" style={styles.viewIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEditPartner(index)}>
                  <Icon name="edit" size={24} color="#e8c789" style={styles.editIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePartner(index)}>
                  <Icon name="delete" size={24} color="#e8c789" style={styles.deleteIcon} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Novi partner</Text>
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
                placeholder="Cijena partnera (€)"
                placeholderTextColor="#ccc"
                value={newPartner.cijena}
                onChangeText={(text) => setNewPartner({ ...newPartner, cijena: text })}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Opis partnera"
                placeholderTextColor="#ccc"
                value={newPartner.opis}
                onChangeText={(text) => setNewPartner({ ...newPartner, opis: text })}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleCreatePartner}>
                <Text style={styles.saveButtonText}>Stvori partnera</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButton}>Odustani</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Uredi partnera</Text>
              <TextInput
                style={styles.input}
                placeholder="Naziv partnera"
                placeholderTextColor="#ccc"
                value={editPartner.naziv}
                onChangeText={(text) => setEditPartner({ ...editPartner, naziv: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Vrsta partnera"
                placeholderTextColor="#ccc"
                value={editPartner.vrsta}
                onChangeText={(text) => setEditPartner({ ...editPartner, vrsta: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Cijena partnera (€)"
                placeholderTextColor="#ccc"
                value={editPartner.cijena}
                onChangeText={(text) => setEditPartner({ ...editPartner, cijena: text })}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Opis partnera"
                placeholderTextColor="#ccc"
                value={editPartner.opis}
                onChangeText={(text) => setEditPartner({ ...editPartner, opis: text })}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveEditPartner}>
                <Text style={styles.saveButtonText}>Spremi promjene</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelButton}>Odustani</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={isViewModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalji partnera</Text>
              {currentViewPartner && (
                <>
                  <Text style={styles.detailText}>Naziv: {currentViewPartner.naziv}</Text>
                  <Text style={styles.detailText}>Vrsta: {currentViewPartner.vrsta}</Text>
                  <Text style={styles.detailText}>Opis: {currentViewPartner.opis}</Text>
                  <Text style={styles.detailText}>Cijena: {currentViewPartner.cijena} €</Text>
                </>
              )}
              <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                <Text style={styles.cancelButton}>Zatvori</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </Pozadina>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '90%',
  },
  partneri: {
    maxHeight: 800,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Monotype Corsiva',
    fontSize: 40,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  newButton: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
  },
  partnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
  },
  partnerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  partnerName: {
    fontSize: 20,
    fontFamily: 'Monotype Corsiva',
    color: '#e8c789',
    marginBottom: 5,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  partnerDetails: {
    fontSize: 16,
    fontFamily: 'Monotype Corsiva',
    color: '#e8c789',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewIcon: {
    marginHorizontal: 5,
  },
  editIcon: {
    marginHorizontal: 5,
  },
  deleteIcon: {
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Monotype Corsiva',
    color: '#e8c789',
    marginBottom: 20,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  detailText: {
    fontSize: 18,
    fontFamily: 'Monotype Corsiva',
    color: '#e8c789',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e8c789',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: '100%',
    fontSize: 16,
    fontFamily: 'Monotype Corsiva',
    color: '#e8c789',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  saveButton: {
    backgroundColor: '#e8c789',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Monotype Corsiva',
  },
  cancelButton: {
    color: '#e8c789',
    fontSize: 16,
    fontFamily: 'Monotype Corsiva',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default PartnersPage;
