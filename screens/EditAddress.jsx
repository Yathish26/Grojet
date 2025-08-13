import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, ActivityIndicator, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MapPin, Check, Home, Building, MapPin as OtherIcon, LocateFixed } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import BackHeader from 'components/BackHeader';
import { API_HEADER } from 'endp/bline';

const iconDefs = {
  home: <Home size={20} color="green" />,
  work: <Building size={20} color="green" />,
  other: <OtherIcon size={20} color="green" />
};

export default function EditAddress() {
  const route = useRoute();
  const navigation = useNavigation();
  const { index, address } = route.params || {};
  const [formData, setFormData] = useState({
    addressType: address?.type || 'home',
    addressLine1: (address?.street || '').split(',')[0] || '',
    addressLine2: (address?.street || '').split(',').slice(1).join(', ').trim(),
    landmark: address?.landmark || '',
    city: address?.city || '',
    state: address?.state || '',
    pincode: address?.zipCode || '',
    alternateNumber: address?.alternateNumber || '',
    latitude: address?.coordinates?.latitude || null,
    longitude: address?.coordinates?.longitude || null,
    isDefault: address?.isDefault || false
  });
  const [locLoading, setLocLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: formData.latitude || 12.9716,
    longitude: formData.longitude || 77.5946,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const API_BASE_URL = API_HEADER;

  const handleChange = (name, value) => setFormData(p => ({ ...p, [name]: value }));

  const useCurrentLocation = async () => {
    try {
      setLocLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setLocLoading(false); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setFormData(prev => ({ ...prev, latitude: loc.coords.latitude, longitude: loc.coords.longitude }));
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
    } catch (e) { console.log('Location error', e); } finally { setLocLoading(false); }
  };

  const handleSubmit = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
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
      const resp = await fetch(`${API_BASE_URL}/auth/addresses/${index}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (resp.ok) navigation.goBack();
      else console.log('Update address error');
    } catch (e) { console.log('Submit edit error', e); }
  };

  return (
    <>
      <BackHeader title='Edit Address' />
      <KeyboardAvoidingView behavior='padding' className='flex-1 bg-gray-50'>
        <ScrollView className='flex-1' contentContainerStyle={{ paddingBottom: 24 }}>

          <View className='px-4 pt-2'>
            <Text className='text-sm font-medium text-gray-500 mb-3'>ADDRESS TYPE</Text>
            <View className='flex-row justify-between mb-6'>
              {['home', 'work', 'other'].map(t => (
                <TouchableOpacity key={t} onPress={() => handleChange('addressType', t)} className={`flex-1 items-center py-3 mx-1 rounded-lg ${formData.addressType === t ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200'}`}>
                  <View className='mb-2'>{iconDefs[t]}</View>
                  <Text className='text-sm font-medium text-gray-700 capitalize'>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text className='text-sm font-medium text-gray-500 mb-3'>ADDRESS DETAILS</Text>
            <View className='space-y-4 mb-6'>
              <View className='bg-white p-4 rounded-lg border border-gray-200'>
                <TextInput placeholder='House No, Building Name' value={formData.addressLine1} onChangeText={v => handleChange('addressLine1', v)} className='text-gray-800 text-base' />
              </View>
              <View className='bg-white p-4 rounded-lg border border-gray-200'>
                <TextInput placeholder='Area, Colony, Street' value={formData.addressLine2} onChangeText={v => handleChange('addressLine2', v)} className='text-gray-800 text-base' />
              </View>
              <View className='bg-white p-4 rounded-lg border border-gray-200'>
                <TextInput placeholder='Landmark (Optional)' value={formData.landmark} onChangeText={v => handleChange('landmark', v)} className='text-gray-800 text-base' />
              </View>
            </View>
            <Text className='text-sm font-medium text-gray-500 mb-3'>LOCATION DETAILS</Text>
            <View className='space-y-4 mb-6'>
              <View className='flex-row space-x-3'>
                <View className='flex-1 bg-white p-4 rounded-lg border border-gray-200'>
                  <TextInput placeholder='City' value={formData.city} onChangeText={v => handleChange('city', v)} className='text-gray-800 text-base' />
                </View>
                <View className='flex-1 bg-white p-4 rounded-lg border border-gray-200'>
                  <TextInput placeholder='State' value={formData.state} onChangeText={v => handleChange('state', v)} className='text-gray-800 text-base' />
                </View>
              </View>
              <View className='bg-white p-4 rounded-lg border border-gray-200'>
                <TextInput placeholder='Pincode' value={formData.pincode} onChangeText={v => handleChange('pincode', v)} keyboardType='number-pad' className='text-gray-800 text-base' />
              </View>
              <View className='bg-white p-4 rounded-lg border border-gray-200'>
                <TextInput placeholder='Alternate Phone Number' value={formData.alternateNumber} onChangeText={v => handleChange('alternateNumber', v)} keyboardType='phone-pad' className='text-gray-800 text-base' />
                <Text className='text-xs text-gray-400 mt-1'>Used if primary number not reachable.</Text>
              </View>
            </View>
            <View className='mb-6'>
              <TouchableOpacity onPress={() => handleChange('isDefault', !formData.isDefault)} className='flex-row items-center mb-6'>
                <View className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center ${formData.isDefault ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>{formData.isDefault && <Check size={14} color='white' />}</View>
                <Text className='text-gray-700'>Set as default address</Text>
              </TouchableOpacity>
              <View className='flex-row gap-3'>
                <TouchableOpacity onPress={useCurrentLocation} disabled={locLoading} className='flex-1 flex-row items-center justify-center py-3 mb-6 bg-green-50 rounded-lg border border-green-200'>
                  {locLoading ? <ActivityIndicator size='small' color='#059669' /> : <LocateFixed size={18} color='green' />}
                  <Text className='text-green-600 font-medium ml-2'>{locLoading ? 'Detecting...' : 'Use GPS'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowMap(true)} className='flex-1 flex-row items-center justify-center py-3 mb-6 bg-blue-50 rounded-lg border border-blue-200'>
                  <MapPin size={18} color='#2563eb' />
                  <Text className='text-blue-600 font-medium ml-2'>Pick on Map</Text>
                </TouchableOpacity>
              </View>
              {formData.latitude && formData.longitude && <Text className='text-xs text-gray-500 -mt-4 mb-4 text-center'>Lat: {formData.latitude.toFixed(5)}, Lng: {formData.longitude.toFixed(5)}</Text>}
            </View>
            <TouchableOpacity onPress={handleSubmit} className='bg-green-600 py-4 rounded-full items-center justify-center shadow-sm' activeOpacity={0.9}>
              <Text className='text-white font-bold text-base'>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Modal visible={showMap} animationType='slide' onRequestClose={() => setShowMap(false)}>
          <View className='flex-1 bg-white'>
            <View className='flex-row items-center justify-between px-4 pt-12 pb-3 border-b border-gray-200 bg-white'>
              <Text className='text-lg font-semibold text-gray-800'>Adjust Location</Text>
              <TouchableOpacity onPress={() => setShowMap(false)} className='px-3 py-2'><Text className='text-red-500 font-medium'>Close</Text></TouchableOpacity>
            </View>
            <MapView style={{ flex: 1 }} provider={PROVIDER_GOOGLE} initialRegion={mapRegion} region={mapRegion} onRegionChangeComplete={r => setMapRegion(r)} showsUserLocation>
              <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} draggable onDragEnd={(e) => { const { latitude, longitude } = e.nativeEvent.coordinate; setMapRegion(r => ({ ...r, latitude, longitude })); }} />
            </MapView>
            <View className='p-4 bg-white border-t border-gray-200'>
              <TouchableOpacity onPress={async () => { setFormData(p => ({ ...p, latitude: mapRegion.latitude, longitude: mapRegion.longitude })); try { const geos = await Location.reverseGeocodeAsync({ latitude: mapRegion.latitude, longitude: mapRegion.longitude }); if (geos?.length) { const g = geos[0]; setFormData(p => ({ ...p, city: p.city || g.city || g.district || '', state: p.state || g.region || '', pincode: p.pincode || g.postalCode || '' })); } } catch (e) { console.log('Reverse geocode error', e); } setShowMap(false); }} className='bg-blue-600 py-4 rounded-lg items-center'>
                <Text className='text-white font-semibold'>Use This Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </>
  );
}
