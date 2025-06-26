import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import './global.css'

import HomeScreen from './screens/Homescreen';
import AboutScreen from './screens/About';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home" >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
