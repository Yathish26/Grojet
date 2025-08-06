import BackHeader from 'components/BackHeader';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';

export default function Test() {
  const [rawJson, setRawJson] = useState('');
  const [error, setError] = useState('');

  return (
    <>
      <BackHeader title="Test" />
      <ScrollView className="flex-1 p-4 bg-white">
        <Text className="text-lg font-bold mb-4">Raw Categories JSON</Text>
        <Button title="Fetch" onPress={() => {}} />
      </ScrollView>
    </>
  );
}
