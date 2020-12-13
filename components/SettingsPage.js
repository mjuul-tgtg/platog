import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Constants from "expo-constants";

export default class SettingsPage extends React.Component {

    HandleLogOut = () => {
        this.props.navigation.navigate('LoginPage');
    }

    render() {

        return (
            <View style={styles.container}>

                <TouchableOpacity
                    style={styles.screenButton}
                    onPress={this.HandleLogOut}
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
    map: {flex: 1000},
    label: {
        fontWeight: 'bold',
        width: 100,
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
    buttonStyle: {
        marginHorizontal: 10,
        marginTop: 5,
        flex: 1,
        backgroundColor: '#669DB3FF'
    },
    loadingText: {
        fontSize: 30,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#669DB3FF'
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
    }
    ,
    screenButtonSmall: {
        marginRight: 1,
        marginLeft: 21,
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
});