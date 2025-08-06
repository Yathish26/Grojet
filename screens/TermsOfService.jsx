import { useNavigation } from '@react-navigation/native';
import BackHeader from 'components/BackHeader';
import { FileText, Shield, AlertTriangle, Users, Clock, CreditCard } from 'lucide-react-native';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

// Template data for sections
const termsSections = [
  {
    icon: <Shield size={24} color="#10B981" />,
    iconBg: "bg-green-100",
    title: "Acceptance of Terms",
    content:
      "By accessing and using Grojet's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.",
  },
  {
    icon: <Users size={24} color="#3B82F6" />,
    iconBg: "bg-blue-100",
    title: "Service Description",
    content:
      "Grojet provides on-demand grocery delivery services in Mangalore. We connect customers with local stores and handle the delivery logistics. Product availability and pricing are subject to store inventory and policies.",
  },
  {
    icon: <AlertTriangle size={24} color="#F59E0B" />,
    iconBg: "bg-amber-100",
    title: "User Responsibilities",
    content:
      "As a user, you agree to:",
    list: [
      "Provide accurate delivery information",
      "Be available to receive deliveries",
      "Treat delivery personnel with respect",
      "Pay for orders as agreed",
      "Report any issues promptly",
    ],
  },
  {
    icon: <CreditCard size={24} color="#8B5CF6" />,
    iconBg: "bg-purple-100",
    title: "Payment & Pricing",
    content:
      "All prices are inclusive of applicable taxes. Payment must be completed before delivery. We accept digital payments, UPI, and cash on delivery. Delivery charges and service fees apply as displayed during checkout.",
  },
  {
    icon: <Clock size={24} color="#F97316" />,
    iconBg: "bg-orange-100",
    title: "Delivery Policy",
    content:
      "We strive to deliver within estimated timeframes but cannot guarantee exact delivery times due to factors beyond our control. Delivery slots are subject to availability. Customers must be available to receive orders during the selected time window.",
  },
  {
    icon: <AlertTriangle size={24} color="#EF4444" />,
    iconBg: "bg-red-100",
    title: "Cancellation & Refunds",
    content:
      "Orders can be cancelled before preparation begins. Refunds for cancelled orders will be processed within 3-5 business days. Quality issues will be addressed with replacements or refunds as appropriate.",
  },
  {
    icon: <Shield size={24} color="#6B7280" />,
    iconBg: "bg-gray-100",
    title: "Limitation of Liability",
    content:
      "Grojet's liability is limited to the order value. We are not responsible for indirect damages, food allergies (unless clearly disclosed), or issues arising from product quality beyond our reasonable control.",
  },
  {
    icon: <Shield size={24} color="#6366F1" />,
    iconBg: "bg-indigo-100",
    title: "Privacy & Data Protection",
    content:
      "Your personal information is protected according to our Privacy Policy. We collect and use data solely to provide and improve our services. Your data will not be shared with third parties without consent.",
  },
  {
    icon: <FileText size={24} color="#14B8A6" />,
    iconBg: "bg-teal-100",
    title: "Changes to Terms",
    content:
      "We reserve the right to modify these terms at any time. Significant changes will be communicated through the app or email. Continued use after changes constitutes acceptance of the new terms.",
  },
];

export default function TermsOfService() {
  const navigation = useNavigation();

  return (
    <>
      <BackHeader title="Terms of Service" />
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 40 }}>
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
            {termsSections.map((section, idx) => (
              <View key={section.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <View className="flex-row items-center mb-3">
                  <View className={`${section.iconBg} p-2 rounded-lg mr-3`}>
                    {section.icon}
                  </View>
                  <Text className="text-xl font-semibold text-gray-900">{section.title}</Text>
                </View>
                <Text className="text-gray-600 leading-relaxed mb-3">{section.content}</Text>
                {section.list && (
                  <View className="ml-4">
                    {section.list.map((item, i) => (
                      <Text key={i} className="text-gray-600 mb-1">• {item}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
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
    </>
  );
}