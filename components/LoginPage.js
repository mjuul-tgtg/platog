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
                            uri:"https://drive.google.com/uc?export=view&id=1a64rN7nLsMBculwV6aUFPJ67X-ag683p"
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
                            style={styles.screenButtonLogin}
                            underlayColor='#fff'>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={styles.screenButtonRegister}
                            underlayColor='#fff'>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </View>




                    <TouchableOpacity
                        onPress={this.HandleGoogleLogin}>
                        <Image
                            style={styles.loginImage}
                            source={{
                                uri:"https://avatars1.githubusercontent.com/u/7328930?v=4"
                            }}
                            onc
                        />
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
        backgroundColor: '#F0F6F7FF',
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
        color: '#669DB3FF'
    },
    infoTextSmall: {
        fontSize: 25,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#669DB3FF'
    },
    input: {
        borderWidth: 1,
        flex: 1,
        justifyContent: 'center',
        marginLeft: 30,
        marginRight: 30,
        textAlign: 'center'

    },
    screenButtonRegister: {
        marginRight: 1,
        marginLeft: 26,
        marginBottom: 1,
        marginTop: 1,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#A89C94FF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
        width: '40%'
    },
    screenButtonLogin: {
        marginRight: 1,
        marginLeft: 26,
        marginBottom: 1,
        marginTop: 1,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#669DB3FF',
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
    loginImage: {
    width: null,
        paddingTop:20,
        height: 75,
        resizeMode: 'contain'
},
});