import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from 'expo-linear-gradient';
import { MailOpen } from 'lucide-react-native';

// Memoized header component for better performance
const ProfileHeader = memo(({ user, isLoggedIn, isLoading, navigate }) => {
  if (isLoading) {
    return (
      <View className="bg-white p-5 border-gray-100">
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ width: 180, height: 34, borderRadius: 8, marginBottom: 16 }}
          shimmerColors={['#ffffff', '#d1fae5', '#ffffff']}
          duration={1000}
          direction="right"
        />
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ width: 18, height: 18, borderRadius: 9, marginRight: 8 }}
            shimmerColors={['#ffffff', '#d1fae5', '#ffffff']}
            duration={1000}
            direction="right"
          />
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ width: 120, height: 18, borderRadius: 6 }}
            shimmerColors={['#ffffff', '#d1fae5', '#ffffff']}
            duration={1000}
            direction="right"
          />
        </View>
      </View>
    );
  }

  if (isLoggedIn && user) {
    return (
      <View className="bg-white p-5 border-gray-100">
        <Text className="text-3xl font-semibold text-gray-800 mb-3">{user.name}</Text>
        <View className="flex-row gap-1 items-center mb-5">
          <MailOpen size={16} color="#4b5563" />
          <Text className="text-gray-700 text-base font-medium">{user.email}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white p-5 border border-gray-200 rounded-b-3xl">
      <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">Login to Profile</Text>
      <Text className="text-gray-500 text-base mb-8 text-center">
        Log in to manage your profile.
      </Text>
      <TouchableOpacity
        onPress={() => navigate.navigate('Login')}
        className="bg-green-500 py-3 rounded-xl items-center justify-center shadow-md"
        activeOpacity={0.85}
      >
        <Text className="text-white font-bold text-lg">Log In</Text>
      </TouchableOpacity>
    </View>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;
