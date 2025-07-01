import { useNavigation } from '@react-navigation/native';
import BackHeader from 'components/BackHeader';
import { ChevronRight, Plus, Building, Home, Hotel, MoreHorizontal, Share2, X, MoveLeftIcon, ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'; // Re-importing React Native components

export default function Addresses() {
  return (
    <ScrollView className="flex-1 bg-gray-100 pb-20"> {/* Added pb-20 for bottom padding */}
      {/* Header with back button */}
      <BackHeader title="My Addresses" />

      <View className="p-4">
        {/* Add new address */}
        <TouchableOpacity
          className="flex-row items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-3"
          onPress={() => console.log('Add new address pressed')}
        >
          <View className="flex-row items-center">
            <View className="bg-green-500 rounded-full p-1 mr-3">
              <Plus size={18} color="white" />
            </View>
            <Text className="text-base font-medium text-green-700">Add new address</Text>
          </View>
          <ChevronRight size={20} color="#4A5568" />
        </TouchableOpacity>

        {/* Your saved addresses header */}
        <Text className="text-base font-semibold text-gray-700 mt-4 mb-3">Your saved addresses</Text>

        {/* Address Card: Work */}
        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3">
          <View className="flex-row items-center mb-2">
            <View className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              <Building size={20} color="#4A5568" />
            </View>
            <Text className="text-base font-semibold text-gray-800">Work</Text>
          </View>
          <Text className="text-sm text-gray-600 mb-2">Akash Electronics Sumudha Arcade, Ground Floor, Ganeshpura, Kaikamba, Mangaluru, Opposite SBI</Text>
          <View className="flex-row items-center justify-end">
            <TouchableOpacity onPress={() => console.log('More options for Work')} className="mr-4">
              <MoreHorizontal size={20} color="#4A5568" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Share Work address')}>
              <Share2 size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Address Card: Home */}
        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3">
          <View className="flex-row items-center mb-2">
            <View className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              <Home size={20} color="#4A5568" />
            </View>
            <Text className="text-base font-semibold text-gray-800">Home</Text>
          </View>
          <Text className="text-sm text-gray-600 mb-2">Deviprasad Building Battakodi Kinnigoli, Surathkal, Kinnigoli</Text>
          <View className="flex-row items-center justify-end">
            <TouchableOpacity onPress={() => console.log('More options for Home')} className="mr-4">
              <MoreHorizontal size={20} color="#4A5568" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Share Home address')}>
              <Share2 size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Address Card: Hotel */}
        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3">
          <View className="flex-row items-center mb-2">
            <View className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              <Hotel size={20} color="#4A5568" />
            </View>
            <Text className="text-base font-semibold text-gray-800">Hotel</Text>
          </View>
          <Text className="text-sm text-gray-600 mb-2">Hotel Sasthi Suites KN Extension 4th Cross Triveni Road, Kamla Nehru, Extension, Yeswanthpur, Bengaluru, Opposite to Cauvery ...</Text>
          <View className="flex-row items-center justify-end">
            <TouchableOpacity onPress={() => console.log('More options for Hotel')} className="mr-4">
              <MoreHorizontal size={20} color="#4A5568" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Share Hotel address')}>
              <Share2 size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
