import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { useUser } from '../context/UserContext';
import BackHeader from 'components/BackHeader';
import { API_HEADER } from 'endp/bline';

const API_BASE_URL = API_HEADER;

export default function CompleteProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { updateUser } = useUser();

  // Animated values for OTP container
  const otpAnim = useRef(new Animated.Value(0)).current; // 0 = hidden, 1 = visible

  // Animate OTP input sliding down & fading in when emailOtpSent becomes true
  useEffect(() => {
    if (emailOtpSent && !emailVerified) {
      Animated.timing(otpAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(otpAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [emailOtpSent, emailVerified, otpAnim]);

  const otpTranslateY = otpAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0], // slide down from -20 to 0
  });
  const otpOpacity = otpAnim;

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your name to continue.');
      return;
    }
    const desiredEmail = email.trim().toLowerCase();
    if (desiredEmail && !emailVerified) {
      Alert.alert('Verify email', 'Please verify your email before continuing.');
      return;
    }
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      const res = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Platform': 'native',
        },
        body: JSON.stringify({ name: name.trim() || undefined, email: desiredEmail || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Error', data.message || 'Failed to update profile');
        return;
      }

      await updateUser(data.user);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (err) {
      console.error('Complete profile error:', err);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleSendEmailOtp = async () => {
    const desiredEmail = email.trim().toLowerCase();
    if (!desiredEmail) {
      Alert.alert('Enter email', 'Please enter your email.');
      return;
    }
    if (!emailRegex.test(desiredEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    try {
      setEmailBusy(true);
      const token = await SecureStore.getItemAsync('userToken');
      const res = await fetch(`${API_BASE_URL}/auth/email/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token || ''}` },
        body: JSON.stringify({ email: desiredEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to send email OTP');
      setEmailOtpSent(true);
      setEmailVerified(false);
      Alert.alert('OTP sent', `We sent a verification code to ${desiredEmail}`);
    } catch (err) {
      Alert.alert('Email OTP', err.message || 'Failed to send OTP');
    } finally {
      setEmailBusy(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp.trim()) {
      Alert.alert('Enter code', 'Please enter the verification code.');
      return;
    }
    try {
      setEmailBusy(true);
      const token = await SecureStore.getItemAsync('userToken');
      const res = await fetch(`${API_BASE_URL}/auth/email/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token || ''}` },
        body: JSON.stringify({ otp: emailOtp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Invalid or expired code');
      await updateUser(data.user);
      setEmailVerified(true);
      setEmailOtp('');
      setEmailOtpSent(false);
      setEmail(data.user.email || '');
      Alert.alert('Verified', 'Email verified successfully.');
    } catch (err) {
      Alert.alert('Verification failed', err.message || 'Please check the code and try again.');
    } finally {
      setEmailBusy(false);
    }
  };

  return (
    <>
      <BackHeader title="Complete Profile" middle={true} noback={true} />
      <View className="flex-1 bg-white">
        <View className="p-6">
          <Text className="text-gray-500 mb-6">
            Add your details to finish setting up your account.
          </Text>

          <Text className="text-gray-700 mb-2">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            className="border border-gray-200 rounded-xl p-3 mb-6 bg-gray-50"
          />

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-700">Email (optional)</Text>
            {emailVerified && (
              <View className="px-2 py-1 rounded-full bg-green-100 border border-green-300">
                <Text className="text-green-700 text-[11px] font-semibold">Verified</Text>
              </View>
            )}
          </View>
          <TextInput
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setEmailVerified(false);
              setEmailOtp('');
              setEmailOtpSent(false);
            }}
            placeholder="Email"
            className="border border-gray-200 rounded-xl p-3 bg-gray-50"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {!emailVerified && email.length > 0 && (
            <TouchableOpacity
              disabled={emailBusy}
              onPress={handleSendEmailOtp}
              className={`bg-green-600 rounded-xl py-3 items-center mt-4 ${emailBusy ? 'opacity-80' : ''}`}
            >
              <Text className="text-white font-semibold">{emailOtpSent ? 'Resend OTP' : 'Send OTP'}</Text>
            </TouchableOpacity>
          )}

          {/* Animated OTP container */}
          <Animated.View
            style={{
              opacity: otpOpacity,
              transform: [{ translateY: otpTranslateY }],
              marginTop: 20,
            }}
            pointerEvents={emailOtpSent && !emailVerified ? 'auto' : 'none'}
          >
            {!emailVerified && emailOtpSent && (
              <>
                <Text className="text-gray-700 mb-2">Enter OTP</Text>
                <TextInput
                  value={emailOtp}
                  onChangeText={setEmailOtp}
                  placeholder="6-digit code"
                  className="border border-gray-200 rounded-xl p-3 bg-gray-50"
                  keyboardType="number-pad"
                />
                <TouchableOpacity
                  disabled={emailBusy}
                  onPress={handleVerifyEmailOtp}
                  className={`bg-emerald-600 rounded-xl py-3 items-center mt-4 ${emailBusy ? 'opacity-80' : ''}`}
                >
                  <Text className="text-white font-semibold">Verify Email</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            className="bg-green-600 rounded-xl py-4 items-center mt-10 mb-4"
          >
            <Text className="text-white font-bold text-lg">{isLoading ? 'Saving...' : 'Save & Continue'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}