import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

const Register = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://192.168.1.35:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show specific backend message or fallback
        Alert.alert('Registration Failed', data.msg || 'Please try again later');
      } else {
        Alert.alert(
          'Registration Successful',
          'Your account has been created!',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      className="flex-1 bg-white"
    >
      {/* Top Green Header */}
      <View className="bg-[#bbf2c6] h-60 w-full rounded-b-3xl absolute top-0 items-center justify-center px-6">
        <Image
          source={require('../assets/grojetpng.png')}
          className="w-48 h-16 self-center"
          resizeMode="contain"
        />
      </View>

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: 200 }}
      >
        <View className="bg-white mx-6 p-6 rounded-2xl shadow-lg z-20">
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">Create Account</Text>
          <Text className="text-gray-500 text-base mb-8 text-center">
            Fill in your details to get started with Grojet!
          </Text>

          {/* Full Name Field */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-500 mb-1">Full Name</Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-xl border px-4 py-3 ${
                errors.fullName ? 'border-red-400' : 'border-gray-200'
              }`}
            >
              <User size={18} color="#6B7280" style={{ marginRight: 12 }} />
              <TextInput
                placeholder="Name"
                value={formData.fullName}
                onChangeText={text => handleChange('fullName', text)}
                autoCapitalize="words"
                className="flex-1 text-gray-800 font-medium text-base"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {errors.fullName && (
              <Text className="text-red-500 text-xs mt-1 ml-1">{errors.fullName}</Text>
            )}
          </View>

          {/* Email Field */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-500 mb-1">Email Address</Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-xl border px-4 py-3 ${
                errors.email ? 'border-red-400' : 'border-gray-200'
              }`}
            >
              <Mail size={18} color="#6B7280" style={{ marginRight: 12 }} />
              <TextInput
                placeholder="Email"
                value={formData.email}
                onChangeText={text => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 text-gray-800 font-medium text-base"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {errors.email && (
              <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email}</Text>
            )}
          </View>

          {/* Password Field */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-500 mb-1">Password</Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-xl border px-4 py-3 ${
                errors.password ? 'border-red-400' : 'border-gray-200'
              }`}
            >
              <Lock size={18} color="#6B7280" style={{ marginRight: 12 }} />
              <TextInput
                placeholder="Create Password"
                value={formData.password}
                onChangeText={text => handleChange('password', text)}
                secureTextEntry={!showPassword}
                className="flex-1 text-gray-800 font-medium text-base"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                {showPassword ? (
                  <EyeOff size={18} color="#6B7280" />
                ) : (
                  <Eye size={18} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-500 text-xs mt-1 ml-1">{errors.password}</Text>
            )}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className={`bg-green-500 py-4 rounded-xl items-center justify-center mb-6 shadow-md ${
              isLoading ? 'opacity-60' : ''
            }`}
            activeOpacity={0.9}
            disabled={isLoading}
          >
            <Text className="text-white font-bold text-lg">
              {isLoading ? 'Registering...' : 'Register'}
            </Text>
          </TouchableOpacity>

          {/* Already have an account? */}
          <View className="flex-row justify-center">
            <Text className="text-gray-500 text-base">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-green-700 font-medium text-base">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;
