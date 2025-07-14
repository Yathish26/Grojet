import { useNavigation } from '@react-navigation/native';
import BackHeader from 'components/BackHeader';
import { Truck, ShoppingBasket, Package, Award } from 'lucide-react-native';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function AboutUs() {
  const navigation = useNavigation();
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 40 }}>
      <BackHeader title="About Us" />

      <View className="px-6 pt-4 pb-8">
        {/* Hero Section */}
        <View className="items-center mb-8">
          <View className="bg-green-100 p-5 rounded-full mb-6">
            <ShoppingBasket size={48} color="green" />
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-3">Grojet</Text>
          <Text className="text-lg text-gray-600 text-center leading-relaxed">
            Your trusted local grocery delivery partner in Mangalore
          </Text>
        </View>

        {/* Mission Statement */}
        <View className="bg-gray-50 p-5 rounded-2xl mb-8">
          <Text className="text-gray-700 text-center leading-relaxed">
            We're redefining grocery shopping by combining technology with personalized service, bringing fresh essentials to your doorstep with speed and care.
          </Text>
        </View>

        {/* Features Grid */}
        <View className="flex-col gap-4 mb-8">
          {/* Delivery Card */}
          <View className="flex-row items-start p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
            <View className="bg-blue-100 p-3 rounded-lg mr-4">
              <Truck size={28} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-semibold text-gray-900 mb-1">Fast Local Delivery</Text>
              <Text className="text-gray-600">
                Serving all Mangalore neighborhoods with reliable same-day delivery from local stores.
              </Text>
            </View>
          </View>

          {/* Bulk Orders Card */}
          <View className="flex-row items-start p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
            <View className="bg-green-100 p-3 rounded-lg mr-4">
              <Package size={28} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-semibold text-gray-900 mb-1">Bulk Order Solutions</Text>
              <Text className="text-gray-600">
                Special wholesale pricing and scheduled deliveries for businesses and large households.
              </Text>
            </View>
          </View>

          {/* Quality Card */}
          <View className="flex-row items-start p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
            <View className="bg-amber-100 p-3 rounded-lg mr-4">
              <Award size={28} color="#F59E0B" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-semibold text-gray-900 mb-1">Quality Guaranteed</Text>
              <Text className="text-gray-600">
                We personally select fresh produce and verify all items before delivery.
              </Text>
            </View>
          </View>
        </View>

        {/* Closing CTA */}
        <View className="items-center mt-4">
          <Text className="text-gray-500 text-sm mb-4 text-center">
            Have questions? We'd love to hear from you.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Support')}
            className="bg-green-600 px-8 py-3 rounded-full shadow-sm"
            activeOpacity={0.9}
          >
            <Text className="text-white font-medium">Contact Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
