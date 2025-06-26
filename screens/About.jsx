import React from 'react';
import { View, Text } from 'react-native';

export default function About() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-3xl font-bold text-blue-600 mb-4">About This App</Text>
      <Text className="text-lg text-gray-700 text-center mb-6">
        This app is built using React Native and NativeWind, showcasing the power of utility-first styling in mobile development.
      </Text>
      <Text className="text-md text-center text-gray-500">
        Explore the features and enjoy a seamless user experience!
      </Text>
    </View>
  );
}
