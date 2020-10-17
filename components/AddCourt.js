import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ScrollView,
    SafeAreaView,
    Switch
} from 'react-native';
import firebase from 'firebase';
import MapView, {Marker} from "react-native-maps";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Constants from "expo-constants";
import {TagSelect} from 'react-native-tag-select';

export default class AddCourt extends React.Component {
    state = {
        name: '',
        publicFree: false,
        type: '',
        tags: [],
        hasLocationPermission: null,
        currentLocation: null,
        userMarkerCoordinates: [],
        selectedCoordinate: null,
        selectedAddress: null,
        images: "https://ollocal.com/custom/domain_1/image_files/sitemgr_photo_2958.jpg",
        selectedAddressConfirmed: false
    };


    toggleSwitch = () => {

        const {publicFree} = this.state;

        let newState = !publicFree

        this.setState({publicFree: newState})
    };

    handleNameChange = text => this.setState({name: text});

    handleTypeChange = text => this.setState({type: text});

    handleConfirmLocation = () => this.setState({selectedAddressConfirmed: true});


    handleClearInput = () => {
        this.setState({
            name: '',
            publicFree: false,
            type: '',
            tags: '',
            hasLocationPermission: null,
            currentLocation: null,
            userMarkerCoordinates: [],
            selectedCoordinate: null,
            selectedAddress: null,
            images: "https://ollocal.com/custom/domain_1/image_files/sitemgr_photo_2958.jpg",
            selectedAddressConfirmed: false

        })
    }

    handleSave = () => {
        const {name, publicFree, type, selectedAddress, selectedCoordinate, images} = this.state;

        let selectedTags = this.tag.itemsSelected;
        let tags = []
        for (let t in selectedTags) {
            tags.push(selectedTags[t]["label"])
        }

        this.setState({tags: tags})

        let address = selectedAddress.name + ", " + selectedAddress.postalCode + " " + selectedAddress.city;
        let postal = selectedAddress.postalCode;
        let city = selectedAddress.city;
        let country = selectedAddress.country;
        let latitude = selectedCoordinate.latitude;
        let longitude = selectedCoordinate.longitude;
        let verified = false;

        try {
            const reference = firebase
                .database()
                .ref('/courts/')
                .push({
                    name,
                    address,
                    postal,
                    city,
                    country,
                    latitude,
                    longitude,
                    verified,
                    publicFree,
                    type,
                    tags,
                    images
                });
            Alert.alert(`Saved`);
            this.setState({
                name: '',
                publicFree: false,
                type: '',
                tags: '',
                hasLocationPermission: null,
                currentLocation: null,
                userMarkerCoordinates: [],
                selectedCoordinate: null,
                selectedAddress: null,
                images: "https://ollocal.com/custom/domain_1/image_files/sitemgr_photo_2958.jpg",
            });
        } catch (error) {
            Alert.alert(`Error: ${error.message}`);
        }

    };


    getLocationPermission = async () => {
        const {status} = await Permissions.askAsync(Permissions.LOCATION);
        this.setState({hasLocationPermission: status});
    };

