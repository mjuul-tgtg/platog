import * as React from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView , TouchableOpacity} from 'react-native';
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

                    <Text style={styles.infoText}>Courts near you</Text>
                    <ViewCourtsView enableMapView={enableMapView} currentLocation={currentLocation}/>

                    <TouchableOpacity
                        style={styles.screenButton}
                        onPress={this.changeView}
                        underlayColor='#fff'>
                        <Text style={styles.buttonText}>{enableMapViewButtonText}</Text>
                    </TouchableOpacity>


                </View>
            );



    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ffffff',
        padding: 0,
    },
    map: { flex: 1 },
    infoBox: {
        height: 100,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    infoText: {
        fontSize: 30,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#008340'
    },
    changeView:{
        backgroundColor: 'red'
    },
    screenButton:{
        marginRight:40,
        marginLeft:40,
        marginBottom:10,
        marginTop:10,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#008340',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    buttonText:{
        color:'#fff',
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10,
        fontSize: 20
    }
});
