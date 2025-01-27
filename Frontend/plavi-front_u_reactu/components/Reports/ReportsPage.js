import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Pozadina from '../ui/Pozadina';
import HoverButton from '../ui/Button';
import '../ui/scrollbar.css';
import { usePage } from '../../Routes';
import Report from '../ui/Report'; // Added the missing import for Report

const ReportsPage = () => {
  const { currentPage, setCurrentPage, pages } = usePage();

  return (
    <Pozadina>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Izvješća</Text>
          <HoverButton
            style={styles.createButtonContainer}
            title="Kreiraj izvješće"
            onPress={() => setCurrentPage(pages['CreateReport'])}
          />
        </View>

        <Text style={styles.reportsTitle}>Nedavna izvješća:</Text>
        <ScrollView
          style={styles.reportsList}
          keyboardShouldPersistTaps="handled"
        >
          <Report naziv="Prvo izvješće" opis='siduvgbaoiEFONWPDCNJKbdcso'/>
          <Report naziv="Drugo izvješće" opis='siduvgbaoiEFONWPDCNJKbdcso' />
          <Report naziv="Treće izvješće" opis='siduvgbaoiEFONWPDCNJKbdcso'/>
          <Report naziv="Četvrto izvješće" opis='siduvgbaoiEFONWPDCNJKbdcso'/>
          <Report naziv="Peto izvješće" opis='siduvgbaoiEFONWPDCNJKbdcso'/>
          <Report naziv="Šesto izvješće" opis='siduvgbaoiEFONWPDCNJKbdcso'/>
        </ScrollView>
      </View>
    </Pozadina>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 190,
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Alex Brush',
    fontSize: 70,
    textAlign: 'left',
    marginBottom: 10,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
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
  image: {
    height: 30,
    width: 30,
  },
  createButtonContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e8c789',
    borderRadius: 10,
  },
  reportsList: {
      maxHeight: '55%',
      marginTop: 25,
  },
  reportsTitle: {
    fontSize: 25,
    color: '#e8c789',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Monotype Corsiva',
  },
});

export default ReportsPage;