    componentDidMount = async () => {
        await this.getLocationPermission();
        await this.updateLocation();
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

    handlePress = event => {
        const {coordinate} = event.nativeEvent;
        this.setState({selectedCoordinate: coordinate});
        this.findAddress(coordinate);
        this.setState({
            userMarkerCoordinates: [coordinate],
        });
    };

    findAddress = async coordinate => {
        const [selectedAddress] = await Location.reverseGeocodeAsync(coordinate);
        this.setState({selectedAddress});
    };


    render() {
        const {
            name,
            publicFree,
            type,
            userMarkerCoordinates,
            selectedAddress,
            selectedAddressConfirmed,
        } = this.state;

        const tags = [
            {id: 1, label: 'Basketball'},
            {id: 2, label: 'Football'},
            {id: 3, label: 'Tennis'},
            {id: 4, label: 'Cricket'},
            {id: 5, label: 'Skateboard'},
        ];


        return (

            <SafeAreaView style={styles.container}>
                <Text style={styles.infoText}>Add new court</Text>

                {!selectedAddressConfirmed && (
                    <Text style={styles.infoTextSmall}>1. Select the new courts location</Text>
                )}
                {!selectedAddressConfirmed && (
                    <MapView
                        provider="google"
                        style={styles.map}
                        ref={this.mapViewRef}
                        showsUserLocation
                        onPress={this.handlePress}
                        initialRegion={{
                            latitude: 55.7,
                            longitude: 12.55,
                            latitudeDelta: 0.22,
                            longitudeDelta: 0.22
                        }}
                    >
                        {userMarkerCoordinates.map((coordinate, index) => (
                            <Marker
                                coordinate={coordinate}
                                key={index.toString()}
                            />
                        ))}
                    </MapView>
                )}


                <ScrollView>

                    {selectedAddress && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Address</Text>
                            <Text
                                style={styles.input}
                            >{selectedAddress.name}, {selectedAddress.postalCode} {selectedAddress.city} </Text>
                        </View>
                    )}
                    {selectedAddress && (
                        <View style={styles.row}>
                            <Text style={styles.label}>City</Text>
                            <Text style={styles.input}>
                                {selectedAddress.city}</Text>
                        </View>
                    )}
                    {selectedAddress && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Postal</Text>
                            <Text style={styles.input}>
                                {selectedAddress.postalCode}</Text>
                        </View>
                    )}
                    {selectedAddress && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Country</Text>
                            <Text style={styles.input}>
                                {selectedAddress.country}</Text>
                        </View>
                    )}

                    {selectedAddress && !selectedAddressConfirmed && (
                            <View style={styles.buttonStyle}>
                                <Button color={'#ffffff'} title="Confirm location"
                                        onPress={this.handleConfirmLocation}/>
                            </View>
                    )}

                    {selectedAddressConfirmed && (
                        <Text style={styles.infoTextSmall}>2. Fill out the necessary fields</Text>
                    )}

                    {selectedAddressConfirmed && (

                        <View style={styles.row}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={this.handleNameChange}
                            style={styles.input}
                        />
                    </View>
                    )}


                    {selectedAddressConfirmed && (

                        <View style={styles.row}>
                        <Text style={styles.label}>Public</Text>
                        <Switch
                            onValueChange={this.toggleSwitch}
                            value={publicFree}
                        />
                    </View>
                    )}

                    {selectedAddressConfirmed && (

                        <View style={styles.row}>
                        <Text style={styles.label}>Type</Text>
                        <TextInput
                            value={type}
                            onChangeText={this.handleTypeChange}
                            style={styles.input}
                        />
                    </View>
                    )}

                    {selectedAddressConfirmed && (
                        <Text style={styles.label}> Tags:{"\n"} </Text>
                    )}
                    {selectedAddressConfirmed && (

                        <TagSelect
                        theme={'success'}
                        style={styles.input}
                        data={tags}
                        ref={(tag) => {
                            this.tag = tag;
                        }}
                    />
                        )}

                    {selectedAddressConfirmed && (
                        <View style={{flexDirection: "row"}}>
                            <View style={styles.buttonStyle}>
                            <Button color={'#ffffff'} title="Add Court" onPress={this.handleSave}/>
                        </View>
                        <View style={styles.buttonStyle}>
                            <Button color={'#ffffff'} title="Clear input" onPress={this.handleClearInput}/>
                        </View>
                    </View>
                    )}

                </ScrollView>
            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ffffff',
        padding: 8,
    },
    row: {
        flexDirection: 'row',
        height: 30,
        margin: 10,
    },
    infoText: {
        fontSize: 30,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#008340'
    },
    infoTextSmall: {
        fontSize: 15,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#008340'
    },
    map: {flex: 10},
    label: {
        fontWeight: 'bold',
        width: 100,
        color: '#008340'
    },
    input: {borderWidth: 1, flex: 1},
    buttonStyle: {
        marginHorizontal: 10,
        marginTop: 5,
        flex: 1,
        backgroundColor: '#008340'
    }
});