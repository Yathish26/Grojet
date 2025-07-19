import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import {
  ChevronRight,
  Wallet,
  CreditCard,
  ShoppingBag,
  Heart,
  MapPin,
  Lock,
  Info,
  Bell,
  LogOut,
  UserRoundPlus,
  MessageSquareDashed,
  MailOpen,
} from 'lucide-react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import BackHeader from 'components/BackHeader';
import AlertBox from 'components/AlertBox';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigation();
  const isFocused = useIsFocused();

  const loadProfileData = useCallback(async () => {
    if (!user || !isLoggedIn) {
      setIsLoading(true);
    }

    try {
      const userJson = await AsyncStorage.getItem('user');
      const storedToken = await SecureStore.getItemAsync('userToken');

      if (userJson && storedToken) {
        setUser(JSON.parse(userJson));
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        if (userJson) await AsyncStorage.removeItem('user');
        if (storedToken) await SecureStore.deleteItemAsync('userToken');
      }
    } catch (e) {
      console.error('Failed to load profile data:', e);
      setUser(null);
      setIsLoggedIn(false);
      Alert.alert('Error', 'Could not load profile data.');
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoggedIn]);

  useEffect(() => {
    if (isFocused) {
      loadProfileData();
    }
  }, [isFocused, loadProfileData]);

  const handleLogout = () => {
    setShowLogoutAlert(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutAlert(false);
    setIsLoading(true);

    try {
      await SecureStore.deleteItemAsync('userToken');
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsLoggedIn(false);
      Alert.alert('Logged Out', 'You have been successfully logged out.');
      navigate.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutAlert(false);
  };

  return (
    <>
      {showLogoutAlert && (
        <AlertBox
          title={"Log out ?"}
          message={"Are you sure you want to log out?"}
          b1={"Log out"}
          b2={"Cancel"}
          onb1={handleConfirmLogout}
          onb2={handleCancelLogout}
        />
      )}

      <View className="flex-1 bg-gray-50">
        <BackHeader title="Profile" />

        <View className="bg-white p-5 border-gray-100">
          {isLoading ? (
            <ActivityIndicator size="large" color="#4CAF50" className="my-5" />
          ) : isLoggedIn && user ? (
            <>
              <Text className="text-3xl font-semibold text-gray-800 mb-3">{user.name}</Text>
              <View className="flex-row gap-1 items-center mb-5">
                <MailOpen size={16} color="#4b5563" />
                <Text className="text-gray-700 text-base font-medium">{user.email}</Text>
              </View>
            </>
          ) : (
            <>
              <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome!</Text>
              <Text className="text-gray-500 text-base mb-8 text-center">
                Log in to manage your profile.
              </Text>
              <TouchableOpacity
                onPress={() => navigate.navigate('Login')}
                className="bg-green-500 py-3 rounded-xl items-center justify-center shadow-md"
              >
                <Text className="text-white font-bold text-lg">Log In</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <ScrollView className="p-4">
          <View className="flex-row flex justify-between mb-6 gap-2">
            <TouchableOpacity
              onPress={() => navigate.navigate('Support')}
              className="flex-1 items-center justify-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <MessageSquareDashed size={26} color="#4b5563" />
              <Text className="text-sm text-gray-700 text-center font-medium mt-2">Support</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate.navigate('Payments')}
              className="flex-1 items-center justify-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <CreditCard size={26} color="#4b5563" />
              <Text className="text-sm text-gray-700 text-center font-medium mt-2">Payments</Text>
            </TouchableOpacity>
          </View>

          {isLoggedIn && (
            <View className="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <Text className="text-xs uppercase text-gray-500 font-bold mb-4 tracking-wide">Your Information</Text>
              {[
                { Icon: ShoppingBag, text: 'Your orders', screen: 'Orders' },
                { Icon: Heart, text: 'Your wishlist', screen: 'Wishlist' },
                { Icon: MapPin, text: 'Address book', screen: 'AddressBook' },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigate.navigate(item.screen)}
                  className={`flex-row items-center justify-between py-3 ${index < 2 ? 'border-b border-gray-100' : ''}`}
                >
                  <View className="flex-row gap-2 items-center">
                    <item.Icon size={20} color="#4b5563" />
                    <Text className="text-base text-gray-800 font-medium">{item.text}</Text>
                  </View>
                  <ChevronRight size={18} color="#a0aec0" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View className="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <Text className="text-xs uppercase text-gray-500 font-bold mb-4 tracking-wide">Payments and Coupons</Text>
            {[
              { Icon: Wallet, text: 'Wallet', screen: 'Wallet' },
              { Icon: CreditCard, text: 'Money', screen: 'Money' },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center justify-between py-3 ${index < 1 ? 'border-b border-gray-100' : ''}`}
              >
                <View className="flex-row gap-2 items-center">
                  <item.Icon size={20} color="#4b5563" />
                  <Text className="text-base text-gray-800 font-medium">{item.text}</Text>
                </View>
                <ChevronRight size={18} color="#a0aec0" />
              </TouchableOpacity>
            ))}
          </View>

          <View className="mb-28 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <Text className="text-xs uppercase text-gray-500 font-bold mb-4 tracking-wide">Other Information</Text>
            {[
              { Icon: Info, text: 'About us', screen: 'Aboutus' },
              { Icon: Lock, text: 'Account Privacy', screen: 'AccountPrivacy' },
              { Icon: Bell, text: 'Notifications', screen: 'Notifications' },
              ...(!isLoggedIn ? [{ Icon: UserRoundPlus, text: 'Register', screen: 'Register' }] : []),
              ...(isLoggedIn ? [{
                Icon: LogOut,
                text: 'Log Out',
                action: handleLogout,
                color: '#EF4444'
              }] : []),
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.action ? item.action : (() => item.screen && navigate.navigate(item.screen))}
                className={`flex-row items-center justify-between py-3 ${index < (isLoggedIn ? 3 : 2) ? 'border-b border-gray-100' : ''} ${item.text === 'Log Out' ? 'mt-2' : ''}`}
              >
                <View className="flex-row gap-2 items-center">
                  <item.Icon size={20} color={item.color || "#4b5563"} />
                  <Text className={`text-base font-medium ${item.text === 'Log Out' ? 'text-red-500' : 'text-gray-800'}`}>{item.text}</Text>
                </View>
                <ChevronRight size={18} color={item.text === 'Log Out' ? "#EF4444" : "#a0aec0"} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
