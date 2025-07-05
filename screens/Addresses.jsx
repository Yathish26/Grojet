import { useNavigation } from '@react-navigation/native';
import AlertBox from 'components/AlertBox';
import BackHeader from 'components/BackHeader';
import { ChevronRight, Plus, Building, Home, Hotel, MoreHorizontal, Share } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

export default function Addresses() {
  const [activeOptions, setActiveOptions] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const navigation = useNavigation();

  const addressData = [
    {
      id: 'work',
      icon: Building,
      title: 'Work',
      description:
        'Akash Electronics Sumudha Arcade, Ground Floor, Ganeshpura, Kaikamba, Mangaluru, Opposite SBI',
    },
    {
      id: 'home',
      icon: Home,
      title: 'Home',
      description: 'Deviprasad Building Battakodi Kinnigoli, Surathkal, Kinnigoli',
    },
    {
      id: 'hotel',
      icon: Hotel,
      title: 'Hotel',
      description:
        'Hotel Sasthi Suites KN Extension 4th Cross Triveni Road, Kamla Nehru, Extension, Yeswanthpur, Bengaluru',
    },
  ];

  const handleDelete = () => {
    setShowDelete(true);
    setActiveOptions(null)
  }

  const handleCancelDelete = () => {
    setShowDelete(false);
  }

  const OptionsMenu = ({ addressId }) => (
    <TouchableWithoutFeedback onPress={() => { }}>
      <View className="absolute bottom-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40">
        <TouchableOpacity
          className="px-4 py-3 border-b border-gray-100"
          onPress={() => {
            console.log('Edit', addressId);
            setActiveOptions(null);
          }}
        >
          <Text className="text-gray-800">Edit Address</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-3 border-b border-gray-100"
          onPress={() => {
            console.log('Make Default', addressId);
            setActiveOptions(null);
          }}
        >
          <Text className="text-blue-600">Make Default</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-3"
          onPress={handleDelete}
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
          onb1={console.log.bind(null, 'Address Deleted')}
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
              {addressData.map((address) => (
                <View key={address.id} className="bg-white p-4 rounded-xl border border-gray-200 mb-3 relative">
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-3">
                      <address.icon size={20} color="#4A5568" />
                    </View>
                    <Text className="text-base font-semibold text-gray-800">{address.title}</Text>
                  </View>
                  <Text className="text-sm text-gray-600 mb-2">{address.description}</Text>
                  <View className="flex-row items-center justify-end">
                    <TouchableWithoutFeedback onPress={() => { }}>
                      <TouchableOpacity
                        className="mr-4"
                        onPress={() => {
                          setActiveOptions(activeOptions === address.id ? null : address.id);
                        }}
                      >
                        <MoreHorizontal size={20} color="#4A5568" />
                      </TouchableOpacity>
                    </TouchableWithoutFeedback>
                  </View>
                  {activeOptions === address.id && <OptionsMenu addressId={address.id} />}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
