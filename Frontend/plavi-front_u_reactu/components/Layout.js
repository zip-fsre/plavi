import React from 'react';
import { View, StyleSheet } from 'react-native';
import HoverButton from './ui/Button';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { usePage } from '../Routes';
import CreateReport from './Reports/CreateReport';
import ViewReport from './Reports/ViewReport';
import EditReport from './Reports/EditReport';
import ReportsPage from './Reports/ReportsPage';

const Stack = createStackNavigator();

const Layout = () => {
    const {currentPage, setCurrentPage, pages} = usePage();

  return (
    <View style={styles.container}>
        <NavigationContainer>
              <Stack.Navigator>
                  <Stack.Screen
                      name={'page'}
                      component={currentPage.component}
                      options={currentPage.options}
                  />
            </Stack.Navigator>
        </NavigationContainer>
    


      <View style={styles.menu}>
        <HoverButton title="Početna" onPress={() => setCurrentPage(pages['Home'])} />
        <HoverButton title="Popis događaja" onPress={() => setCurrentPage(pages['Events'])} />
        <HoverButton title="Stvori događaj" onPress={() => setCurrentPage(pages['createEvent'])} />
        <HoverButton title="Partneri" onPress={() => setCurrentPage(pages['Partners'])}/>
        <HoverButton title="Izvješća" onPress={() => setCurrentPage(pages['Reports'])} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: '#e8c789',
    fontFamily: 'Palace Script MT',
    fontSize: 140,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
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
export default Layout;
