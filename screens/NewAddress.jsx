import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, MapPin, Check } from 'lucide-react-native';
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
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'work', label: 'Work', icon: '🏢' },
    { id: 'other', label: 'Other', icon: '📍' }
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-gray-50"
    >
      <ScrollView className="flex-1">
        <BackHeader title="Add New Address" />
        
        <View className="p-4">
          {/* Address Type Selection */}
          <Text className="text-sm font-medium text-gray-500 mb-2">Address Type</Text>
          <View className="flex-row justify-between mb-6">
            {addressTypes.map(type => (
              <TouchableOpacity
                key={type.id}
                onPress={() => handleChange('addressType', type.id)}
                className={`flex-1 items-center py-2 mx-1 rounded-lg border ${formData.addressType === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
              >
                <Text className="text-2xl mb-1">{type.icon}</Text>
                <Text className="text-sm font-medium text-gray-700">{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Contact Information */}
          <Text className="text-sm font-medium text-gray-500 mb-2">Contact Information</Text>
          <View className="mb-6 space-y-3">
            <View className="bg-white p-3 rounded-lg border border-gray-200">
              <TextInput
                placeholder="Full Name"
                value={formData.fullName}
                onChangeText={(text) => handleChange('fullName', text)}
                className="text-gray-800"
              />
            </View>
            <View className="bg-white p-3 rounded-lg border border-gray-200">
              <TextInput
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
                keyboardType="phone-pad"
                className="text-gray-800"
              />
            </View>
          </View>

          {/* Address Information */}
          <Text className="text-sm font-medium text-gray-500 mb-2">Address Information</Text>
          <View className="mb-6 space-y-3">
            <View className="bg-white p-3 rounded-lg border border-gray-200">
              <TextInput
                placeholder="Address Line 1 (House No, Building)"
                value={formData.addressLine1}
                onChangeText={(text) => handleChange('addressLine1', text)}
                className="text-gray-800"
              />
            </View>
            <View className="bg-white p-3 rounded-lg border border-gray-200">
              <TextInput
                placeholder="Address Line 2 (Area, Colony)"
                value={formData.addressLine2}
                onChangeText={(text) => handleChange('addressLine2', text)}
                className="text-gray-800"
              />
            </View>
            <View className="bg-white p-3 rounded-lg border border-gray-200">
              <TextInput
                placeholder="Landmark (Optional)"
                value={formData.landmark}
                onChangeText={(text) => handleChange('landmark', text)}
                className="text-gray-800"
              />
            </View>
          </View>

          {/* Location Details */}
          <Text className="text-sm font-medium text-gray-500 mb-2">Location Details</Text>
          <View className="mb-6 space-y-3">
            <View className="flex-row space-x-3">
              <View className="flex-1 bg-white p-3 rounded-lg border border-gray-200">
                <TextInput
                  placeholder="City"
                  value={formData.city}
                  onChangeText={(text) => handleChange('city', text)}
                  className="text-gray-800"
                />
              </View>
              <View className="flex-1 bg-white p-3 rounded-lg border border-gray-200">
                <TextInput
                  placeholder="State"
                  value={formData.state}
                  onChangeText={(text) => handleChange('state', text)}
                  className="text-gray-800"
                />
              </View>
            </View>
            <View className="bg-white p-3 rounded-lg border border-gray-200">
              <TextInput
                placeholder="Pincode"
                value={formData.pincode}
                onChangeText={(text) => handleChange('pincode', text)}
                keyboardType="number-pad"
                className="text-gray-800"
              />
            </View>
          </View>

          {/* Set as Default */}
          <TouchableOpacity
            onPress={() => handleChange('isDefault', !formData.isDefault)}
            className="flex-row items-center mb-8"
          >
            <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${formData.isDefault ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
              {formData.isDefault && <Check size={14} color="white" />}
            </View>
            <Text className="text-gray-700">Set as default address</Text>
          </TouchableOpacity>

          {/* Use Current Location */}
          <TouchableOpacity className="flex-row items-center justify-center mb-6">
            <MapPin size={18} color="#3B82F6" className="mr-2" />
            <Text className="text-blue-500 font-medium">Use Current Location</Text>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-blue-500 py-4 rounded-lg items-center justify-center"
          >
            <Text className="text-white font-bold">Save Address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}