import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Linking,
    TouchableOpacity,
    Alert
} from 'react-native';
import firebase from 'firebase';


export default class CourtDetails extends React.Component {
    state = {court: null};


    componentDidMount() {
        const id = this.props.navigation.getParam('id');
        this.loadCourt(id);
    }

    loadCourt = id => {

        console.log(id)
        firebase
            .database().ref(`/courts/${id}`).on('value', snapshot => {
            this.setState({court: snapshot.val()});
        });
    };

    handleTags = tags => {
        return tags.sort().map(item => item).join(', ');
    }

    handleCheckIn = () => {
        Alert.alert("You are now checked in")
    }

    render() {
        const {court} = this.state;

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
                    <Text style={{color: "blue"}}
                          onPress={() => Linking.openURL("https://www.google.com/maps/place/" + court.address)}>{court.address}</Text>
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

                <TouchableOpacity
                    style={styles.screenButton}
                    onPress={this.handleCheckIn}
                    underlayColor='#fff'>
                    <Text style={styles.buttonText}>Check in</Text>
                </TouchableOpacity>


            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'flex-start'},
    row: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
    },
    label: {
        fontWeight: 'bold',
        width: 100,
        color: '#008340'
    },
    value: {flex: 1},
    courtCover: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain'
    },
    screenButton: {
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