import { useNavigation } from '@react-navigation/native';
import BackHeader from 'components/BackHeader';
import { FileText, Shield, AlertTriangle, Users, Clock, CreditCard } from 'lucide-react-native';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function TermsOfService() {
  const navigation = useNavigation();
  
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 40 }}>
      <BackHeader title="Terms of Service" />

      <View className="px-6 pt-4 pb-8">
        {/* Hero Section */}
        <View className="items-center mb-8">
          <View className="bg-blue-100 p-5 rounded-full mb-6">
            <FileText size={48} color="#3B82F6" />
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-3">Terms of Service</Text>
          <Text className="text-lg text-gray-600 text-center leading-relaxed">
            Please read these terms carefully before using Grojet services
          </Text>
        </View>

        {/* Last Updated */}
        <View className="bg-gray-50 p-4 rounded-2xl mb-8">
          <Text className="text-gray-700 text-center text-sm">
            Last updated: July 28, 2025
          </Text>
        </View>

        {/* Terms Sections */}
        <View className="flex-col gap-6 mb-8">
          
          {/* Acceptance of Terms */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-green-100 p-2 rounded-lg mr-3">
                <Shield size={24} color="#10B981" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Acceptance of Terms</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed">
              By accessing and using Grojet's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
            </Text>
          </View>

          {/* Service Description */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-blue-100 p-2 rounded-lg mr-3">
                <Users size={24} color="#3B82F6" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Service Description</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed">
              Grojet provides on-demand grocery delivery services in Mangalore. We connect customers with local stores and handle the delivery logistics. Product availability and pricing are subject to store inventory and policies.
            </Text>
          </View>

          {/* User Responsibilities */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-amber-100 p-2 rounded-lg mr-3">
                <AlertTriangle size={24} color="#F59E0B" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">User Responsibilities</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed mb-3">
              As a user, you agree to:
            </Text>
            <View className="ml-4">
              <Text className="text-gray-600 mb-1">• Provide accurate delivery information</Text>
              <Text className="text-gray-600 mb-1">• Be available to receive deliveries</Text>
              <Text className="text-gray-600 mb-1">• Treat delivery personnel with respect</Text>
              <Text className="text-gray-600 mb-1">• Pay for orders as agreed</Text>
              <Text className="text-gray-600">• Report any issues promptly</Text>
            </View>
          </View>

          {/* Payment Terms */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-purple-100 p-2 rounded-lg mr-3">
                <CreditCard size={24} color="#8B5CF6" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Payment & Pricing</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed">
              All prices are inclusive of applicable taxes. Payment must be completed before delivery. We accept digital payments, UPI, and cash on delivery. Delivery charges and service fees apply as displayed during checkout.
            </Text>
          </View>

          {/* Delivery Policy */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-orange-100 p-2 rounded-lg mr-3">
                <Clock size={24} color="#F97316" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Delivery Policy</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed">
              We strive to deliver within estimated timeframes but cannot guarantee exact delivery times due to factors beyond our control. Delivery slots are subject to availability. Customers must be available to receive orders during the selected time window.
            </Text>
          </View>

          {/* Cancellation & Refunds */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-red-100 p-2 rounded-lg mr-3">
                <AlertTriangle size={24} color="#EF4444" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Cancellation & Refunds</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed">
              Orders can be cancelled before preparation begins. Refunds for cancelled orders will be processed within 3-5 business days. Quality issues will be addressed with replacements or refunds as appropriate.
            </Text>
          </View>

          {/* Limitation of Liability */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-gray-100 p-2 rounded-lg mr-3">
                <Shield size={24} color="#6B7280" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Limitation of Liability</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed">
              Grojet's liability is limited to the order value. We are not responsible for indirect damages, food allergies (unless clearly disclosed), or issues arising from product quality beyond our reasonable control.
            </Text>
          </View>

          {/* Privacy & Data */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-indigo-100 p-2 rounded-lg mr-3">
                <Shield size={24} color="#6366F1" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Privacy & Data Protection</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed">
              Your personal information is protected according to our Privacy Policy. We collect and use data solely to provide and improve our services. Your data will not be shared with third parties without consent.
            </Text>
          </View>

          {/* Changes to Terms */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-teal-100 p-2 rounded-lg mr-3">
                <FileText size={24} color="#14B8A6" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Changes to Terms</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed">
              We reserve the right to modify these terms at any time. Significant changes will be communicated through the app or email. Continued use after changes constitutes acceptance of the new terms.
            </Text>
          </View>
        </View>

        {/* Contact Section */}
        <View className="items-center mt-4">
          <Text className="text-gray-500 text-sm mb-4 text-center">
            Questions about our terms? Contact our legal team.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Support')}
            className="bg-green-600 px-8 py-3 rounded-full shadow-sm mb-4"
            activeOpacity={0.9}
          >
            <Text className="text-white font-medium">Contact Support Team</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('PrivacyPolicy')}
            className="border border-gray-300 px-6 py-2 rounded-full"
            activeOpacity={0.9}
          >
            <Text className="text-gray-600 font-medium">View Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}