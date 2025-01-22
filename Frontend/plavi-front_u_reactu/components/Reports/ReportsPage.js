import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Pozadina from '../ui/Pozadina';
import HoverButton from '../ui/Button';
import '../ui/scrollbar.css';

const ReportsPage = ({ navigation }) => {
  return (
    <Pozadina >
    <View style={styles.container}>

        <Text style={styles.title}>Izvješća</Text>
      
      {/* Gumb za kreiranje izvješća */}
      <View style={styles.createButtonContainer}>
        <HoverButton 
          title="Kreiraj izvješće" 
          onPress={() => navigation.navigate('CreateReport')}
        />
      </View>
     
      {/* Lista recent reports */}

      <ScrollView style={styles.reportsList} >
        <Text style={styles.reportsTitle}>Nedavna izvješća:</Text>
        {[...Array(12)].map((_, index) => (
          <View key={index} style={styles.reportContainer}>
            <Text style={styles.reportText}>Izvješće {index + 1}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
    </Pozadina>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    alignSelf: 'center',
    width:'100%',
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Monotype Corsiva',
    fontSize: 100,
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 20,
  },
  createButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  reportsList: {
    flex: 1,
    maxHeight:400,
    paddingHorizontal: 15,
    width: '100%',
    overflowY: 'scroll',
  },
  reportsTitle: {
    fontSize: 25,
    color: '#e8c789',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    width: '100%',
    fontFamily: 'Monotype Corsiva',
  },
  reportContainer: {
    backgroundColor: '#405352',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '60%',
    alignSelf: 'center',
  },
  reportText: {
    fontSize: 15,
    color: '#e8c789',
    fontFamily: 'Helvetica',
  },
});

export default ReportsPage;

