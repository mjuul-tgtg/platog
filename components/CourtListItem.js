import * as React from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#008340',
        flex: 1,
        borderWidth: 1,
        margin: 5,
        padding: 5,
        height: 50,
        justifyContent:'center'
    },
    label: {
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
    },
});

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

    addDistance = () => {

        const { court } = this.props;

        let dis = court.distance

        if(dis==null){
            this.setState({distance:"Calculating distance..."})
            return;
        }

        let dis_text = dis + " m"

        if (dis > 1000) {
             dis = dis / 1000
             dis = dis.toFixed(2)
             dis_text = dis + " km"
        }

        this.setState({distance:dis_text})
    };


    render() {
        const { court } = this.props;

        const { distance } = this.state;

        return (
            <TouchableOpacity style={styles.container} onPress={this.handlePress}>
                <Text style={styles.label}>
                    {court.name} - {distance}
                </Text>
            </TouchableOpacity>
        );
    }
}