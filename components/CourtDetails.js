import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Linking,
    TouchableOpacity,
    Alert, Button, FlatList
} from 'react-native';
import firebase from 'firebase';


export default class CourtDetails extends React.Component {
    state = {
        court: null,
        viewSocial: false
    };


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

    ViewSocial = () => {
        this.setState({viewSocial : true})
    }

    ViewSocialFalse = () => {
        this.setState({viewSocial : false})
    }

    handleCheckIn = () => {
        Alert.alert("You are now checked in")
    }

    render() {
        const {court, viewSocial} = this.state;

        console.log(court)

        if (!court) {
            return <Text>No data</Text>;
        }

        if (!viewSocial) {

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

                    <View style={{flexDirection: "row"}}>
                        <View style={styles.buttonStyle}>
                            <Button color={'#ffffff'} title="Check in" onPress={this.handleCheckIn}/>
                        </View>
                        <View style={styles.buttonStyle}>
                            <Button color={'#ffffff'} title="View checkins" onPress={this.ViewSocial}/>
                        </View>
                    </View>

                </View>
            );
        }

        return (
            <View style={styles.container}>

                <Text style={styles.infoText}>Current players add the court</Text>
                <Text style={styles.infoTextSmall}>Magnus</Text>
                <Text style={styles.infoTextSmall}>Trine</Text>
                <Text style={styles.infoTextSmall}>Snitte</Text>


                <View style={{flexDirection: "row"}}>
                    <View style={styles.buttonStyle}>
                        <Button color={'#ffffff'} title="Check in" onPress={this.handleCheckIn}/>
                    </View>
                    <View style={styles.buttonStyle}>
                        <Button color={'#ffffff'} title="View info" onPress={this.ViewSocialFalse}/>
                    </View>
                </View>

            </View>
        )
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
        color: '#669DB3FF'
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
        backgroundColor: '#669DB3FF',
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
    buttonStyle: {
        marginHorizontal: 10,
        marginTop: 5,
        flex: 1,
        backgroundColor: '#669DB3FF'
    },
    infoText: {
        fontSize: 30,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#669DB3FF'
    },
    infoTextSmall: {
        fontSize: 15,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#669DB3FF'
    }
});