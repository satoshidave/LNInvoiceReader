import React, { useState } from 'react';
import { get, map, upperFirst } from 'lodash';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Home, Details, Scan, Disconnected } from './screens';
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

const disconnectedScreen = {
    key: 'disconnected',
    name: 'Disconnected',
    component: Disconnected
};

const App = () => {
    const [connected, setConnected] = useState(true);
    const language = useLanguageStore(({ language }) => language);
    NetInfo.addEventListener(({ isConnected }) => setConnected(isConnected));
    return (
        <>
            <NavigationContainer>
                <Navigator>
                    {
                        connected ? map(screens, ({title, ...screen}) => (
                            <Screen
                                { ...screen }
                                options={{
                                    title: upperFirst(get(i18n, `${language}.${get(screen, 'key')}`)),
                                    ...screenOptions
                                }}
                            />
                        )) : (
                            <Screen
                                {...disconnectedScreen}
                                options={{
                                    title: upperFirst(get(i18n, `${language}.disconnected`)),
                                    ...screenOptions
                                }}
                            />
                        )
                    }
                </Navigator>
            </NavigationContainer>
            <StatusBar style='light' barStyle='light-content' />
        </>
    );
};

export default App;
