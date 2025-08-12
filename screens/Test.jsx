import BackHeader from 'components/BackHeader';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { API_HEADER } from '../endp/bline';

export default function Test() {
  const [rawJson, setRawJson] = useState('');
  const [error, setError] = useState('');
  const API_BASE_URL = API_HEADER;

  const fetchTest = async () => {
    setError('');
    setRawJson('');
    try {
      const resp = await fetch(`${API_BASE_URL}/tools/network/health`, {
        headers: { 'Authorization': '' } // Add token if needed
      });
      const data = await resp.json();
      if (resp.ok) setRawJson(JSON.stringify(data, null, 2));
      else setError(data.message || 'Error fetching');
    } catch (err) {
      setError(err.message || 'Network error');
    }
  };

  return (
    <>
      <BackHeader title="Test" />
      <ScrollView className="flex-1 p-4 bg-white">
        <Text className="text-lg font-bold mb-4">Raw Backend JSON</Text>
        <Button title="Fetch" onPress={fetchTest} />
        {rawJson ? (
          <Text className="mt-4 text-xs text-gray-800 whitespace-pre-wrap">{rawJson}</Text>
        ) : null}
        {error ? (
          <Text className="mt-4 text-xs text-red-500">{error}</Text>
        ) : null}
      </ScrollView>
    </>
  );
}
