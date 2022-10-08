import React from 'react';
import { get, map, upperFirst } from 'lodash';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Home, Details, Scan } from './screens';
import { ORANGE, WHITE } from './variables/colors';
import i18n from './utils/i18n';
import { useLanguageStore } from './libs/store';

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
    const language = useLanguageStore(({ language }) => language);
    return (
        <>
            <NavigationContainer>
                <Navigator>
                    { map(screens, ({title, ...screen}) => (
                        <Screen
                            { ...screen }
                            options={{
                                title: upperFirst(get(i18n, `${language}.${get(screen, 'key')}`)),
                                ...screenOptions
                            }}
                        />
                    )) }
                </Navigator>
            </NavigationContainer>
            <StatusBar style='light' barStyle='light-content' />
        </>
    );
};
