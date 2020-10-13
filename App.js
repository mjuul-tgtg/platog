import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';
import AddCourt from "./components/AddCourt";
import ViewCourtScreen from "./components/ViewCourtScreen";
import firebase from "firebase";


const TabNavigator = createBottomTabNavigator({
  Main: {screen: ViewCourtScreen,
    navigationOptions: {
      tabBarLabel:"View Courts",
      tabBarIcon: ({ tintColor }) => (
          <AntDesign name="user" size={24} color={tintColor} />
      )
    },
  },
  Add: {screen: AddCourt,
    navigationOptions: {
      tabBarLabel:"Add Court",
      tabBarIcon: ({ tintColor }) => (
          <AntDesign name="google" size={24} color={tintColor} />
      )
    },
  },
});

const AppContainer = createAppContainer(TabNavigator);


export default class App extends React.Component {

  UNSAFE_componentWillMount() {
    const firebaseConfig = {
      apiKey: "AIzaSyCt6-pIcZZrU3xSu47IZPKMPxpQ12FzkTk",
      authDomain: "platog-4b3da.firebaseapp.com",
      databaseURL: "https://platog-4b3da.firebaseio.com",
      projectId: "platog-4b3da",
      storageBucket: "platog-4b3da.appspot.com",
      messagingSenderId: "524559785678",
      appId: "1:524559785678:web:7f2f171212ba59ca27fa9f",
      measurementId: "G-F3V1CGE5VL"
    };

    // Vi kontrollerer at der ikke allerede er en initialiseret instans af firebase
    // Så undgår vi fejlen Firebase App named '[DEFAULT]' already exists (app/duplicate-app).
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  render() {
    return <AppContainer/>;
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
