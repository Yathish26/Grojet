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
} from 'react-native';
import { Mail, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!email.trim()) newErrors.email = 'Email is required';
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            newErrors.email = 'Invalid email address';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const navigation = useNavigation();

    const handleSubmit = () => {
        if (validateForm()) {
            setIsLoading(true);
            console.log('Forgot password request for:', email);
            setTimeout(() => {
                setIsLoading(false);
                Alert.alert(
                    'Password Reset',
                    'If an account with that email exists, a password reset link has been sent to your inbox.',
                    [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
                );
            }, 2000);
        }
    };

    const handleChangeEmail = (text) => {
        setEmail(text);
        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            {/* Top Green Header */}
            <View className="bg-green-600 h-60 w-full rounded-b-3xl absolute top-0 items-center justify-center pt-12 px-6">
                <Text className="text-white text-4xl font-bold">Forgot Password</Text>
            </View>

            <ScrollView
                className="flex-1"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingTop: 200 }}
            >
                {/* Card */}
                <View className="bg-white mx-6 p-6 rounded-2xl shadow-xl z-10">
                    <Text className="text-gray-500 text-base mb-8 text-center">
                        Enter your email address below to receive a password reset link.
                    </Text>

                    {/* Email Field */}
                    <View className="mb-5">
                        <Text className="text-sm font-medium text-gray-600 mb-1">Email Address</Text>
                        <View
                            className={`flex-row items-center bg-gray-50 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200'
                                } p-4`}
                        >
                            <Mail size={18} color="#6B7280" style={{ marginRight: 12 }} />
                            <TextInput
                                placeholder="Email"
                                value={email}
                                onChangeText={handleChangeEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="flex-1 text-gray-800 font-medium"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        {errors.email && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email}</Text>}
                    </View>

                    {/* Send Reset Link */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className={`bg-green-500 py-4 rounded-xl items-center justify-center shadow-md mb-6 ${isLoading ? 'opacity-70' : ''
                            }`}
                        activeOpacity={0.9}
                        disabled={isLoading}
                    >
                        <Text className="text-white font-bold text-lg">
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </Text>
                    </TouchableOpacity>


                    {/* Back to Login */}
                    <TouchableOpacity className="flex-row justify-center" onPress={() => navigation.navigate('Login')}>
                        <Text className="text-gray-600">Remembered your password? </Text>
                        <Text className="text-green-700 font-medium">Back to Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ForgotPassword;
