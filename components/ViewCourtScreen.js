import * as React from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView } from 'react-native';
import Constants from 'expo-constants';
import ViewCourtsView from "./ViewCourtsView";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

export default class ViewCourtScreen extends React.Component {
    state = {
        enableMapView: false,
        enableMapViewButtonText:"Change to Map view",
        hasLocationPermission: null,
        currentLocation: null,
    };

    getLocationPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        this.setState({ hasLocationPermission: status });
    };

    componentDidMount = async () => {
        await this.getLocationPermission();
        await this.updateLocation();
    };

    updateLocation = async () => {
        const { coords } = await Location.getCurrentPositionAsync();
        this.setState({ currentLocation: coords });
    };


    changeView = () => {

        let enableMapView = !this.state.enableMapView
        let enableMapViewButtonText = "Change to Map view"
        if(enableMapView){
            enableMapViewButtonText = "Change to List view"
        }

        this.setState({enableMapView: enableMapView,
            enableMapViewButtonText: enableMapViewButtonText})

    };


    render() {
        const {
            enableMapView,
            enableMapViewButtonText,
            currentLocation
        } = this.state;

            return (
                <View style={styles.container}>

                    <Text style={styles.infoText}>Find a court near you!</Text>
                    <ViewCourtsView enableMapView={enableMapView} currentLocation={currentLocation}/>
                    <Button style={styles.changeView} title={enableMapViewButtonText} onPress={this.changeView} />

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
    map: { flex: 1 },
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
    },
    infoText: {
        fontSize: 30,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 10
    },
    changeView:{
        backgroundColor:'red',
        color:'yellow'
    }
});
