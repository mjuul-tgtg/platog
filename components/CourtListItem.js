import * as React from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity, Image, View,
} from 'react-native';

export default class CourtListItem extends React.Component {

    state = {
        distance: null,
    };

    componentDidMount = async () => {
        await this.addDistance();
    };

    handlePress = () => {
        // Her pakker vi ting ud fra props
        const {id, onSelect} = this.props
        // Kalder den onSelect prop vi får, med det ID vi har fået som argument.
        onSelect(id)
    };

    addDistance = async () => {

        const {court} = this.props;

        let dis = court.distance

        if (dis == null) {
            this.setState({distance: "Calculating distance..."})
            return;
        }

        let dis_text = dis + " m"

        if (dis > 1000) {
            dis = dis / 1000
            dis = dis.toFixed(2)
            dis_text = dis + " km"
        }

        this.setState({distance: dis_text})

    };


    render() {
        const {court} = this.props;

        const {distance} = this.state;

        return (
            <TouchableOpacity style={styles.container} onPress={this.handlePress}>
                <Image
                    style={styles.courtCover}
                    source={{
                        uri: court.images
                    }}
                />
                <Text style={styles.label}>
                    {court.name} - {distance}
                </Text>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#669DB3FF',
        flex: 1,
        borderWidth: 1,
        margin: 5,
        marginLeft: 30,
        marginRight: 30,
        padding: 5,
        borderRadius: 15,
        height: 150,
        justifyContent: 'center',
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F0F6F7FF',
        textAlign: 'center',
        padding:5,
    },
    courtCover: {
        flex: 1,
        padding: 1,
        width: null,
        height: null,
        borderRadius: 15,

    }
});