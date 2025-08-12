import { useNavigation } from '@react-navigation/native';
import { MapPin, Check, Home, Building, MapPin as OtherIcon, LocateFixed } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Modal } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
const lightMapStyle = [];
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import BackHeader from 'components/BackHeader';
import { API_HEADER } from 'endp/bline';

export default function NewAddress() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    addressType: 'home',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    alternateNumber: '',
    latitude: null,
    longitude: null,
    isDefault: false
  });

  const [locLoading, setLocLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const API_BASE_URL = API_HEADER;

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

  const handleSubmit = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) { navigation.goBack(); return; }
      const payload = {
        type: formData.addressType,
        street: formData.addressLine1 + (formData.addressLine2 ? ', ' + formData.addressLine2 : ''),
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        zipCode: formData.pincode,
        alternateNumber: formData.alternateNumber,
        latitude: formData.latitude,
        longitude: formData.longitude,
        makeDefault: formData.isDefault
      };
      const resp = await fetch(`${API_BASE_URL}/auth/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (resp.ok) navigation.goBack();
      else console.log('Add address error', data);
    } catch (err) { console.log('Submit address error', err); }
  };

  const useCurrentLocation = async () => {
    try {
      setLocLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setLocLoading(false); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setFormData(prev => ({ ...prev, latitude: loc.coords.latitude, longitude: loc.coords.longitude }));
      // Reverse geocode to prefill (simplified)
      const geos = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      if (geos?.length) {
        const g = geos[0];
        setFormData(prev => ({
          ...prev,
          city: prev.city || g.city || g.district || '',
          state: prev.state || g.region || '',
          pincode: prev.pincode || g.postalCode || ''
        }));
      }
    } catch (err) { console.log('Location error', err); }
    finally { setLocLoading(false); }
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

          {/* Alternate Contact */}
          <Text className="text-sm font-medium text-gray-500 mb-3">ALTERNATE CONTACT (Optional)</Text>
          <View className="mb-6">
            <View className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
              <TextInput
                placeholder="Alternate Phone Number"
                value={formData.alternateNumber}
                onChangeText={(text) => handleChange('alternateNumber', text)}
                keyboardType="phone-pad"
                className="text-gray-800 text-base"
              />
              <Text className="text-xs text-gray-400 mt-1">Used if primary number not reachable.</Text>
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
          <Text className="text-sm font-medium text-gray-500 mb-3">LOCATION DETAILS</Text>
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
            <View className="flex-row gap-3">
              <TouchableOpacity onPress={useCurrentLocation} className="flex-1 flex-row items-center justify-center py-3 mb-6 bg-green-50 rounded-lg border border-green-200" disabled={locLoading}>
                {locLoading ? <ActivityIndicator size="small" color="#059669" /> : <LocateFixed size={18} color="green" className="mr-2" />}
                <Text className="text-green-600 font-medium ml-2">{locLoading ? 'Detecting...' : 'Use GPS Location'}</Text>
              </TouchableOpacity>
              {/* Placeholder for map picker button */}
              <TouchableOpacity onPress={() => { setShowMap(true); if (formData.latitude && formData.longitude) { setMapRegion(r=>({...r, latitude: formData.latitude, longitude: formData.longitude})); } }} className="flex-1 flex-row items-center justify-center py-3 mb-6 bg-blue-50 rounded-lg border border-blue-200">
                <MapPin size={18} color="#2563eb" />
                <Text className="text-blue-600 font-medium ml-2">Pick on Map</Text>
              </TouchableOpacity>
            </View>
            {formData.latitude && formData.longitude && (
              <Text className="text-xs text-gray-500 -mt-4 mb-4 text-center">Lat: {formData.latitude.toFixed(5)}, Lng: {formData.longitude.toFixed(5)}</Text>
            )}
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
      {/* Map Picker Modal */}
      <Modal visible={showMap} animationType="slide" onRequestClose={() => setShowMap(false)}>
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-4 pt-12 pb-3 border-b border-gray-200 bg-white">
            <Text className="text-lg font-semibold text-gray-800">Select Location</Text>
            <TouchableOpacity onPress={()=>setShowMap(false)} className="px-3 py-2">
              <Text className="text-red-500 font-medium">Close</Text>
            </TouchableOpacity>
          </View>
          <MapView
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            initialRegion={mapRegion}
            region={mapRegion}
            onRegionChangeComplete={(reg) => setMapRegion(reg)}
            showsUserLocation
            customMapStyle={lightMapStyle}
          >
            <Marker
              coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }}
              draggable
              onDragEnd={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                setMapRegion(r => ({ ...r, latitude, longitude }));
              }}
            />
          </MapView>
          <View className="p-4 bg-white border-t border-gray-200">
            <TouchableOpacity
              onPress={async () => {
                setFormData(prev => ({ ...prev, latitude: mapRegion.latitude, longitude: mapRegion.longitude }));
                // Attempt reverse geocode to refine city/state/pincode
                try {
                  const geos = await Location.reverseGeocodeAsync({ latitude: mapRegion.latitude, longitude: mapRegion.longitude });
                  if (geos?.length) {
                    const g = geos[0];
                    setFormData(prev => ({
                      ...prev,
                      city: prev.city || g.city || g.district || prev.city,
                      state: prev.state || g.region || prev.state,
                      pincode: prev.pincode || g.postalCode || prev.pincode
                    }));
                  }
                } catch (err) { console.log('Reverse geocode error', err); }
                setShowMap(false);
              }}
              className="bg-blue-600 py-4 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">Use This Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}