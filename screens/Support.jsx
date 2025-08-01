import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { Phone, MessageSquare, MessageSquareText, ChevronRight } from 'lucide-react-native';
import BackHeader from 'components/BackHeader';
import { useNavigation } from '@react-navigation/native';

const Support = () => {
  const navigation = useNavigation();

  const handleCallHelpline = () => {
    const phoneNumber = 'tel:+918073215402';
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Error', 'Phone calls are not supported on this device.');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  const handleWhatsAppHelpline = () => {
    const whatsappNumber = '918073215402';
    const whatsappMessage = 'Hello, I need support regarding Grojet app.';
    const whatsappURL = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;

    Linking.canOpenURL(whatsappURL)
      .then(supported => {
        if (!supported) {
          Alert.alert('Error', 'WhatsApp is not installed on your device.');
        } else {
          return Linking.openURL(whatsappURL);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  const handleLiveChat = () => {
    Alert.alert('Live Chat', 'Connecting to live chat support...');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <BackHeader title="Support" />

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingTop: 20 }}>
        <View className="bg-white mx-2 p-5 rounded-xl border border-gray-200 mb-6">
          <Text className="text-xs uppercase text-gray-500 font-bold mb-4 tracking-wide">Helpline</Text>
          <TouchableOpacity
            onPress={handleCallHelpline}
            className="flex-row items-center justify-between py-3 border-b border-gray-100"
          >
            <View className="flex-row gap-2 items-center">
              <Phone size={20} color="#4b5563" />
              <Text className="text-base text-gray-800 font-medium">Call Support</Text>
            </View>
            <ChevronRight size={18} color="#a0aec0" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleWhatsAppHelpline}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row gap-2 items-center">
              <MessageSquareText size={20} color="#4b5563" />
              <Text className="text-base text-gray-800 font-medium">WhatsApp Chat</Text>
            </View>
            <ChevronRight size={18} color="#a0aec0" />
          </TouchableOpacity>
        </View>

        <View className="bg-white mx-2 p-5 rounded-xl border border-gray-200 mb-6">
          <Text className="text-xs uppercase text-gray-500 font-bold mb-4 tracking-wide">Live Assistance</Text>
          <TouchableOpacity
            onPress={handleLiveChat}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row gap-2 items-center">
              <MessageSquare size={20} color="#4b5563" />
              <Text className="text-base text-gray-800 font-medium">Start Live Chat</Text>
            </View>
            <ChevronRight size={18} color="#a0aec0" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Support;