import * as React from 'react';
import {Text, View, StyleSheet, Button, SafeAreaView} from 'react-native';
import Constants from 'expo-constants';
import CourtMap from "./CourtMap";
import CourtList from "./CourtList";
import {createStackNavigator} from "react-navigation-stack";
import ViewCourtScreen from "./ViewCourtScreen";
import CourtDetails from "./CourtDetails";
import {createAppContainer} from 'react-navigation';

const ListStackNavigator = createStackNavigator(
    {
        CourtList: {
            screen: CourtList,
            navigationOptions:
                {title: "Courts"}
        },
        CourtDetails: {screen: CourtDetails,
            navigationOptions:
                {title: "Details"}
        },
    },
    {initialRouteKey: 'CourtList'},
);

const ListContainer = createAppContainer(ListStackNavigator);

export default class ViewCourtsView extends React.Component {
    state = {};


    render() {

        const {enableMapView} = this.props

        if (enableMapView) {
            return (
                <View style={styles.container}>
                    <CourtMap/>

                </View>
            );
        }
        return (
            <View style={styles.container}>
                <ListContainer/>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 0,
    },
    map: {flex: 1},
    infoBox: {
        height: 100,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    }
});
