import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity, Alert,
} from 'react-native';
import Constants from "expo-constants";

export default class SettingsPage extends React.Component {

    HandleLogOut = () => {
        this.props.navigation.navigate('LoginPage');
    }

    HandleMyFriends = () => {
        Alert.alert("A list of your friends will appear")
    }

    render() {

        return (
            <View style={styles.container}>

                <TouchableOpacity
                    style={styles.screenButton}
                    onPress={this.HandleMyFriends}
                    underlayColor='#fff'>
                    <Text style={styles.buttonText}>My friends</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.screenButtonLogOut}
                    onPress={this.HandleLogOut}
                    underlayColor='#fff'>
                    <Text style={styles.buttonText}>Log out</Text>
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
    screenButton: {
        marginRight: 40,
        marginLeft: 40,
        marginBottom: 10,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#A89C94FF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    screenButtonLogOut: {
        marginRight: 40,
        marginLeft: 40,
        marginBottom: 10,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#FF4F58FF',
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
});