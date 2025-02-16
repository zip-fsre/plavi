import React from "react";
import HoverButton from "../ui/Button";
import Pozadina from '../ui/Pozadina';
import { usePage } from '../../Routes';
import { View, StyleSheet } from "react-native";

const EventsPickScreen = () => {
    const { currentPage, setCurrentPage, pages } = usePage();
    
    return(
        <Pozadina>
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                   
                        <HoverButton 
                         title="Napravi događaj iz predložka"
                         style={styles.button}
                         height={'90%'}
                         width={'48%'}
                         fontSize={30}
                         onPress={() => setCurrentPage(pages['EventTemplates'])}>
                        </HoverButton>
                    
                        <HoverButton 
                         title="Prazan događaj" 
                         height={'90%'}
                         width={'48%'}
                         fontSize={30}
                         onPress={() => setCurrentPage(pages['createEvent'])}
                         style={styles.button}>
                        </HoverButton>
                    
                </View>
                <View style={styles.buttonContainer}>
                    
                        <HoverButton 
                         title="Napravi događaj iz već postojećeg"
                         style={styles.button} 
                         height={'90%'} 
                         width={'48%'}
                         fontSize={30}
                         onPress={() => setCurrentPage(pages['ExistingEvents'])}>
                        </HoverButton>
                    
                        <HoverButton 
                         title="Import iz Excela" 
                         style={styles.button} 
                         height={'90%'} 
                         width={'48%'}
                         fontSize={30}
                         onPress={() => setCurrentPage(pages['EventExcel'])}>
                        </HoverButton>
                    
                </View>
            </View>
        </Pozadina>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        height:'100%',
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        width:'50%',
        height:300,
        
    },
    button: {
        width: "100%", // Osigurava da gumb zauzme puni prostor unutar `buttonWrapper`
        height: "100%", // Povećana visina
        justifyContent: "center", // Centriranje sadržaja vertikalno
        alignItems: "center", 
    },

});
export default EventsPickScreen;