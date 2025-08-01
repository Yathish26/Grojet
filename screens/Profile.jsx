import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
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
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import BackHeader from 'components/BackHeader';
import AlertBox from 'components/AlertBox';
import ProfileHeader from 'components/ProfileHeader';
import { useUser } from '../context/UserContext';

export default function Profile() {
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const { user, isLoggedIn, isLoading, logout: userLogout } = useUser();
  const navigate = useNavigation();

  const handleLogout = () => {
    setShowLogoutAlert(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutAlert(false);
    
    const success = await userLogout();
    if (success) {
      Alert.alert('Logged Out', 'You have been successfully logged out.');
      navigate.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } else {
      Alert.alert('Error', 'Failed to log out. Please try again.');
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
        
        <ProfileHeader 
          user={user} 
          isLoggedIn={isLoggedIn} 
          isLoading={isLoading} 
          navigate={navigate} 
        />

        <ScrollView className="p-4"
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
        >
          <View className="flex-row flex justify-between mb-6 gap-2">
            <TouchableOpacity
              onPress={() => navigate.navigate('Support')}
              className="flex-1 items-center justify-center bg-white p-4 rounded-xl border border-gray-200">
              <MessageSquareDashed size={26} color="#4b5563" />
              <Text className="text-sm text-gray-700 text-center font-medium mt-2">Support</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate.navigate('Payments')}
              className="flex-1 items-center justify-center bg-white p-4 rounded-xl border border-gray-200">
              <CreditCard size={26} color="#4b5563" />
              <Text className="text-sm text-gray-700 text-center font-medium mt-2">Payments</Text>
            </TouchableOpacity>
          </View>

          {isLoggedIn && (
            <View className="mb-6 bg-white p-5 rounded-xl border border-gray-200">
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

          <View className="mb-6 bg-white p-5 rounded-xl border border-gray-200">
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

          <View className="mb-28 bg-white p-5 rounded-xl border border-gray-200">
            <Text className="text-xs uppercase text-gray-500 font-bold mb-4 tracking-wide">Other Information</Text>
            {[
              { Icon: Info, text: 'About us', screen: 'Aboutus' },
              { Icon: Lock, text: 'Account Privacy', screen: 'AccountPrivacy' },
              { Icon: Bell, text: 'Notifications', screen: 'Notifications' },
              ...(!isLoggedIn ? [{ Icon: UserRoundPlus, text: 'Login', screen: 'Login' }] : []),
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