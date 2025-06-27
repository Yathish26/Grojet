import { Home, ShoppingCart, Layers2, UserRound } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BottomNav({ currentRoute }) {
  const navigation = useNavigation();

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md flex-row justify-around py-4 z-50">
      <TouchableOpacity onPress={() => navigation.navigate('Home')} className="items-center">
        <Home size={24} color={currentRoute === 'Home' ? 'green' : '#4A5568'} />
        <Text className={`text-xs ${currentRoute === 'Home' ? 'text-green-600' : 'text-gray-500'}`}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center">
        <ShoppingCart onPress={() => navigation.navigate('Orders')} size={24} color={currentRoute === 'Orders' ? 'green' : '#4A5568'} />
        <Text className={`text-xs ${currentRoute === 'Orders' ? 'text-green-600' : 'text-gray-500'}`}>Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center">
        <Layers2 size={24} color={currentRoute === 'Categories' ? 'green' : '#4A5568'} />
        <Text className={`text-xs ${currentRoute === 'Categories' ? 'text-green-600' : 'text-gray-500'}`}>Categories</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} className="items-center">
        <UserRound size={24} color={currentRoute === 'Profile' ? 'green' : '#4A5568'} />
        <Text className={`text-xs ${currentRoute === 'Profile' ? 'text-green-600' : 'text-gray-500'}`}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
