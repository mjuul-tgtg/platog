import * as React from 'react';
import {Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator} from 'react-native';
import Constants from 'expo-constants';
import MapView, {Marker} from 'react-native-maps';
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
        readyToRender: false
    };

    getLocationPermission = async () => {
        const {status} = await Permissions.askAsync(Permissions.LOCATION);
        this.setState({hasLocationPermission: status});
    };

    componentDidMount = async () => {
        await this.getLocationPermission();
        await this.updateLocation();
        await this.addKeyToCourt();
    };

    updateLocation = async () => {
        const {coords} = await Location.getCurrentPositionAsync();
        this.setState({currentLocation: coords});
        const {latitude, longitude} = coords;
        this.mapViewRef &&
        this.mapViewRef.current.animateCamera({
            camera: {center: {latitude, longitude}, zoom: 12, altitude: 100},
            duration: 10,
        });
    };

    addKeyToCourt = () => {
        firebase
            .database()
            .ref('/courts')
            .on('value', snapshot => {
                this.setState({courts: snapshot.val()});

                const courtArray = Object.values(snapshot.val())
                const courtKeys = Object.keys(snapshot.val());

                let loopCount = 0;
                courtArray.forEach(court => {
                    court.key = courtKeys[loopCount]
                    loopCount = loopCount + 1
                })

                if (loopCount > 0) {

                    this.setState({
                        courts: courtArray,
                        readyToRender: true
                    })
                }
            });
    };

    renderCurrentLocation = () => {
        const {hasLocationPermission} = this.state;
        if (hasLocationPermission === null) {
            return null;
        }
        if (hasLocationPermission === false) {
            return <Text>No location access. Go to settings to change</Text>;
        }
        return (
            <View>
                <TouchableOpacity
                    style={styles.screenButtonUpdateLocation}
                    onPress={this.updateLocation}
                    underlayColor='#fff'>
                    <Text style={styles.buttonText}>Update location</Text>
                </TouchableOpacity>
            </View>
        );
    };

    changeToListView = () => {
        this.props.navigation.navigate('CourtList');
    }

    handleSelectCourtMap = id => {
        this.props.navigation.navigate('CourtDetails', {id});
    };

    mapMarkers = () => {
        const {courts} = this.state;
        const courtArray = Object.values(courts)
        return courtArray.map((court) => <Marker
            pinColor={'#008340'}
            key={court.address}
            coordinate={{latitude: court.latitude, longitude: court.longitude}}
            title={court.name}
            //description={court.type}
            onPress={() => this.handleSelectCourtMap(court.key)}
        >
        </Marker>)
    }

    render() {
        const {
            currentLocation,
            readyToRender
        } = this.state;

        console.log(readyToRender)

        if (currentLocation == null) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#008340"/>
                </View>
            )
        }

        if (!readyToRender) {
            return (<SafeAreaView style={styles.container}>

                <Text style={styles.infoText}>Courts near you</Text>

                {this.renderCurrentLocation()}

                <MapView
                    provider="google"
                    style={styles.map}
                    ref={this.mapViewRef}
                    showsUserLocation
                    initialRegion={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1
                    }}>
                    {this.mapMarkers()}
                </MapView>

                <TouchableOpacity
                    style={styles.screenButton}
                    onPress={this.changeToListView}
                    underlayColor='#fff'>
                    <Text style={styles.buttonText}>Change to ListView</Text>
                </TouchableOpacity>
            </SafeAreaView>)
        }

        return (<SafeAreaView style={styles.container}>

                <Text style={styles.infoText}>Courts near you</Text>
                {this.renderCurrentLocation()}

                <MapView
                    provider="google"
                    style={styles.map}
                    ref={this.mapViewRef}
                    showsUserLocation
                    initialRegion={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1
                    }}>
                    {this.mapMarkers()}
                </MapView>

                <TouchableOpacity
                    style={styles.screenButton}
                    onPress={this.changeToListView}
                    underlayColor='#fff'>
                    <Text style={styles.buttonText}>Change to ListView</Text>
                </TouchableOpacity>
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
    },
    infoText: {
        fontSize: 30,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 20,
        paddingBottom: 5,
        color: '#008340'
    },
    screenButton: {
        marginRight: 40,
        marginLeft: 40,
        marginBottom: 10,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#ff8340',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    screenButtonUpdateLocation: {
        marginRight: 40,
        marginLeft: 40,
        marginBottom: 10,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#ff8340',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 20
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
