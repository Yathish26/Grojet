import { useNavigation } from '@react-navigation/native';
import BackHeader from 'components/BackHeader';
import { Shield, Eye, Database, Lock, UserCheck, Globe, Bell, Trash2 } from 'lucide-react-native';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

// Template data structure
const privacySections = [
  {
    icon: <Database size={24} color="#3B82F6" />,
    iconBg: "bg-blue-100",
    title: "Information We Collect",
    content: "We collect information you provide directly and automatically when using our service:",
    bullets: [
      { label: "Personal Info:", value: "Name, phone number, email address" },
      { label: "Delivery Details:", value: "Address, location coordinates" },
      { label: "Order History:", value: "Purchase details, preferences" },
      { label: "Payment Info:", value: "Transaction details (not card details)" },
      { label: "App Usage:", value: "Device info, app interactions" },
    ],
  },
  {
    icon: <Eye size={24} color="#10B981" />,
    iconBg: "bg-green-100",
    title: "How We Use Your Information",
    content: "Your information helps us provide better service:",
    bullets: [
      "Process and deliver your orders",
      "Send order updates and notifications",
      "Improve our products and services",
      "Provide customer support",
      "Prevent fraud and ensure security",
      "Send promotional offers (with consent)",
    ],
  },
  {
    icon: <Globe size={24} color="#8B5CF6" />,
    iconBg: "bg-purple-100",
    title: "Information Sharing",
    content: "We share your information only when necessary:",
    bullets: [
      { label: "Partner Stores:", value: "Order details for fulfillment" },
      { label: "Delivery Partners:", value: "Contact info and delivery address" },
      { label: "Payment Processors:", value: "Transaction processing" },
      { label: "Legal Requirements:", value: "When required by law" },
      { label: "Business Transfers:", value: "In case of mergers/acquisitions" },
    ],
  },
  {
    icon: <Lock size={24} color="#EF4444" />,
    iconBg: "bg-red-100",
    title: "Data Security",
    content: "We implement multiple layers of security:",
    bullets: [
      "SSL encryption for all data transmission",
      "Secure servers with regular backups",
      "Access controls and employee training",
      "Regular security audits and updates",
      "No storage of full payment card details",
    ],
  },
  {
    icon: <UserCheck size={24} color="#F59E0B" />,
    iconBg: "bg-amber-100",
    title: "Your Rights & Choices",
    content: "You have control over your personal information:",
    bullets: [
      { label: "Access:", value: "View your personal data we have" },
      { label: "Update:", value: "Correct or update your information" },
      { label: "Delete:", value: "Request deletion of your account" },
      { label: "Opt-out:", value: "Unsubscribe from marketing messages" },
      { label: "Data Portability:", value: "Export your data" },
    ],
  },
  {
    icon: <Bell size={24} color="#6366F1" />,
    iconBg: "bg-indigo-100",
    title: "Notifications & Communications",
    content:
      "We send notifications for order updates, delivery status, and account information. You can control marketing communications in your app settings, but service-related messages are necessary for order fulfillment.",
  },
  {
    icon: <Trash2 size={24} color="#F97316" />,
    iconBg: "bg-orange-100",
    title: "Data Retention",
    content:
      "We retain your information for as long as necessary to provide services and comply with legal obligations. Order history is kept for 7 years for accounting purposes. Account data is deleted within 30 days of account closure request.",
  },
  {
    icon: <Eye size={24} color="#14B8A6" />,
    iconBg: "bg-teal-100",
    title: "Cookies & Tracking",
    content:
      "We use cookies and similar technologies to improve app performance, remember your preferences, and analyze usage patterns. You can control these through your device settings, though some features may be limited.",
  },
  {
    icon: <Shield size={24} color="#EC4899" />,
    iconBg: "bg-pink-100",
    title: "Children's Privacy",
    content:
      "Our services are not intended for children under 13. We do not knowingly collect personal information from children. If we become aware of such collection, we will delete the information immediately.",
  },
  {
    icon: <Globe size={24} color="#06B6D4" />,
    iconBg: "bg-cyan-100",
    title: "International Users",
    content:
      "Currently, Grojet operates exclusively in Mangalore, India. All data is processed and stored within India in compliance with local data protection laws and regulations.",
  },
  {
    icon: <Database size={24} color="#6B7280" />,
    iconBg: "bg-gray-100",
    title: "Policy Changes",
    content:
      "We may update this Privacy Policy periodically. Significant changes will be communicated through the app, email, or website notice. Your continued use after changes indicates acceptance of the updated policy.",
  },
];

function renderBullets(bullets) {
  if (!bullets) return null;
  return (
    <View className="ml-4">
      {bullets.map((item, idx) =>
        typeof item === "string" ? (
          <Text key={idx} className="text-gray-600 mb-1">
            • {item}
          </Text>
        ) : (
          <Text key={idx} className="text-gray-600 mb-1">
            • <Text className="font-medium">{item.label}</Text> {item.value}
          </Text>
        )
      )}
    </View>
  );
}

export default function PrivacyPolicy() {
  const navigation = useNavigation();

  return (
    <>
      <BackHeader title="Privacy Policy" />
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 40 }}>
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
            {privacySections.map((section, idx) => (
              <View key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <View className="flex-row items-center mb-3">
                  <View className={`${section.iconBg} p-2 rounded-lg mr-3`}>{section.icon}</View>
                  <Text className="text-xl font-semibold text-gray-900">{section.title}</Text>
                </View>
                <Text className="text-gray-600 leading-relaxed mb-3">{section.content}</Text>
                {renderBullets(section.bullets)}
              </View>
            ))}
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
    </>
  );
}