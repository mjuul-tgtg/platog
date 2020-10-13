
import * as React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import CourtListItem from "./CourtListItem";


export default class CourtList extends React.Component {
    state = {
        courts: {},
    };

    componentDidMount() {
        firebase
            .database()
            .ref('/courts')
            .on('value', snapshot => {
                this.setState({ courts: snapshot.val() });
            });
    }

    handleSelectCourt = id => {
        console.log("HELLO")

        this.props.navigation.navigate('CourtDetails', { id });
    };

    render() {
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
                    // Vi bruger carKeys til at finde ID på den aktuelle bil og returnerer dette som key, og giver det med som ID til CarListItem
                    keyExtractor={(item, index) => courtKeys[index]}
                    renderItem={({ item, index }) => (
                        <CourtListItem
                            court={item}
                            id={courtKeys[index]}
                            onSelect={this.handleSelectCourt}
                        />
                    )}
                />
            </View>
        );
    }
}