import react from "react"
import Pozadina from "./ui/Pozadina";
import { View, StyleSheet, Text } from "react-native";

const EditEventPage = () => {



    return (
        <Pozadina>
            <View style={styles.container}>
                <Text style={styles.title}>Uredi (ime događaja)</Text> 

            </View>
        </Pozadina>
    );
}

export default EditEventPage;

const styles = new StyleSheet.create({

container:{
    flex: 1,
    alignSelf: 'center',
},
title: {
    color: '#e8c789',
    fontFamily: 'Monotype Corsiva',
    fontSize: 100,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },

})