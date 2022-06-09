import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

const Home = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>To start, scan your LN Invoice!</Text>
            <Button
                title='Scan'
                onPress={() => navigation.navigate('Scan')}
            />
        </View>
    );
};

export default Home;
