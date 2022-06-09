import React from 'react';
import { map } from 'lodash';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Details, Scan } from './screens';

const { Navigator, Screen } = createNativeStackNavigator();

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
      <NavigationContainer>
          <Navigator>
              { map(screens, screen => <Screen { ...screen } />) }
          </Navigator>
      </NavigationContainer>
  );
};
