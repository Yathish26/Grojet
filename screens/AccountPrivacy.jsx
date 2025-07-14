import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Lock, Eye, EyeOff, Trash, Trash2, ChevronRight } from 'lucide-react-native';
import BackHeader from 'components/BackHeader';
import { useNavigation } from '@react-navigation/native';

const AccountPrivacy = () => {
  const navigation = useNavigation();

  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  const handleChangePassword = (name, value) => {
    setPasswordFormData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordFormData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordFormData.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwordFormData.newPassword.length < 6) newErrors.newPassword = 'New password must be at least 6 characters';
    if (passwordFormData.newPassword !== passwordFormData.confirmNewPassword) newErrors.confirmNewPassword = 'Passwords do not match';

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChangeSubmit = () => {
    if (validatePasswordForm()) {
      setIsPasswordChanging(true);
      console.log('Password change submitted:', passwordFormData);
      setTimeout(() => {
        setIsPasswordChanging(false);
        Alert.alert('Password Changed', 'Your password has been successfully updated!');
        setPasswordFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setPasswordErrors({});
      }, 1500);
    }
  };

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
        {/* Password Change Card */}
        <View className="bg-white mx-4 p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <Text className="text-xs uppercase text-gray-500 font-bold mb-5 tracking-wider">Change Password</Text>

          {/* Current Password */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-600 mb-2">Current Password</Text>
            <View className={`flex-row items-center bg-gray-50 rounded-xl border ${passwordErrors.currentPassword ? 'border-red-400' : 'border-gray-200'} px-4 h-14`}>
              <Lock size={18} color="#6B7280" className="mr-3" />
              <TextInput
                placeholder="Enter current password"
                value={passwordFormData.currentPassword}
                onChangeText={(text) => handleChangePassword('currentPassword', text)}
                secureTextEntry={!showCurrentPassword}
                className="flex-1 text-gray-800 font-medium"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                className="p-2"
              >
                {showCurrentPassword ?
                  <EyeOff size={18} color="#6B7280" /> :
                  <Eye size={18} color="#6B7280" />
                }
              </TouchableOpacity>
            </View>
            {passwordErrors.currentPassword &&
              <Text className="text-red-500 text-xs mt-1.5 ml-1">{passwordErrors.currentPassword}</Text>
            }
          </View>

          {/* New Password */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-600 mb-2">New Password</Text>
            <View className={`flex-row items-center bg-gray-50 rounded-xl border ${passwordErrors.newPassword ? 'border-red-400' : 'border-gray-200'} px-4 h-14`}>
              <Lock size={18} color="#6B7280" className="mr-3" />
              <TextInput
                placeholder="Create new password"
                value={passwordFormData.newPassword}
                onChangeText={(text) => handleChangePassword('newPassword', text)}
                secureTextEntry={!showNewPassword}
                className="flex-1 text-gray-800 font-medium"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                className="p-2"
              >
                {showNewPassword ?
                  <EyeOff size={18} color="#6B7280" /> :
                  <Eye size={18} color="#6B7280" />
                }
              </TouchableOpacity>
            </View>
            {passwordErrors.newPassword &&
              <Text className="text-red-500 text-xs mt-1.5 ml-1">{passwordErrors.newPassword}</Text>
            }
          </View>

          {/* Confirm Password */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-600 mb-2">Confirm New Password</Text>
            <View className={`flex-row items-center bg-gray-50 rounded-xl border ${passwordErrors.confirmNewPassword ? 'border-red-400' : 'border-gray-200'} px-4 h-14`}>
              <Lock size={18} color="#6B7280" className="mr-3" />
              <TextInput
                placeholder="Re-enter new password"
                value={passwordFormData.confirmNewPassword}
                onChangeText={(text) => handleChangePassword('confirmNewPassword', text)}
                secureTextEntry={!showConfirmNewPassword}
                className="flex-1 text-gray-800 font-medium"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                className="p-2"
              >
                {showConfirmNewPassword ?
                  <EyeOff size={18} color="#6B7280" /> :
                  <Eye size={18} color="#6B7280" />
                }
              </TouchableOpacity>
            </View>
            {passwordErrors.confirmNewPassword &&
              <Text className="text-red-500 text-xs mt-1.5 ml-1">{passwordErrors.confirmNewPassword}</Text>
            }
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handlePasswordChangeSubmit}
            className={`bg-green-600 py-4 rounded-xl items-center justify-center ${isPasswordChanging ? 'opacity-80' : ''}`}
            activeOpacity={0.9}
            disabled={isPasswordChanging}
          >
            <Text className="text-white font-bold text-base">
              {isPasswordChanging ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                'Change Password'
              )}
            </Text>
          </TouchableOpacity>
        </View>

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