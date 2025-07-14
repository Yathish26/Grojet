import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, MapPin, Check, Home, Building, MapPin as OtherIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import BackHeader from 'components/BackHeader';

export default function NewAddress() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    addressType: 'home',
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const addressTypes = [
    { id: 'home', label: 'Home', icon: <Home size={20} color="green" /> },
    { id: 'work', label: 'Work', icon: <Building size={20} color="green" /> },
    { id: 'other', label: 'Other', icon: <OtherIcon size={20} color="green" /> }
  ];

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Address submitted:', formData);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      behavior='padding'
      className="flex-1 bg-gray-50"
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <BackHeader title="Add New Address" />
        
        <View className="px-4 pt-2">
          {/* Address Type Selection */}
          <Text className="text-sm font-medium text-gray-500 mb-3">ADDRESS TYPE</Text>
          <View className="flex-row justify-between mb-6">
            {addressTypes.map(type => (
              <TouchableOpacity
                key={type.id}
                onPress={() => handleChange('addressType', type.id)}
                className={`flex-1 items-center py-3 mx-1 rounded-lg ${formData.addressType === type.id ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200'}`}
              >
                <View className="mb-2">
                  {type.icon}
                </View>
                <Text className="text-sm font-medium text-gray-700">{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Contact Information */}
          <Text className="text-sm font-medium text-gray-500 mb-3">CONTACT INFORMATION</Text>
          <View className="mb-6 space-y-4">
            <View className="bg-white p-4 rounded-lg border border-gray-200">
              <TextInput
                placeholder="Full Name"
                value={formData.fullName}
                onChangeText={(text) => handleChange('fullName', text)}
                className="text-gray-800 text-base"
              />
            </View>
            <View className="bg-white p-4 rounded-lg border border-gray-200">
              <TextInput
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
                keyboardType="phone-pad"
                className="text-gray-800 text-base"
              />
            </View>
          </View>

          {/* Address Information */}
          <Text className="text-sm font-medium text-gray-500 mb-3">ADDRESS DETAILS</Text>
          <View className="mb-6 space-y-4">
            <View className="bg-white p-4 rounded-lg border border-gray-200">
              <TextInput
                placeholder="House No, Building Name"
                value={formData.addressLine1}
                onChangeText={(text) => handleChange('addressLine1', text)}
                className="text-gray-800 text-base"
              />
            </View>
            <View className="bg-white p-4 rounded-lg border border-gray-200">
              <TextInput
                placeholder="Area, Colony, Street"
                value={formData.addressLine2}
                onChangeText={(text) => handleChange('addressLine2', text)}
                className="text-gray-800 text-base"
              />
            </View>
            <View className="bg-white p-4 rounded-lg border border-gray-200">
              <TextInput
                placeholder="Landmark (Optional)"
                value={formData.landmark}
                onChangeText={(text) => handleChange('landmark', text)}
                className="text-gray-800 text-base"
              />
            </View>
          </View>

          {/* Location Details */}
          <Text className="text-sm font-medium text-gray-500 mb-3">LOCATION</Text>
          <View className="mb-6 space-y-4">
            <View className="flex-row space-x-3">
              <View className="flex-1 bg-white p-4 rounded-lg border border-gray-200">
                <TextInput
                  placeholder="City"
                  value={formData.city}
                  onChangeText={(text) => handleChange('city', text)}
                  className="text-gray-800 text-base"
                />
              </View>
              <View className="flex-1 bg-white p-4 rounded-lg border border-gray-200">
                <TextInput
                  placeholder="State"
                  value={formData.state}
                  onChangeText={(text) => handleChange('state', text)}
                  className="text-gray-800 text-base"
                />
              </View>
            </View>
            <View className="bg-white p-4 rounded-lg border border-gray-200">
              <TextInput
                placeholder="Pincode"
                value={formData.pincode}
                onChangeText={(text) => handleChange('pincode', text)}
                keyboardType="number-pad"
                className="text-gray-800 text-base"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={() => handleChange('isDefault', !formData.isDefault)}
              className="flex-row items-center mb-6"
            >
              <View className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center ${formData.isDefault ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {formData.isDefault && <Check size={14} color="white" />}
              </View>
              <Text className="text-gray-700">Set as default address</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-center py-3 mb-6">
              <MapPin size={18} color="green" className="mr-2" />
              <Text className="text-green-500 font-medium">Use Current Location</Text>
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-green-600 py-4 rounded-lg items-center justify-center shadow-sm"
            activeOpacity={0.9}
          >
            <Text className="text-white font-bold text-base">Save Address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}