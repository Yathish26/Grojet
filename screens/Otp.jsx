import React, { useState, useRef, useEffect } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

const API_BASE_URL = "http://172.16.0.39:5000";

const Otp = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    const navigation = useNavigation();
    const route = useRoute();
    const { login } = useUser();
    
    const { phoneNumber, requestId } = route.params || {};
    
    // Refs for OTP inputs
    const otpRefs = useRef([]);

    // Timer for resend OTP
    useEffect(() => {
        let interval = null;
        if (resendTimer > 0 && !canResend) {
            interval = setInterval(() => {
                setResendTimer(timer => {
                    if (timer <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return timer - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer, canResend]);

    const handleOtpChange = (value, index) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all fields are filled
        if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
            handleSubmit(newOtp.join(''));
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (otpString = null) => {
        const otpToVerify = otpString || otp.join('');
        
        if (otpToVerify.length !== 6) {
            Alert.alert('Error', 'Please enter complete OTP');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    phoneNumber: phoneNumber,
                    otp: otpToVerify 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert('Verification Failed', data.message || 'Invalid OTP');
                // Clear OTP inputs on error
                setOtp(['', '', '', '', '', '']);
                otpRefs.current[0]?.focus();
                return;
            }

            // Login successful
            const success = await login(data.user, data.token);

            if (success) {
                if (data.isNewUser) {
                    navigation.reset({ index: 0, routes: [{ name: 'CompleteProfile' }] });
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'MainTabs',
                                state: { routes: [{ name: 'Homescreen' }] },
                            },
                        ],
                    });
                }
            } else {
                Alert.alert('Error', 'Failed to save login data. Please try again.');
            }

        } catch (error) {
            console.error('OTP verification error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber: phoneNumber }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'OTP resent successfully');
                setResendTimer(30);
                setCanResend(false);
                setOtp(['', '', '', '', '', '']);
                otpRefs.current[0]?.focus();
            } else {
                Alert.alert('Error', data.message || 'Failed to resend OTP');
            }

        } catch (error) {
            console.error('Resend OTP error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatPhoneNumber = (phone) => {
        return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
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
                    <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">Verify OTP</Text>
                    <Text className="text-gray-500 text-base mb-8 text-center">
                        Enter the 6-digit code sent to {formatPhoneNumber(phoneNumber)}
                    </Text>

                    {/* OTP Input Fields */}
                    <View className="flex-row justify-between mb-6">
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={ref => otpRefs.current[index] = ref}
                                value={digit}
                                onChangeText={value => handleOtpChange(value, index)}
                                onKeyPress={e => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-200 text-center text-lg font-bold text-gray-900"
                                style={{
                                    textAlign: 'center',
                                }}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    {/* Verify Button */}
                    <TouchableOpacity
                        onPress={() => handleSubmit()}
                        className="bg-green-500 py-4 rounded-xl items-center justify-center shadow-md mb-4"
                        activeOpacity={0.9}
                        disabled={isLoading || otp.join('').length !== 6}
                        style={{
                            opacity: (isLoading || otp.join('').length !== 6) ? 0.6 : 1
                        }}
                    >
                        <Text className="text-white font-bold text-lg">
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </Text>
                    </TouchableOpacity>

                    {/* Resend OTP */}
                    <View className="items-center">
                        <Text className="text-gray-500 text-sm mb-2">
                            Didn't receive the code?
                        </Text>
                        <TouchableOpacity
                            onPress={handleResendOtp}
                            disabled={!canResend || isLoading}
                            activeOpacity={0.7}
                        >
                            <Text className={`text-base font-semibold ${canResend && !isLoading ? 'text-green-600' : 'text-gray-400'}`}>
                                {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Change Number */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mt-6 items-center"
                        activeOpacity={0.7}
                    >
                        <Text className="text-green-600 text-base font-medium">
                            Change Phone Number
                        </Text>
                    </TouchableOpacity>

                    <View className="mt-8 items-center">
                        <Text className="text-xs text-gray-400">Grojet A Daffodils Enterprise</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Otp;
