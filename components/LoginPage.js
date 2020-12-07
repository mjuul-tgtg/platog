import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
    Alert,
    LogBox,
    TextInput,
    Image,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import * as Google from 'expo-google-app-auth';
import {AntDesign} from "@expo/vector-icons";
import Constants from "expo-constants";

const googleConfig = {
    iosClientId: '603386649315-vp4revvrcgrcjme51ebuhbkbspl048l9.apps.googleusercontent.com',
    androidClientId: '603386649315-9rbv8vmv2vvftetfbvlrbufcps1fajqf.apps.googleusercontent.com',
    iosStandaloneAppClientId: '<IOS_CLIENT_ID>',
    androidStandaloneAppClientId: '<ANDROID_CLIENT_ID>'
}

export default class LoginPage extends React.Component {

    state = {
        isLoggedIn: false,
        googleUser: "",
    }

    changeToMainView= (user) => {
        console.log(user)
        this.props.navigation.navigate('MainPage',{ user });
    }


    HandleGoogleLogin = async () => {
        try {
            const {type, user} = await Google.logInAsync(googleConfig)


            if (type === "success") {
                this.setState({
                    isLoggedIn: true,
                    googleUser: user
                })

                this.changeToMainView(user);

            } else if (type === "cancel") {
                Alert.alert("HELLO THERE")
            }

        } catch (e) {
            console.error(e)
        }

    }


    render() {

        const {isLoggedIn, googleUser} = this.state

            return (
                <View style={styles.container}>

                    <Text style={styles.infoText}>P.L.A.T.O.G</Text>
                    <Text style={styles.infoTextSmall}>Play Together</Text>

                    <Image
                        style={styles.courtCover}
                        source={{
                            uri:"https://www.bls.gov/spotlight/2017/sports-and-exercise/images/cover_image.jpg"
                        }}
                    />

                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            placeholder="E-mail"

                        />
                    </View>


                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                        />
                    </View>

                    <View style={{flexDirection: "row",
                                  padding: 5}}>
                        <TouchableOpacity
                            style={styles.screenButtonSmall}
                            onPress={this.HandleGoogleLogin}
                            underlayColor='#fff'>
                            <Text style={styles.buttonText}>Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.screenButtonSmall}
                            onPress={this.HandleGoogleLogin}
                            underlayColor='#fff'>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity
                        style={styles.screenButton}
                        onPress={this.HandleGoogleLogin}
                        underlayColor='#fff'>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>

                </View>
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
        fontSize: 50,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#008340'
    },
    infoTextSmall: {
        fontSize: 25,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#008340'
    },
    map: {flex: 1000},
    label: {
        fontWeight: 'bold',
        width: 100,
        color: '#008340'
    },
    input: {
        borderWidth: 1,
        flex: 1,
        justifyContent: 'center',
        marginLeft: 30,
        marginRight: 30,
        textAlign: 'center'

    },
    buttonStyle: {
        marginHorizontal: 10,
        marginTop: 5,
        flex: 1,
        backgroundColor: '#008340'
    },
    loadingText: {
        fontSize: 30,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#008340'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
    screenButtonSmall: {
        marginRight: 1,
        marginLeft: 21,
        marginBottom: 1,
        marginTop: 1,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#008340',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
        width: '40%'
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 20
    },
    courtCover: {
        width: null,
        height: 200,
        resizeMode: 'contain'
    },
});