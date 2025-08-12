import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Image,
    Alert,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { API_HEADER } from 'endp/bline';

const API_BASE_URL = API_HEADER;

const Login = () => {
    const [formData, setFormData] = useState({
        phone: '',
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();
    const { login } = useUser();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
            newErrors.phone = 'Enter a valid 10-digit mobile number';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber: formData.phone }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert('Error', data.message || 'Failed to send OTP');
                return;
            }

            // Navigate to OTP screen with phone number
            navigation.navigate('Otp', { 
                phoneNumber: formData.phone,
                requestId: data.requestId
            });

        } catch (error) {
            console.error('Send OTP error:', error);
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
            <View className="bg-[#bbf2c6] h-64 w-full rounded-b-3xl absolute top-0 items-center justify-center px-6">
                <Image
                    source={require('../assets/grojetF.png')}
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
                    <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">Login / Signup</Text>
                    <Text className="text-gray-500 text-base mb-8 text-center">Enter your phone number to receive OTP</Text>

                    {/* Phone Number Field */}
                    <View className="mb-5">
                        <View
                            className={`flex-row items-center bg-gray-50 rounded-xl border ${errors.phone ? 'border-red-400' : 'border-gray-200'} p-4`}
                            style={{ height: 52 }}
                        >
                            <View className="flex-row items-center justify-center mr-3">
                                <Text className="text-gray-800 font-bold text-base">+91</Text>
                            </View>
                            <TextInput
                                placeholder="Enter mobile number"
                                value={formData.phone}
                                onChangeText={text => handleChange('phone', text.replace(/[^0-9]/g, ''))}
                                keyboardType="number-pad"
                                autoCapitalize="none"
                                className='flex-1 text-gray-800 font-medium py-0'
                                placeholderTextColor="#9CA3AF"
                                maxLength={10}
                                style={{
                                    height: '100%',
                                    includeFontPadding: false
                                }}
                            />
                        </View>
                        {errors.phone && (
                            <Text className="text-red-500 text-xs mt-1.5 ml-1.5">
                                {errors.phone}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-green-500 py-4 rounded-xl items-center justify-center shadow-md"
                        activeOpacity={0.9}
                        disabled={isLoading}
                    >
                        <Text className="text-white font-bold text-lg">
                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                        </Text>
                    </TouchableOpacity>

                    <View className="mt-6 items-center">
                        <Text className="text-xs text-gray-500 text-center">
                            By clicking Send OTP, I accept the{' '}
                            <Text
                                className="text-green-600 underline"
                                onPress={() => navigation.navigate('TermsofService')}
                            >
                                Terms of Service
                            </Text>
                            {' '} & {' '}
                            <Text
                                className="text-green-600 underline"
                                onPress={() => navigation.navigate('PrivacyPolicy')}
                            >
                                Privacy Policy
                            </Text>
                            .
                        </Text>
                    </View>

                    <View className="mt-8 items-center">
                        <Text className="text-xs text-gray-400">Grojet A Daffodils Enterprise</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;
