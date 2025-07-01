import { Home, ShoppingCart, UserRound } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BottomNav({ currentRoute }) {
  const navigation = useNavigation();

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md flex-row justify-around py-2 z-50">
      
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        className="flex-1 items-center justify-center py-3"
        activeOpacity={0.7}
      >
        <Home size={24} color={currentRoute === 'Home' ? 'green' : '#4A5568'} />
        <Text className={`text-xs mt-1 ${currentRoute === 'Home' ? 'text-green-600' : 'text-gray-500'}`}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Orders')}
        className="flex-1 items-center justify-center py-3"
        activeOpacity={0.7}
      >
        <ShoppingCart size={24} color={currentRoute === 'Orders' ? 'green' : '#4A5568'} />
        <Text className={`text-xs mt-1 ${currentRoute === 'Orders' ? 'text-green-600' : 'text-gray-500'}`}>Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        className="flex-1 items-center justify-center py-3"
        activeOpacity={0.7}
      >
        <UserRound size={24} color={currentRoute === 'Profile' ? 'green' : '#4A5568'} />
        <Text className={`text-xs mt-1 ${currentRoute === 'Profile' ? 'text-green-600' : 'text-gray-500'}`}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
