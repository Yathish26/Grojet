import React, { useState, useRef } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';
import HomeScreen from './screens/Homescreen';
import Profile from './screens/Profile';
import BottomNav from './components/BottomNav';
import Addresses from 'screens/Addresses';
import Orders from 'screens/Orders';
import Wishlist from 'screens/Wishlist';
import AboutUs from 'screens/Aboutus';
import NewAddress from 'screens/NewAddress';
import Payments from 'screens/Payments';
import Login from 'screens/Login';
import Register from 'screens/Register';
import ForgotPassword from 'ForgotPassword';
import Support from 'screens/Support';
import AccountPrivacy from 'screens/AccountPrivacy';
import Notifications from 'screens/Notifications';
import Cart from 'screens/Cart';
import Test from 'screens/Test';
import DeleteAccount from 'screens/DeleteAccount';
import DeleteFinal from 'screens/DeleteFinal';
import OffersInfo from 'screens/OffersInfo';

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

  const navs = ['Home', 'Orders', 'Profile'];


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
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Payments" component={Payments} />
            <Stack.Screen name="AddressBook" component={Addresses} />
            <Stack.Screen name="AddNewAddress" component={NewAddress} />
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen name="Wishlist" component={Wishlist} />
            <Stack.Screen name="Aboutus" component={AboutUs} />
            <Stack.Screen name="Support" component={Support} />
            <Stack.Screen name="AccountPrivacy" component={AccountPrivacy} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
            <Stack.Screen name="DeleteFinal" component={DeleteFinal} />
            <Stack.Screen name="Test" component={Test} />
            <Stack.Screen name="OffersInfo" component={OffersInfo} />
          </Stack.Navigator>

          <StatusBar style="auto" />
          {navs.includes(currentRoute) && (
            <BottomNav currentRoute={currentRoute} />
          )}
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
