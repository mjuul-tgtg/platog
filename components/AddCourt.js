import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import firebase from 'firebase';

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center' },
    row: {
        flexDirection: 'row',
        height: 30,
        margin: 10,
    },
    label: { fontWeight: 'bold', width: 100 },
    input: { borderWidth: 1, flex: 1 },
});

export default class AddCourt extends React.Component {
    state = {
        brand: '',
        model: '',
        year: '',
        licensePlate: '',
    };

    handleBrandChange = text => this.setState({ brand: text });

    handleModelChange = text => this.setState({ model: text });

    handleYearChange = text => this.setState({ year: text });

    handleLicensePlateChange = text => this.setState({ licensePlate: text });

    handleSave = () => {
        const { brand, model, year, licensePlate } = this.state;
        try {
            const reference = firebase
                .database()
                .ref('/cars/')
                .push({ brand, model, year, licensePlate });
            Alert.alert(`Saved`);
            this.setState({
                brand: '',
                model: '',
                year: '',
                licensePlate: '',
            });
        } catch (error) {
            Alert.alert(`Error: ${error.message}`);
        }
    };

    render() {
        const { brand, model, year, licensePlate } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.row}>
                        <Text style={styles.label}>Brand</Text>
                        <TextInput
                            value={brand}
                            onChangeText={this.handleBrandChange}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Model</Text>
                        <TextInput
                            value={model}
                            onChangeText={this.handleModelChange}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Year</Text>
                        <TextInput
                            value={year}
                            onChangeText={this.handleYearChange}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>License Plate</Text>
                        <TextInput
                            value={licensePlate}
                            onChangeText={this.handleLicensePlateChange}
                            style={styles.input}
                        />
                    </View>
                    <Button title="Add Court" onPress={this.handleSave} />
                </ScrollView>
            </SafeAreaView>
        );
    }
}