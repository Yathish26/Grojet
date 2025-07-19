import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import Svgdata from 'components/Svgdata';

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!formData.password) newErrors.password = 'Password is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await fetch('http://192.168.1.35:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert('Login Failed', data.msg || 'Invalid credentials');
                return;
            }

            await Promise.all([
                SecureStore.setItemAsync('userToken', data.token),
                AsyncStorage.setItem('user', JSON.stringify(data.user))
            ]);


            // Navigate to home
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error) {
            console.error('Login error:', error);
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
            behavior='padding'
            className="flex-1 bg-white"
        >
            <View className="bg-[#bbf2c6] h-60 w-full rounded-b-3xl absolute top-0 items-center justify-center px-6">
                <Image
                    source={require('../assets/grojetpng.png')}
                    className="w-48 h-16"
                    resizeMode="contain"
                    style={{ alignSelf: 'center' }}
                />
            </View>

            <ScrollView
                className="flex-1"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingTop: 200 }}
            >
                <View className="bg-white mx-6 p-6 rounded-2xl shadow-xl z-10">
                    <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">Login</Text>
                    <Text className="text-gray-500 text-base mb-8 text-center">Enter your details below</Text>

                    {/* Email Field */}
                    <View className="mb-5">
                        <Text className="text-sm font-medium text-gray-600 mb-1">Email Address</Text>
                        <View className={`flex-row items-center bg-gray-50 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200'} p-4`}>
                            <Mail size={18} color="#6B7280" className="mr-3" />
                            <TextInput
                                placeholder="Email"
                                value={formData.email}
                                onChangeText={text => handleChange('email', text)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="flex-1 text-gray-800 font-medium"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        {errors.email && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email}</Text>}
                    </View>

                    {/* Password Field */}
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-600 mb-1">Password</Text>
                        <View className={`flex-row items-center bg-gray-50 rounded-xl border ${errors.password ? 'border-red-400' : 'border-gray-200'} p-4`}>
                            <Lock size={18} color="#6B7280" className="mr-3" />
                            <TextInput
                                placeholder="Password"
                                value={formData.password}
                                onChangeText={text => handleChange('password', text)}
                                secureTextEntry={!showPassword}
                                className="flex-1 text-gray-800 font-medium"
                                placeholderTextColor="#9CA3AF"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <EyeOff size={18} color="#6B7280" />
                                ) : (
                                    <Eye size={18} color="#6B7280" />
                                )}
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.password}</Text>}
                    </View>

                    <TouchableOpacity className="items-center mb-6" onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text className="text-gray-500 font-medium text-sm">Forgot your password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-green-500 py-4 rounded-xl items-center justify-center shadow-md mb-6"
                        activeOpacity={0.9}
                        disabled={isLoading}
                    >
                        <Text className="text-white font-bold text-lg">
                            {isLoading ? 'Signing in...' : 'Log In'}
                        </Text>
                    </TouchableOpacity>

                    <View className="mb-6">
                        <View className="flex-row items-center mb-4">
                            <View className="flex-1 h-px bg-gray-300" />
                            <Text className="text-gray-500 px-3 text-sm">Or sign in with</Text>
                            <View className="flex-1 h-px bg-gray-300" />
                        </View>

                        <View className="flex-row justify-center">
                            <TouchableOpacity className="bg-white flex-1 p-3 rounded-xl border border-gray-200 flex-row items-center justify-center">
                                {/* Assuming Svgdata.icon="googlelogin" works for Expo */}
                                <Svgdata icon="googlelogin" size={24} />
                                <Text className="ml-2 text-gray-700 font-medium">Google</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity className="items-center mb-6" onPress={() => navigation.navigate('Register')}>
                        <Text className="text-gray-500 font-medium text-sm">Don't have an account? Register</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;