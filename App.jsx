import React, { useState, useRef } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';
import { useColorScheme } from 'react-native';
import HomeScreen from './screens/Homescreen';
import Profile from './screens/Profile';
import BottomNav from './components/BottomNav';
import Addresses from 'screens/Addresses';
import Orders from 'screens/Orders';
import Wishlist from 'screens/Wishlist';
import AboutUs from 'screens/Aboutus';

const Stack = createNativeStackNavigator();

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('Home');
  const navigationRef = useRef();

  const systemScheme = useColorScheme();
  // console.log("Device theme is:", systemScheme);


  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <NavigationContainer
          theme={MyLightTheme}
          ref={navigationRef}
          onStateChange={() => {
            const route = navigationRef.current?.getCurrentRoute();
            if (route) setCurrentRoute(route.name);
          }}
        >
          <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }} initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="AddressBook" component={Addresses} />
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen name="Wishlist" component={Wishlist} />
            <Stack.Screen name="Aboutus" component={AboutUs} />
          </Stack.Navigator>

          <StatusBar style="auto" />
          <BottomNav currentRoute={currentRoute} />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
