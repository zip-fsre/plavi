import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { usePage } from '../../Routes';

const Event = ({id, vrsta, naziv, opis, datum }) => {
  const { currentPage, setCurrentPage, pages } = usePage();
  const handlePress = () => {
    // Navigiraj na 'ViewReport' i proslijedi reportId
    console.log('id:', id);
    setCurrentPage({ ...pages['ViewReport'], reportId: id });
  };
  return (
    <View style={styles.report}>
        <View style={styles.spacer}/>
        <Text style={styles.title}>{datum}</Text>
        <View style={styles.item}>
            <View style={styles.textBox}>
            <Text style={styles.title}>{vrsta} | {naziv}</Text>
            <Text style={styles.title}>{opis}</Text>
            </View>
            <TouchableOpacity onPress={handlePress}>
                <Image style={styles.image} source={{uri: 'https://cdn-icons-png.freepik.com/256/9373/9373528.png'}}/>
            </TouchableOpacity>
        </View>
        <View style={styles.spacer}/>
    </View>
  );
};


export default Event;

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
  image: {
    height: 30,
    width: 30,
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
});
