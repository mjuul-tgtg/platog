import * as React from 'react';
import {Text, View, StyleSheet, Button, SafeAreaView, FlatList, TouchableOpacity} from 'react-native';
import Constants from 'expo-constants';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import firebase from "firebase";

export default class CourtMap extends React.Component {
    mapViewRef = React.createRef();

    state = {
        hasLocationPermission: null,
        currentLocation: null,
        userMarkerCoordinates: [],
        selectedCoordinate: null,
        selectedAddress: null,
        courts: {},
    };

    getLocationPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        this.setState({ hasLocationPermission: status });
    };

    componentDidMount = async () => {
        firebase
            .database()
            .ref('/courts')
            .on('value', snapshot => {
                this.setState({ courts: snapshot.val() });
            });
        await this.getLocationPermission();
        await this.updateLocation();
    };

    updateLocation = async () => {
        const { coords } = await Location.getCurrentPositionAsync();
        this.setState({ currentLocation: coords });
        const { latitude, longitude } = coords;
        this.mapViewRef &&
        this.mapViewRef.current.animateCamera({
            camera: { center: { latitude, longitude }, zoom: 12, altitude: 100 },
            duration: 10,
        });
    };

    handleLongPress = event => {
        const { coordinate } = event.nativeEvent;
        this.setState(prevState => {
            return {
                userMarkerCoordinates: [...prevState.userMarkerCoordinates, coordinate],
            };
        });
    };

    handleSelectMarker = coordinate => {
        this.setState({ selectedCoordinate: coordinate });
        this.findAddress(coordinate);
    };

    findAddress = async coordinate => {
        const [selectedAddress] = await Location.reverseGeocodeAsync(coordinate);
        this.setState({ selectedAddress });
    };

    closeInfoBox = () =>
        this.setState({ selectedCoordinate: null, selectedAddress: null });

    renderCurrentLocation = () => {
        const { hasLocationPermission, currentLocation } = this.state;
        if (hasLocationPermission === null) {
            return null;
        }
        if (hasLocationPermission === false) {
            return <Text>No location access. Go to settings to change</Text>;
        }
        return (
            <View>
                <TouchableOpacity
                    style={styles.screenButton}
                    onPress={this.updateLocation}
                    underlayColor='#fff'>
                    <Text style={styles.buttonText}>Update location</Text>
                </TouchableOpacity>
            </View>
        );
    };


    mapMarkers = () => {

        const { courts } = this.state;
        const courtArray = Object.values(courts)
        return courtArray.map((court) => <Marker
            pinColor={'#008340'}
            key={court.address}
            coordinate={{ latitude: court.latitude, longitude: court.longitude }}
            title={court.name}
            description={court.type}/>)
    }

    render() {
        const {
            userMarkerCoordinates,
            selectedCoordinate,
            selectedAddress,
        } = this.state;


        return (
            <SafeAreaView style={styles.container}>
                {this.renderCurrentLocation()}

                <MapView
                    provider="google"
                    style={styles.map}
                    ref={this.mapViewRef}
                    showsUserLocation
                    onLongPress={this.handleLongPress}
                    initialRegion={{
                    latitude: 55.7,
                    longitude: 12.55,
                    latitudeDelta: 0.22,
                    longitudeDelta: 0.22}}>
                    {this.mapMarkers()}
                    {userMarkerCoordinates.map((coordinate, index) => (
                        <Marker
                            coordinate={coordinate}
                            key={index.toString()}
                            onPress={() => this.handleSelectMarker(coordinate)}
                        />
                    ))}
                </MapView>



                {selectedCoordinate && (
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            {selectedCoordinate.latitude}, {selectedCoordinate.longitude}
                        </Text>
                        {selectedAddress && (
                            <Text style={styles.infoText}>
                                {selectedAddress.name} {selectedAddress.postalCode}
                            </Text>
                        )}
                        <Button title="close" onPress={this.closeInfoBox} />
                    </View>
                )}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#FFFFFF',
        padding: 8,
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
        fontSize: 20,
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
