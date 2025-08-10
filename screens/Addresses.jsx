import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AlertBox from 'components/AlertBox';
import BackHeader from 'components/BackHeader';
import { ChevronRight, Plus, Building, Home, Hotel, MoreHorizontal, Share } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function Addresses() {
  const [activeOptions, setActiveOptions] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const navigation = useNavigation();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://192.168.1.38:5000';
  const iconMap = { home: Home, office: Building, other: MoreHorizontal, work: Building, hotel: Hotel };

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) { setLoading(false); return; }
      const resp = await fetch(`${API_BASE_URL}/auth/addresses`, { headers: { 'Authorization': `Bearer ${token}` }});
      const data = await resp.json();
      if (resp.ok) setAddresses(data.addresses || []);
    } catch (err) { console.log('Fetch addresses error', err); } finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { fetchAddresses(); }, [fetchAddresses]));

  const makeDefault = async (index) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const resp = await fetch(`${API_BASE_URL}/auth/addresses/${index}/default`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` }});
      const data = await resp.json();
      if (resp.ok) setAddresses(data.addresses);
    } catch (err) { console.log('Set default address error', err); }
  };

  const deleteAddress = async (index) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const resp = await fetch(`${API_BASE_URL}/auth/addresses/${index}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
      const data = await resp.json();
      if (resp.ok) setAddresses(data.addresses);
    } catch (err) { console.log('Delete address error', err); }
  };

  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);

  const handleDelete = (index) => {
    setPendingDeleteIndex(index);
    setShowDelete(true);
    setActiveOptions(null);
  };

  const handleCancelDelete = () => {
    setShowDelete(false);
  }

  const OptionsMenu = ({ addressIndex }) => (
    <TouchableWithoutFeedback onPress={() => { }}>
      <View className="absolute bottom-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40">
        <TouchableOpacity
          className="px-4 py-3 border-b border-gray-100"
          onPress={() => {
            navigation.navigate('EditAddress', { index: addressIndex, address: addresses[addressIndex] });
            setActiveOptions(null);
          }}
        >
          <Text className="text-gray-800">Edit Address</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-3 border-b border-gray-100"
          onPress={() => {
            console.log('Make Default', addressIndex);
            makeDefault(addressIndex);
            setActiveOptions(null);
          }}
        >
          <Text className="text-blue-600">Make Default</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-3"
          onPress={() => { handleDelete(addressIndex); }}
        >
          <Text className="text-red-500">Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );

  const handleOutsidePress = () => {
    // Close the options menu on any outside touch
    if (activeOptions) {
      setActiveOptions(null);
    }
    Keyboard.dismiss();
  };

  return (
    <>
      {showDelete && (
        <AlertBox
          title={"Delete Address"}
          message={"Are you sure you want to delete this address ?"}
          b1={"Delete"}
          b2={"Cancel"}
          onb1={() => { if (pendingDeleteIndex !== null) { deleteAddress(pendingDeleteIndex); setPendingDeleteIndex(null); } setShowDelete(false); }}
          onb2={handleCancelDelete}
        />
      )}
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View className="flex-1 bg-gray-100">
          <ScrollView keyboardShouldPersistTaps="handled" className="flex-1 pb-5">
            <BackHeader title="My Addresses" />

            <View className="p-4">
              {/* Add new address button */}
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white rounded-xl border border-gray-200 p-4 mb-3"
                onPress={() => navigation.navigate('AddNewAddress')}
              >
                <View className="flex-row items-center">
                  <View className="bg-green-500 rounded-full p-1 mr-3">
                    <Plus size={18} color="white" />
                  </View>
                  <Text className="text-base font-medium text-green-700">Add new address</Text>
                </View>
                <ChevronRight size={20} color="#4A5568" />
              </TouchableOpacity>

              <Text className="text-base font-semibold text-gray-700 mt-4 mb-3">Your saved addresses</Text>

              {/* Address list */}
              {loading && <Text className="text-gray-500 mb-2">Loading addresses...</Text>}
              {(!loading && addresses.length === 0) && (
                <Text className="text-gray-500 mb-3">No addresses saved yet.</Text>
              )}
              {addresses.map((address, idx) => {
                const Icon = iconMap[address.type] || Home;
                const description = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
                return (
                <View key={idx} className="bg-white p-4 rounded-xl border border-gray-200 mb-3 relative">
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-3">
                      <Icon size={20} color="#4A5568" />
                    </View>
                    <Text className="text-base font-semibold text-gray-800 capitalize">{address.type}</Text>
                    {address.isDefault && <Text className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Default</Text>}
                  </View>
                  <Text className="text-sm text-gray-600 mb-2">{description}</Text>
                  <View className="flex-row items-center justify-end">
                    <TouchableWithoutFeedback onPress={() => { }}>
                      <TouchableOpacity
                        className="mr-4"
                        onPress={() => {
                          setActiveOptions(activeOptions === idx ? null : idx);
                        }}
                      >
                        <MoreHorizontal size={20} color="#4A5568" />
                      </TouchableOpacity>
                    </TouchableWithoutFeedback>
                  </View>
                  {activeOptions === idx && <OptionsMenu addressIndex={idx} />}
                </View>
              ); })}
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
