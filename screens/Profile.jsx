import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronRight,
  Sun,
  Wallet,
  LifeBuoy,
  CreditCard,
  ShoppingBag,
  Heart,
  Book,
  MapPin,
  Receipt,
  Gift,
  Phone,
  Lock,
  Info,
  Bell,
  LogOut,
  ChevronLeft,
  UserRoundPlus,
  MessageSquareDashed,
  UserRoundPen,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import BackHeader from 'components/BackHeader';
import AlertBox from 'components/AlertBox';

export default function Profile() {
  const [theme, setTheme] = useState('LIGHT');
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const navigate = useNavigation();

  const handleThemeToggle = () => {
    setTheme(prev => (prev === 'LIGHT' ? 'DARK' : 'LIGHT'));
  };

  const handleLogout = () => {
    setShowLogoutAlert(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutAlert(false);
    navigate.navigate("Login");
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
        {/* Account Section */}
        <View className="bg-white p-5 border-gray-100">
          <Text className="text-3xl font-semibold text-gray-800 mb-3">Yathish</Text>
          <View className="flex-row gap-1 items-center mb-5">
            <Phone size={16} color="#4b5563" />
            <Text className="text-gray-700 text-base font-medium">8073215402</Text>
          </View>
        </View>

        <ScrollView className="p-4">
          {/* Quick Links */}
          <View className="flex-row flex justify-between mb-6 gap-2">
            {/* <TouchableOpacity
              onPress={() => navigate.navigate('EditProfile')}
              className="flex-1 items-center justify-center bg-white p-4 rounded-xl shadow-md border border-gray-100">
              <UserRoundPen size={26} color="#4b5563" />
              <Text className="text-sm text-gray-700 text-center font-medium mt-2">Edit Profile</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => navigate.navigate('Support')}
              className="flex-1 items-center justify-center bg-white p-4 rounded-xl shadow-md border border-gray-100">
              <MessageSquareDashed size={26} color="#4b5563" />
              <Text className="text-sm text-gray-700 text-center font-medium mt-2">Support</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate.navigate('Payments')}
              className="flex-1 items-center justify-center bg-white p-4 rounded-xl shadow-md border border-gray-100">
              <CreditCard size={26} color="#4b5563" />
              <Text className="text-sm text-gray-700 text-center font-medium mt-2">Payments</Text>
            </TouchableOpacity>
          </View>

          {/* Your Information */}
          <View className="mb-6 bg-white p-5 rounded-xl shadow-md border border-gray-100">
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

          <View className="mb-6 bg-white p-5 rounded-xl shadow-md border border-gray-100">
            <Text className="text-xs uppercase text-gray-500 font-bold mb-4 tracking-wide">Payments and Coupons</Text>
            {[
              { Icon: Wallet, text: 'Wallet' },
              { Icon: CreditCard, text: 'Money' },
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

          {/* Other Information */}
          <View className="mb-28 bg-white p-5 rounded-xl shadow-md border border-gray-100">
            <Text className="text-xs uppercase text-gray-500 font-bold mb-4 tracking-wide">Other Information</Text>
            {[
              { Icon: Info, text: 'About us', screen: 'Aboutus' },
              { Icon: Lock, text: 'Account Privacy', screen: 'AccountPrivacy' },
              { Icon: Bell, text: 'Notifications', screen: 'Notifications' },
              { Icon: UserRoundPlus, text: 'Register', screen: 'Register' },
              {
                Icon: LogOut,
                text: 'Log Out',
                action: handleLogout
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.action ? item.action : (() => item.screen && navigate.navigate(item.screen))}
                className={`flex-row items-center justify-between py-3 ${index < 4 ? 'border-b border-gray-100' : ''}`}
              >
                <View className="flex-row gap-2 items-center">
                  <item.Icon size={20} color="#4b5563" />
                  <Text className="text-base text-gray-800 font-medium">{item.text}</Text>
                </View>
                <ChevronRight size={18} color="#a0aec0" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}