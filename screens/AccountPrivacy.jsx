import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Lock, Eye, EyeOff, Trash, Trash2, ChevronRight } from 'lucide-react-native';
import BackHeader from 'components/BackHeader';
import { useNavigation } from '@react-navigation/native';

const AccountPrivacy = () => {
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <BackHeader title="Account Privacy" />

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
      >

        {/* Account Deletion Card */}
        <View className="bg-white mx-4 p-6 rounded-2xl shadow-sm border border-gray-100">
          <Text className="text-xs uppercase text-gray-500 font-bold mb-5 tracking-wider">Account Termination</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('DeleteAccount')}
            className="flex-row items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center gap-2">
              <Trash2 size={20} color="green" className="mr-3" />
              <View>
                <Text className="text-gray-900 font-semibold">Delete Account</Text>
                <Text className="text-gray-500 text-xs mt-0.5">Permanent action - cannot be undone</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AccountPrivacy;