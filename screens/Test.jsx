import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Test() {
  const [rawJson, setRawJson] = useState('');

  useEffect(() => {
    const fetchRawJson = async () => {
      try {
        const value = await AsyncStorage.getItem('cart');
        setRawJson(value || 'No data found');
      } catch (error) {
        setRawJson('Error reading AsyncStorage');
        console.error('Error fetching @cart:', error);
      }
    };

    fetchRawJson();
  }, []);

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-lg font-bold mb-4">Raw Cart JSON</Text>
      <Text className="text-sm text-gray-800">{rawJson}</Text>
    </ScrollView>
  );
}
