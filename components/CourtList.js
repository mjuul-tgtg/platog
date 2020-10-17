
import * as React from 'react';
import {View, Text, FlatList, TouchableOpacity, SafeAreaView, Button} from 'react-native';
import firebase from 'firebase';
import CourtListItem from "./CourtListItem";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import {getDistance} from "geolib";


export default class CourtList extends React.Component {

    state = {
        courts: {},
        currentLocation: null,
    };

    componentDidMount = async () => {
        firebase
            .database()
            .ref('/courts')
            .on('value', snapshot => {
                this.setState({ courts: snapshot.val() });
            });
        await this.updateLocation();
        this.calculateDistances()
    };

    handleSelectCourt = id => {

        console.log("ID: " + id)
        this.props.navigation.navigate('CourtDetails', { id });
    };


    updateLocation = async () => {
        const { coords } = await Location.getCurrentPositionAsync();
        this.setState({ currentLocation: coords });

    };

    //https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
    dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            /* next line works with strings and numbers,
             * and you may want to customize it to your needs
             */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    calculateDistances = () => {

        const { courts, currentLocation } = this.state;
        const courtArray = Object.values(courts)

        const courtKeys = Object.keys(courts);

        console.log(courtKeys)

        console.log(courtKeys[0])

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
        courtArray.sort(this.dynamicSort("distance"))
        this.setState({courts:courtArray})
    };


    render() {
        //const { currentLocation } = this.props
        const { courts } = this.state;

        // Vi viser ingenting hvis der ikke er data
        if (!courts) {
            return null;
        }
        // Flatlist forventer et array. Derfor tager vi alle values fra vores cars objekt, og bruger som array til listen
        const courtArray = Object.values(courts);
        // Vi skal også bruge alle IDer, så vi tager alle keys også.
        const courtKeys = Object.keys(courts);

        return (
            <View>
                <FlatList
                    data={courtArray}
                    // Vi bruger courtKeys til at finde ID på den aktuelle bil og returnerer dette som key, og giver det med som ID til CarListItem
                    keyExtractor={(item, index) => courtKeys[index]}
                    renderItem={({ item, index }) => (
                        <CourtListItem
                            court={item}
                            id={item.key}
                            onSelect={this.handleSelectCourt}
                        />
                    )}
                />
            </View>
        );
    }
}