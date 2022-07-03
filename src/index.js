import React from 'react';
import { map } from 'lodash';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Home, Details, Scan } from './screens';
import { ORANGE, WHITE } from './variables/colors';

const { Navigator, Screen } = createNativeStackNavigator();

const screenOptions = {
    headerStyle: {
        backgroundColor: ORANGE
    },
    headerTintColor: WHITE,
    headerTitleStyle: {
        fontWeight: 'bold'
    }
};

const screens = [
    {
        key: 'home',
        name: 'Home',
        component: Home
    },
    {
        key: 'details',
        name: 'Details',
        component: Details
    },
    {
        key: 'scan',
        name: 'Scan',
        component: Scan
    }
];

export default function App() {
    return (
        <>
            <NavigationContainer>
                <Navigator>
                    { map(screens, screen => <Screen { ...screen } options={screenOptions} />) }
                </Navigator>
            </NavigationContainer>
            <StatusBar style='light' barStyle='light-content' />
        </>
    );
};
