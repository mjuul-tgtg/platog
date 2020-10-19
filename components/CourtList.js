import * as React from 'react';
import {View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import firebase from 'firebase';
import CourtListItem from "./CourtListItem";
import * as Location from "expo-location";
import {getDistance} from "geolib";
import Constants from "expo-constants";
import CourtMap from "./CourtMap";
import * as Permissions from "expo-permissions";

export default class CourtList extends React.Component {
    state = {
        courts: {},
        currentLocation: null,
        courtsSorted: false,
        hasLocationPermission: null
    };


    getLocationPermission = async () => {
        const {status} = await Permissions.askAsync(Permissions.LOCATION);
        this.setState({hasLocationPermission: status});
    };

    componentDidMount = async () => {

        const {currentLocation} = this.state;

        this.setState({courtsSorted: false})

        await this.getCourtsFromFirebase();

        await this.getLocationPermission();

        if (currentLocation == null) {
            await this.updateLocation();
            await this.calculateDistances()
        }
    };

    getCourtsFromFirebase = async () => {
        await firebase
            .database()
            .ref('/courts')
            .once('value', snapshot => {
                this.setState({courts: snapshot.val()});
            });
    }

    handleSelectCourt = id => {
        this.props.navigation.navigate('CourtDetails', {id});
    };


    changeToMapView = () => {
        this.props.navigation.navigate('CourtMap');
    }

    updateLocation = async () => {
        const {coords} = await Location.getCurrentPositionAsync();
        await this.setState({currentLocation: coords, courtsSorted: false})
        await this.getCourtsFromFirebase();
        this.calculateDistances();
    };

    //https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
    dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            /* next line works with strings and numbers,
             * and you may want to customize it to your needs
             */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    calculateDistances = () => {

        const {courts, currentLocation} = this.state;

        const courtArray = Object.values(courts)
        const courtKeys = Object.keys(courts);

        let loopCount = 0;
        courtArray.forEach(court => {
            try {
                let dis = getDistance(
                    {latitude: court.latitude, longitude: court.longitude},
                    {latitude: currentLocation.latitude, longitude: currentLocation.longitude},
                );
                court.distance = dis
                court.key = courtKeys[loopCount]
            } catch (e) {
                court.key = courtKeys[loopCount]
                court.distance = "Could not calculate distance"
            }

            loopCount = loopCount + 1

        })

        if (loopCount > 0) {
            courtArray.sort(this.dynamicSort("distance"))
            this.setState({
                courts: courtArray,
                courtsSorted: true
            })
        }

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


    render() {

        const {courts, courtsSorted} = this.state;

        // Vi viser ingenting hvis der ikke findes nogen courts
        if (!courts) {
            return (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Could not find any courts</Text>
                </View>)
        }


        // Vi viser "loading" hvis courts ikke er blevet sortered endnu

        if (!courtsSorted) {
            return (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Finding courts near you...</Text>
                    <ActivityIndicator size="large" color="#008340"/>
                </View>
            )
        }


        // Flatlist forventer et array. Derfor tager vi alle values fra vores cars objekt, og bruger som array til listen
        const courtArray = Object.values(courts);
        // Vi skal også bruge alle IDer, så vi tager alle keys også.
        const courtKeys = Object.keys(courts);

        if (courts && courtsSorted) {

            return (
                <View style={styles.container}>

                    <Text style={styles.infoText}>Courts near you</Text>

                    {this.renderCurrentLocation()}


                    <View style={styles.containerFlatList}>
                        <FlatList
                            windowSize={21}
                            data={courtArray}
                            // Vi bruger courtKeys til at finde ID på den aktuelle bil og returnerer dette som key, og giver det med som ID til CarListItem
                            keyExtractor={(item, index) => courtKeys[index]}
                            renderItem={({item, index}) => (
                                <CourtListItem
                                    court={item}
                                    id={item.key}
                                    onSelect={this.handleSelectCourt}
                                />
                            )}
                        />
                    </View>


                    <TouchableOpacity
                        style={styles.screenButton}
                        onPress={this.changeToMapView}
                        underlayColor='#fff'>
                        <Text style={styles.buttonText}>Change to MapView</Text>
                    </TouchableOpacity>

                </View>
            );
        }


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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerFlatList: {
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        padding: 0,
        flex: 1
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
    loadingText: {
        fontSize: 30,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#008340'
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
        backgroundColor: '#008340',
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
    }
});