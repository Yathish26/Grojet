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
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const [theme, setTheme] = useState('LIGHT');

  const handleThemeToggle = () => {
    setTheme(prev => (prev === 'LIGHT' ? 'DARK' : 'LIGHT'));
  };

  const navigate = useNavigation();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => navigate.goBack()}>
          <ChevronLeft size={20} color="#4A5568" /> {/* Using ArrowLeft icon */}
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-800 ml-4">Profile</Text> {/* Added ml-4 for spacing */}
      </View>
      {/* Account Section */}
      <View className="bg-white p-5 border-gray-100">
        <Text className="text-lg font-extrabold text-gray-800 mb-3">Your account</Text>
        <View className="flex-row gap-2 items-center mb-5">
          <Phone size={20} color="#4b5563" />
          <Text className="text-gray-700 text-base font-medium">8073215402</Text>
        </View>

        {/* Birthday Card */}
        <View className="flex-row items-center justify-between bg-emerald-50 rounded-xl p-4 overflow-hidden relative border border-emerald-100">
          <View className="flex-shrink pr-4">
            <Text className="font-semibold text-gray-800 mb-1">Add your birthday</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-emerald-600 font-bold text-sm">Enter details</Text>
              <ChevronRight size={16} color="#059669" />
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: 'https://placehold.co/80x80/d1fae5/059669?text=🎂' }}
            className="absolute -right-4 -bottom-4 opacity-70 w-20 h-20 rounded-full"
          />
        </View>
      </View>

      <ScrollView className="p-4">
        {/* Quick Links */}
        <View className="flex-row justify-between mb-6 space-x-3">
          <TouchableOpacity className="flex-1 items-center justify-center bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <LifeBuoy size={26} color="#4b5563" />
            <Text className="text-sm text-gray-700 text-center font-medium mt-2">Support</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center justify-center bg-white p-4 rounded-xl shadow-md border border-gray-100">
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
            { Icon: Book, text: 'Bookmarked recipes', screen: 'Bookmarks' },
            { Icon: MapPin, text: 'Address book', screen: 'AddressBook' },
            { Icon: Receipt, text: 'GST details', screen: 'GSTDetails' },
            { Icon: Gift, text: 'E-Gift Cards', screen: 'GiftCards' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigate.navigate(item.screen)}
              className={`flex-row items-center justify-between py-3 ${index < 5 ? 'border-b border-gray-100' : ''}`}
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
            { Icon: CreditCard, text: 'Grojet Money' },
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
            { Icon: Wallet, text: 'Share the App' },
            { Icon: Info, text: 'About us' },
            { Icon: Lock, text: 'Account Privacy' },
            { Icon: Bell, text: 'Notifications' },
            { Icon: LogOut, text: 'Log Out' },
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
      </ScrollView>
    </View>
  );
}
