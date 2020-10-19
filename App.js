import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import {AntDesign} from '@expo/vector-icons';
import AddCourt from "./components/AddCourt";
import firebase from "firebase";
import {createStackNavigator} from "react-navigation-stack";
import CourtList from "./components/CourtList";
import CourtDetails from "./components/CourtDetails";
import CourtMap from "./components/CourtMap";

const StackNavigator = createStackNavigator(
    {
        CourtList: {
            screen: CourtList,
            navigationOptions:
                {
                    title: "List View",
                    headerShown: false
                }
        },
        CourtMap: {
            screen: CourtMap,
            navigationOptions:
                {
                    title: "Map View",
                    headerShown: false
                }
        },
        CourtDetails: {
            screen: CourtDetails,
            navigationOptions:
                {title: "Details"}
        },
    },
    {
        initialRouteKey: 'CourtList',
        defaultNavigationOptions: {
            cardStyle: {backgroundColor: '#FFFFFF'},
        }
    },
);

const viewCourtsContainer = createAppContainer(StackNavigator);


const TabNavigator = createBottomTabNavigator({
    Main: {
        screen: viewCourtsContainer,
        navigationOptions: {
            tabBarLabel: "View Courts",
            tabBarIcon: ({tintColor}) => (
                <AntDesign name="find" size={24} color={tintColor}/>
            )
        },
    },
    Add: {
        screen: AddCourt,
        navigationOptions: {
            tabBarLabel: "Add Court",
            tabBarIcon: ({tintColor}) => (
                <AntDesign name="plus" size={24} color={tintColor}/>
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

        // Vi tjekker om firebase allerde er initialised
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
    }

    render() {
        return <AppContainer/>;
    }
}
