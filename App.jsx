import React, { useState, useRef } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './context/UserContext';
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
import ForgotPassword from 'screens/ForgotPassword';
import Support from 'screens/Support';
import AccountPrivacy from 'screens/AccountPrivacy';
import Notifications from 'screens/Notifications';
import Cart from 'screens/Cart';
import Test from 'screens/Test';
import DeleteAccount from 'screens/DeleteAccount';
import DeleteFinal from 'screens/DeleteFinal';
import OffersInfo from 'screens/OffersInfo';
import Categories from 'screens/Categories';
import CategoryProducts from 'screens/CategoryProducts';
import ProductDetail from 'screens/ProductDetail';
import Checkout from 'screens/Checkout';
import Search from 'screens/Search';
import { useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Text, View, Platform } from 'react-native';
import TermsOfService from 'screens/TermsOfService';
import PrivacyPolicy from 'screens/PrivacyPolicy';
import Otp from 'screens/Otp';
import CompleteProfile from 'screens/CompleteProfile';
import EditProfile from 'screens/EditProfile';
import EditAddress from 'screens/EditAddress';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

// Tab Navigator for main screens
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNav {...props} />}
    >
      <Tab.Screen name="Homescreen" component={HomeScreen} />
      <Tab.Screen name="Categories" component={Categories} />
      <Tab.Screen name="Orders" component={Orders} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

// 2. Optionally override default font for all <Text>
const customTextProps = {
  style: { fontFamily: 'Outfit_600SemiBold' }
};
const oldRender = Text.render;
Text.render = function (...args) {
  const origin = oldRender.call(this, ...args);
  return React.cloneElement(origin, {
    style: [customTextProps.style, origin.props.style],
  });
};

export default function App() {
  const navigationRef = useRef();

  // 3. Load fonts before rendering app
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <UserProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <NavigationContainer theme={MyLightTheme} ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MainTabs">
              {/* Auth Screens */}
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

              {/* Main Tab Navigator */}
              <Stack.Screen name="MainTabs" component={MainTabs} />

              {/* Other Screens */}
              <Stack.Screen name="Search" component={Search} />
              <Stack.Screen name="CategoryProducts" component={CategoryProducts} />
              <Stack.Screen name="ProductDetail" component={ProductDetail} />
              <Stack.Screen name="Checkout" component={Checkout} />
              <Stack.Screen name="Payments" component={Payments} />
              <Stack.Screen name="AddressBook" component={Addresses} />
              <Stack.Screen name="AddNewAddress" component={NewAddress} />
              <Stack.Screen name="Wishlist" component={Wishlist} />
              <Stack.Screen name="Aboutus" component={AboutUs} />
              <Stack.Screen name="TermsofService" component={TermsOfService} />
              <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
              <Stack.Screen name="Support" component={Support} />
              <Stack.Screen name="AccountPrivacy" component={AccountPrivacy} />
              <Stack.Screen name="Notifications" component={Notifications} />
              <Stack.Screen name="Cart" component={Cart} />
              <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
              <Stack.Screen name="DeleteFinal" component={DeleteFinal} />
              <Stack.Screen name="Test" component={Test} />
              <Stack.Screen name="OffersInfo" component={OffersInfo} />
              <Stack.Screen name="Otp" component={Otp} />
              <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
              <Stack.Screen name="EditProfile" component={EditProfile} />
              <Stack.Screen name="EditAddress" component={EditAddress} />
            </Stack.Navigator>

            <StatusBar style="auto" translucent />
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </UserProvider>
  );
}