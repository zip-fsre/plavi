import React from "react";
import HoverButton from "../ui/Button";
import Pozadina from '../ui/Pozadina';
import { usePage } from '../../Routes';
import { View, StyleSheet } from "react-native";

const PartnersPickScreen = () => {
    const { currentPage, setCurrentPage, pages } = usePage();
    const handleImport = () =>{
        console.log('Import iz Excela');
    }
    return(
        <Pozadina>
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                   
                        <HoverButton 
                         title="Napravi partnera iz predložka"
                         style={styles.button}
                         height={'90%'}
                         width={'48%'}
                         fontSize={30}
                         onPress={() => setCurrentPage(pages['PartnerTemplates'])}>
                        </HoverButton>
                    
                        <HoverButton 
                         title="Prazan partner" 
                         height={'90%'}
                         width={'48%'}
                         fontSize={30}
                         onPress={() => setCurrentPage(pages['AddPartner'])}
                         style={styles.button}>
                        </HoverButton>
                    
                </View>
                <View style={styles.buttonContainer}>
                    
                        <HoverButton 
                         title="Napravi partnera iz već postojećeg"
                         style={styles.button} 
                         height={'90%'} 
                         width={'48%'}
                         fontSize={30}
                         onPress={() => setCurrentPage(pages['ExistingPartners'])}>
                        </HoverButton>
                    
                        <HoverButton 
                         title="Import iz Excela" 
                         onPress={handleImport} 
                         style={styles.button} 
                         height={'90%'} 
                         width={'48%'}
                         fontSize={30}>
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
export default PartnersPickScreen;