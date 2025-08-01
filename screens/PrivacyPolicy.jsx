import { useNavigation } from '@react-navigation/native';
import BackHeader from 'components/BackHeader';
import { Shield, Eye, Database, Lock, UserCheck, Globe, Bell, Trash2 } from 'lucide-react-native';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function PrivacyPolicy() {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 40 }}>
      <BackHeader title="Privacy Policy" />

      <View className="px-6 pt-4 pb-8">
        {/* Hero Section */}
        <View className="items-center mb-8">
          <View className="bg-green-100 p-5 rounded-full mb-6">
            <Shield size={48} color="#10B981" />
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-3">Privacy Policy</Text>
          <Text className="text-lg text-gray-600 text-center leading-relaxed">
            Your privacy is important to us. Learn how we protect your data.
          </Text>
        </View>

        {/* Last Updated */}
        <View className="bg-gray-50 p-4 rounded-2xl mb-8">
          <Text className="text-gray-700 text-center text-sm">
            Last updated: July 28, 2025
          </Text>
        </View>

        {/* Privacy Sections */}
        <View className="flex-col gap-6 mb-8">

          {/* Information We Collect */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-blue-100 p-2 rounded-lg mr-3">
                <Database size={24} color="#3B82F6" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Information We Collect</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed mb-3">
              We collect information you provide directly and automatically when using our service:
            </Text>
            <View className="ml-4">
              <Text className="text-gray-600 mb-1">• <Text className="font-medium">Personal Info:</Text> Name, phone number, email address</Text>
              <Text className="text-gray-600 mb-1">• <Text className="font-medium">Delivery Details:</Text> Address, location coordinates</Text>
              <Text className="text-gray-600 mb-1">• <Text className="font-medium">Order History:</Text> Purchase details, preferences</Text>
              <Text className="text-gray-600 mb-1">• <Text className="font-medium">Payment Info:</Text> Transaction details (not card details)</Text>
              <Text className="text-gray-600">• <Text className="font-medium">App Usage:</Text> Device info, app interactions</Text>
            </View>
          </View>

          {/* How We Use Your Information */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-green-100 p-2 rounded-lg mr-3">
                <Eye size={24} color="#10B981" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">How We Use Your Information</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed mb-3">
              Your information helps us provide better service:
            </Text>
            <View className="ml-4">
              <Text className="text-gray-600 mb-1">• Process and deliver your orders</Text>
              <Text className="text-gray-600 mb-1">• Send order updates and notifications</Text>
              <Text className="text-gray-600 mb-1">• Improve our products and services</Text>
              <Text className="text-gray-600 mb-1">• Provide customer support</Text>
              <Text className="text-gray-600 mb-1">• Prevent fraud and ensure security</Text>
              <Text className="text-gray-600">• Send promotional offers (with consent)</Text>
            </View>
          </View>

          {/* Information Sharing */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-purple-100 p-2 rounded-lg mr-3">
                <Globe size={24} color="#8B5CF6" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Information Sharing</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed mb-3">
              We share your information only when necessary:
            </Text>
            <View className="ml-4">
              <Text className="text-gray-600 mb-1">• <Text className="font-medium">Partner Stores:</Text> Order details for fulfillment</Text>
              <Text className="text-gray-600 mb-1">• <Text className="font-medium">Delivery Partners:</Text> Contact info and delivery address</Text>
              <Text className="text-gray-600 mb-1">• <Text className="font-medium">Payment Processors:</Text> Transaction processing</Text>
              <Text className="text-gray-600 mb-1">• <Text className="font-medium">Legal Requirements:</Text> When required by law</Text>
              <Text className="text-gray-600">• <Text className="font-medium">Business Transfers:</Text> In case of mergers/acquisitions</Text>
            </View>
          </View>

          {/* Data Security */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-red-100 p-2 rounded-lg mr-3">
                <Lock size={24} color="#EF4444" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Data Security</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed mb-3">
              We implement multiple layers of security:
            </Text>
            <View className="ml-4">
              <Text className="text-gray-600 mb-1">• SSL encryption for all data transmission</Text>
              <Text className="text-gray-600 mb-1">• Secure servers with regular backups</Text>
              <Text className="text-gray-600 mb-1">• Access controls and employee training</Text>
              <Text className="text-gray-600 mb-1">• Regular security audits and updates</Text>
              <Text className="text-gray-600">• No storage of full payment card details</Text>
            </View>
          </View>

          {/* Your Rights & Choices */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-amber-100 p-2 rounded-lg mr-3">
                <UserCheck size={24} color="#F59E0B" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Your Rights & Choices</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed mb-3">
              You have control over your personal information:
            </Text>
            <View className="ml-4">
              <Text className="text-gray-600 mb-1">• <Text className="font-medium">Access:</Text> View your personal data we have</Text>
              <Text className="text-gray-600 mb-1">• <Text className="font-medium">Update:</Text> Correct or update your information</Text>
              <Text className="text-gray-600 mb-1">• <Text className="font-medium">Delete:</Text> Request deletion of your account</Text>
              <Text className="text-gray-600 mb-1">• <Text className="font-medium">Opt-out:</Text> Unsubscribe from marketing messages</Text>
              <Text className="text-gray-600">• <Text className="font-medium">Data Portability:</Text> Export your data</Text>
            </View>
          </View>

          {/* Notifications & Communications */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-indigo-100 p-2 rounded-lg mr-3">
                <Bell size={24} color="#6366F1" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Notifications & Communications</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed">
              We send notifications for order updates, delivery status, and account information. You can control marketing communications in your app settings, but service-related messages are necessary for order fulfillment.
            </Text>
          </View>

          {/* Data Retention */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-orange-100 p-2 rounded-lg mr-3">
                <Trash2 size={24} color="#F97316" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Data Retention</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed">
              We retain your information for as long as necessary to provide services and comply with legal obligations. Order history is kept for 7 years for accounting purposes. Account data is deleted within 30 days of account closure request.
            </Text>
          </View>

          {/* Cookies & Tracking */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-teal-100 p-2 rounded-lg mr-3">
                <Eye size={24} color="#14B8A6" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Cookies & Tracking</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed">
              We use cookies and similar technologies to improve app performance, remember your preferences, and analyze usage patterns. You can control these through your device settings, though some features may be limited.
            </Text>
          </View>

          {/* Children's Privacy */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-pink-100 p-2 rounded-lg mr-3">
                <Shield size={24} color="#EC4899" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Children's Privacy</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed">
              Our services are not intended for children under 13. We do not knowingly collect personal information from children. If we become aware of such collection, we will delete the information immediately.
            </Text>
          </View>

          {/* International Users */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-cyan-100 p-2 rounded-lg mr-3">
                <Globe size={24} color="#06B6D4" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">International Users</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed">
              Currently, Grojet operates exclusively in Mangalore, India. All data is processed and stored within India in compliance with local data protection laws and regulations.
            </Text>
          </View>

          {/* Policy Changes */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-gray-100 p-2 rounded-lg mr-3">
                <Database size={24} color="#6B7280" />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Policy Changes</Text>
            </View>
            <Text className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy periodically. Significant changes will be communicated through the app, email, or website notice. Your continued use after changes indicates acceptance of the updated policy.
            </Text>
          </View>
        </View>

        {/* Contact Section */}
        <View className="items-center mt-4">
          <Text className="text-gray-500 text-sm mb-4 text-center">
            Questions about your privacy? Our team is here to help.
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('Support')}
            className="bg-green-600 px-8 py-3 rounded-full shadow-sm mb-4"
            activeOpacity={0.9}
          >
            <Text className="text-white font-medium">Contact Support Team</Text>
          </TouchableOpacity>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => navigation.navigate('TermsofService')}
              className="border border-gray-300 px-6 py-2 rounded-full"
              activeOpacity={0.9}
            >
              <Text className="text-gray-600 font-medium">Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}