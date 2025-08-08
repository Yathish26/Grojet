import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import BackHeader from 'components/BackHeader';
import * as SecureStore from 'expo-secure-store';
import { useUser } from '../context/UserContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_BASE_URL = "http://192.168.1.38:5000";

export default function EditProfile({ navigation }) {
    const { user, updateUser } = useUser();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const originalEmail = (user?.email || '').trim().toLowerCase();
    const [emailVerified, setEmailVerified] = useState(!!user?.isEmailVerified);
    const [emailOtp, setEmailOtp] = useState('');
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [emailBusy, setEmailBusy] = useState(false);
    const [gender, setGender] = useState(user?.gender || '');
    const [dateOfBirth, setDateOfBirth] = useState(
        user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().slice(0, 10) : ''
    );
    const [dobDate, setDobDate] = useState(() => {
        try {
            return user?.dateOfBirth ? new Date(user.dateOfBirth) : null;
        } catch {
            return null;
        }
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const formatDisplayDate = (date) => {
        if (!date) return '';
        try {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day} ${month} ${year}`; // DD MM YYYY
        } catch {
            return '';
        }
    };

    const onSave = async () => {
        if (!name.trim()) {
            Alert.alert('Name required', 'Please enter your name.');
            return;
        }
        // If email changed (not empty) but not verified, block saving
        const desiredEmail = email.trim().toLowerCase();
        const emailChanged = desiredEmail !== originalEmail;
        if (desiredEmail && emailChanged && !emailVerified) {
            Alert.alert('Verify email', 'Please verify your new email before saving.');
            return;
        }
        try {
            setLoading(true);
            const token = await SecureStore.getItemAsync('userToken');
            const resp = await fetch(`${API_BASE_URL}/auth/edit-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || ''}`,
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: desiredEmail || undefined,
                    gender: gender || undefined,
                    dateOfBirth: dateOfBirth || undefined,
                }),
            });
            const data = await resp.json();
            if (!resp.ok) {
                throw new Error(data?.message || 'Failed to update profile');
            }
            await updateUser(data.user);
            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            Alert.alert('Update failed', e.message || 'Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const handleRequestEmailOtp = async () => {
        const desiredEmail = email.trim().toLowerCase();
        if (!desiredEmail) {
            Alert.alert('Enter email', 'Please enter an email to verify.');
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
                body: JSON.stringify({ email: desiredEmail })
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
                body: JSON.stringify({ otp: emailOtp.trim() })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || 'Invalid or expired code');
            await updateUser(data.user);
            setEmailVerified(true);
            setEmailOtp('');
            setEmailOtpSent(false);
            Alert.alert('Verified', 'Email verified successfully.');
        } catch (err) {
            Alert.alert('Verification failed', err.message || 'Please check the code and try again.');
        } finally {
            setEmailBusy(false);
        }
    };

    const GenderPill = ({ value, label }) => (
        <TouchableOpacity
            onPress={() => setGender(value)}
            activeOpacity={0.85}
            className={`px-4 py-2 rounded-full border ${gender === value ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200'} mr-2 mb-2`}
        >
            <Text className={`${gender === value ? 'text-green-700 font-semibold' : 'text-gray-700'}`}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <BackHeader title="Edit Profile" />
            <View className="p-4">
                <View className="bg-white p-4 rounded-xl border border-gray-200 mb-4">
                    <Text className="text-xs uppercase text-gray-500 font-bold mb-3 tracking-wide">Basic Info</Text>
                    <Text className="text-gray-700 mb-1">Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        className="border border-gray-200 rounded-lg px-3 py-3 mb-3 text-gray-800"
                    />
                    <View className="flex-row items-center justify-between mb-1">
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
                            const lowered = t.trim().toLowerCase();
                            // Reset verification if changed away from original
                            if (lowered !== originalEmail) {
                                setEmailVerified(false);
                                setEmailOtp('');
                                setEmailOtpSent(false);
                            } else {
                                setEmailVerified(!!user?.isEmailVerified);
                                setEmailOtp('');
                                setEmailOtpSent(false);
                            }
                        }}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="border border-gray-200 rounded-lg px-3 py-3 text-gray-800"
                    />
                    <View className="flex-row items-center mt-3 gap-2">
                        {!emailVerified && (
                            <TouchableOpacity
                                disabled={emailBusy}
                                onPress={handleRequestEmailOtp}
                                className={`px-4 py-2 rounded-full ${emailBusy ? 'bg-green-400' : 'bg-green-600'}`}
                                activeOpacity={0.9}
                            >
                                <Text className="text-white font-semibold">{emailBusy ? 'Sending…' : (emailOtpSent ? 'Resend OTP' : 'Send OTP')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {!emailVerified && emailOtpSent && (
                        <View className="mt-3">
                            <Text className="text-gray-700 mb-1">Enter OTP</Text>
                            <TextInput
                                value={emailOtp}
                                onChangeText={setEmailOtp}
                                placeholder="6-digit code"
                                keyboardType="number-pad"
                                className="border border-gray-200 rounded-lg px-3 py-3 text-gray-800"
                            />
                            <TouchableOpacity
                                disabled={emailBusy}
                                onPress={handleVerifyEmailOtp}
                                className={`mt-2 px-4 py-3 rounded-full items-center ${emailBusy ? 'bg-emerald-400' : 'bg-emerald-600'}`}
                                activeOpacity={0.9}
                            >
                                <Text className="text-white font-bold">{emailBusy ? 'Verifying…' : 'Verify Email'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View className="bg-white p-4 rounded-xl border border-gray-200 mb-4">
                    <Text className="text-xs uppercase text-gray-500 font-bold mb-3 tracking-wide">Personal</Text>
                    <Text className="text-gray-700 mb-2">Gender</Text>
                    <View className="flex-row flex-wrap">
                        <GenderPill value="male" label="Male" />
                        <GenderPill value="female" label="Female" />
                        <GenderPill value="other" label="Other" />
                    </View>

                    <Text className="text-gray-700 mt-3 mb-1">Date of Birth</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.85}
                        className="border border-gray-200 rounded-lg px-3 py-3 bg-white"
                    >
                        <Text className={`text-base ${dateOfBirth ? 'text-gray-800' : 'text-gray-400'}`}>
                            {dobDate ? formatDisplayDate(dobDate) : 'DD MM YYYY'}
                        </Text>
                    </TouchableOpacity>
                    <Text className="text-[11px] text-gray-400 mt-1">Tap to pick a date (Format: DD MM YYYY)</Text>

                    {showDatePicker && (
                        <View className="mt-2">
                            {Platform.OS === 'ios' && (
                                <View className="flex-row justify-end mb-2">
                                    <TouchableOpacity
                                        onPress={() => setShowDatePicker(false)}
                                        className="px-3 py-2"
                                    >
                                        <Text className="text-green-600 font-semibold">Done</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            <DateTimePicker
                                value={dobDate || new Date(2000, 0, 1)}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, selectedDate) => {
                                    if (Platform.OS === 'android') {
                                        if (event.type === 'dismissed') {
                                            setShowDatePicker(false);
                                            return;
                                        }
                                        if (event.type === 'set' && selectedDate) {
                                            setDobDate(selectedDate);
                                            const y = selectedDate.getFullYear();
                                            const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                            const d = String(selectedDate.getDate()).padStart(2, '0');
                                            setDateOfBirth(`${y}-${m}-${d}`);
                                            setShowDatePicker(false);
                                        }
                                    } else {
                                        if (selectedDate) {
                                            setDobDate(selectedDate);
                                            const y = selectedDate.getFullYear();
                                            const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                            const d = String(selectedDate.getDate()).padStart(2, '0');
                                            setDateOfBirth(`${y}-${m}-${d}`);
                                        }
                                    }
                                }}
                                maximumDate={new Date()}
                                minimumDate={new Date(1900, 0, 1)}
                            />
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    disabled={loading}
                    onPress={onSave}
                    activeOpacity={0.9}
                    className={`py-4 rounded-full items-center ${loading ? 'bg-green-400' : 'bg-green-600'}`}
                >
                    <Text className="text-white font-bold text-lg">{loading ? 'Saving...' : 'Save Changes'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
