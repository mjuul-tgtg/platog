
import * as React from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert, Image, Linking } from 'react-native';
import firebase from 'firebase';
import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start' },
    row: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
    },
    label: { width: 100, fontWeight: 'bold' },
    value: { flex: 1 },
    courtCover: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain'
    },
});

export default class CourtDetails extends React.Component {
    state = { court: null };


    componentDidMount() {
        // Vi udlæser ID fra navgation parametre og loader bilen når komponenten starter
        const id = this.props.navigation.getParam('id');
        this.loadcourt(id);
    }

    loadcourt = id => {
        firebase
            .database().ref(`/courts/${id}`).on('value', snapshot => {
            this.setState({ court: snapshot.val() });
        });
    };

    handleEdit = () => {
        // Vi navigerer videre til Editcourt skærmen og sender ID med
        const { navigation } = this.props;
        const id = navigation.getParam('id');
        navigation.navigate('Editcourt', { id });
    };

    confirmDelete = () => {
        Alert.alert('Are you sure?', 'Do you want to delete the court?', [
            { text: 'Cancel', style: 'cancel' },
            // Vi bruger this.handleDelete som eventHandler til onPress
            { text: 'Delete', style: 'destructive', onPress: this.handleDelete },
        ]);
    };

    // Vi spørger brugeren om han er sikker


    // Vi sletter den aktuelle bil
    handleDelete = () => {
        const { navigation } = this.props;
        const id = navigation.getParam('id');
        try {
            firebase.database().ref(`/courts/${id}`).remove();
            navigation.goBack();
        } catch (error) {
            Alert.alert(error.message);
        }


    };

    handleTags = tags => {
        return tags.sort().map(item => item).join(', ');
    }

    render() {
        const { court } = this.state;

        console.log(court)

        if (!court) {
            return <Text>No data</Text>;
        }

    return (
            <View style={styles.container}>
                <Image
                    style={styles.courtCover}
                    source={{
                        uri: court.images
                    }}
                />
                <View style={styles.row}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>{court.name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Address</Text>
                    <Text style={{color:"blue"}} onPress={() => Linking.openURL("https://www.google.com/maps/place/" + court.address)}>{court.address}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Postal</Text>
                    <Text style={styles.value}>{court.postal}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>City</Text>
                    <Text style={styles.value}>{court.city}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Type</Text>
                    <Text style={styles.value}>{court.type}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Tags</Text>
                    <Text style={styles.value}>{this.handleTags(court.tags)}</Text>
                </View>
            </View>
        );
    }
}
