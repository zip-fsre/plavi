import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { usePage } from '../../Routes';

const Report = ({id, naziv, opis, onDelete }) => {
  const { setCurrentPage, pages } = usePage();
  const [modalVisible, setModalVisible] = useState(false); // Kontrola modala

  const handlePressInfo = () => {
    console.log('id:', id);
    setCurrentPage({ ...pages['ViewReport'], reportId: id });
  };
  const handlePressEdit = () => {
    console.log('id:', id);
    setCurrentPage({ ...pages['EditReport'], reportId: id });
  };
  const handlePressDelete = async () => {
    console.log('Brisanje izvješća sa ID-om:', id);
  
    try {
      // Brisanje povezanih MedjutablicaPt2
      const deleteMedjutablicaResponse = await fetch(`http://localhost:5149/api/Izvjesce/Podaci/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (!deleteMedjutablicaResponse.ok) {
        console.error("Greška pri brisanju povezanih MedjutablicaPt2!");
        alert("Došlo je do pogreške pri brisanju podataka.");
        return;
      }
  
      console.log("Povezani podaci (MedjutablicaPt2) uspješno obrisani!");
  
      // Brisanje izvješća
      const deleteIzvjesceResponse = await fetch(`http://localhost:5149/api/Izvjesce/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
  
      // Provjeri status prije nego što pokušaš parsirati
      if (!deleteIzvjesceResponse.ok) {
        console.error("Greška pri brisanju izvješća!");
        alert("Došlo je do pogreške pri brisanju izvješća.");
        setModalVisible(false);
        return;
      } 

      console.log("Izvjesce uspjesno obrisano");
    
        
      alert("Izvješće i povezani podaci uspješno obrisani!");
  setModalVisible(false);
  onDelete(id);

} catch (error) {
  console.error("Greška prilikom brisanja:", error);
  alert("Dogodila se greška pri brisanju izvješća.");
  setModalVisible(false);
};
}

  
  return (
    <View style={styles.report}>
        <View style={styles.spacer}/>
        <View style={styles.item}>
            <View style={styles.textBox}>
            <Text style={styles.title}>{naziv}</Text>
            <Text style={styles.title}>{opis}</Text>
            </View>
             <View style={styles.iconContainer}>
                <TouchableOpacity onPress={handlePressInfo}>
                  <Icon name="info" size={24} color="#e8c789" style={styles.viewIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePressEdit}>
                  <Icon name="edit" size={24} color="#e8c789" style={styles.editIcon} />
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => setModalVisible(true)}>
                  <Icon name="delete" size={24} color="#e8c789" style={styles.deleteIcon} />
                </TouchableOpacity>
              </View>
        </View>
        <View style={styles.spacer}/>

        <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Jeste li sigurni da želite obrisati izvješće "{naziv}"?
            </Text>
            <View style={styles.modalButtons}>
              <Button title="Odustani" onPress={() => setModalVisible(false)} color="gray" />
              <Button title="Da, obriši" onPress={handlePressDelete} color="red" />
            </View>
          </View>
        </View>
      </Modal>


    </View>
  );
};


export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
   
  },
  report: {
    maxWidth: '60%',
    minWidth: '50%',
   
  },
  spacer: {
    height: 15,
  },
  textBox: {
    minWidth: 400,
    maxWidth: 400,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    gap: 50,
  
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 120,
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Monotype Corsiva',
    textAlign: 'left',
    fontSize: 21,
  },
  description: {
    color: '#e8c789',
    fontSize: 18,
    fontFamily: 'Monotype Corsiva',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  menu: {
    position: 'absolute',
    flex: 1,
    bottom: 15,
    left: '5%',
    width: '90%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" ,
  },
  modalContent: { 
    backgroundColor: "white", 
    padding: 20, 
    borderRadius: 10, 
    width: "50%", 
    alignItems: "center",
   },
  modalText: { 
    fontSize: 18,
     marginBottom: 30, 
     textAlign: "center" 
    },
  modalButtons: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "70%",
    bottom: 10,
  },

}); 