import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Linking,
    Alert, Button,
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

    handleDetailsForPickup = () => {
        Alert.alert("Details - In progress")
    }

    handleJoinGame = () => {
        Alert.alert("You have joined the game")
    }

    handleJoinQue = () => {
        Alert.alert("You are now in que")
    }

    handleCheckIn = () => {
        Alert.alert("You are now checked in")
    }



    render() {
        const {court, viewSocial} = this.state;

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
                        <View style={styles.buttonStyleGray}>
                            <Button color={'#ffffff'} title="View Social" onPress={this.ViewSocial}/>
                        </View>
                    </View>

                </View>
            );
        }

        return (
            <View style={styles.container}>

                <Text style={styles.infoText}>Current checked in players</Text>
                <Text style={styles.infoTextSmall}>Magnus_Juul</Text>
                <Text style={styles.infoTextSmall}>TrineRask</Text>
                <Text style={styles.infoTextSmall}>SnitteBanditte</Text>
                <Text style={styles.infoTextSmall}>Barbara</Text>


                <Text style={styles.infoTextPickUp}>Open pickUp games</Text>
                <View style={styles.pickUpRows}>
                    <View>
                        <Text style={styles.infoTextSmall}>22/12 14:30-18:30 - 8/8</Text>
                    </View>
                    <View style={styles.buttonStyleGray}>
                        <Button color={'#ffffff'} title="Details" onPress={this.handleDetailsForPickup}/>
                    </View>
                    <View style={styles.buttonStyleRed}>
                        <Button color={'#ffffff'} title="Join Que" onPress={this.handleJoinQue}/>
                    </View>
                </View>
                <View style={styles.pickUpRows}>
                    <View>
                        <Text style={styles.infoTextSmall}>22/12 17:30-19:00 - 3/5</Text>
                    </View>
                    <View style={styles.buttonStyleGray}>
                        <Button color={'#ffffff'} title="Details" onPress={this.handleDetailsForPickup}/>
                    </View>
                    <View style={styles.buttonStyle}>
                        <Button color={'#ffffff'} title="Join game" onPress={this.handleJoinGame}/>
                    </View>
                </View>
                <View style={{flexDirection: "row",
                    paddingLeft:5,
                    paddingTop:5,
                    paddingBottom:55}}>
                    <View>
                        <Text style={styles.infoTextSmall}>23/12 16:30-17:30 - 2/5</Text>
                    </View>
                    <View style={styles.buttonStyleGray}>
                        <Button color={'#ffffff'} title="Details" onPress={this.handleDetailsForPickup}/>
                    </View>
                    <View style={styles.buttonStyle}>
                        <Button color={'#ffffff'} title="Join game" onPress={this.handleJoinGame}/>
                    </View>
                </View>


                <View style={{flexDirection: "row"}}>
                    <View style={styles.buttonStyle}>
                        <Button color={'#ffffff'} title="Check in" onPress={this.handleCheckIn}/>
                    </View>
                    <View style={styles.buttonStyleGray}>
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
    buttonStyle: {
        marginHorizontal: 10,
        marginTop: 5,
        flex: 1,
        backgroundColor: '#669DB3FF'
    },
    buttonStyleRed: {
        marginHorizontal: 10,
        marginTop: 5,
        flex: 1,
        backgroundColor: '#FF4F58FF'
    },
    buttonStyleGray: {
        marginHorizontal: 10,
        marginTop: 5,
        flex: 1,
        backgroundColor: '#A89C94FF'
    },
    infoText: {
        fontSize: 30,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#669DB3FF'
    },
    infoTextPickUp: {
        fontSize: 30,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 100,
        color: '#669DB3FF'
    },
    infoTextSmall: {
        fontSize: 15,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#669DB3FF'
    },
    pickUpRows: {flexDirection: "row",
        paddingLeft:5,
        paddingTop:10,
        paddingBottom:5}
});