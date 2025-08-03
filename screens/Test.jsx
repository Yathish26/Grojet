import BackHeader from 'components/BackHeader';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function Test() {
  const [rawJson, setRawJson] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://192.168.1.38:5000/categories');
        const data = await response.json();
        setRawJson(JSON.stringify(data, null, 2));
        setError('');
      } catch (err) {
        setRawJson('');
        setError(`Error fetching categories: ${err.message}`);
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <BackHeader title="Test" />
      <ScrollView className="flex-1 p-4 bg-white">
        <Text className="text-lg font-bold mb-4">Raw Categories JSON</Text>
        {error ? (
          <Text className="text-sm text-red-600">{error}</Text>
        ) : (
          <Text className="text-sm text-gray-800">{rawJson}</Text>
        )}
      </ScrollView>
    </>
  );
}
