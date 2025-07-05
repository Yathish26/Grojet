import BackHeader from 'components/BackHeader';
import { Truck, ShoppingCart } from 'lucide-react-native';
import { View, Text, ScrollView } from 'react-native';

export default function AboutUs() {
  return (
    <ScrollView className="flex-1 bg-gray-100 pb-20">
      <BackHeader title="About Us" />

      <View className="p-4 flex-1">
        <Text className="text-3xl font-bold text-gray-800 mb-4 text-center">Welcome to Grojet!</Text>

        <Text className="text-lg text-gray-700 mb-6 leading-relaxed text-center">
          Grojet is your trusted local grocery delivery partner based in Mangalore. We make it easy for you to get your daily essentials delivered right to your doorstep — quickly, conveniently, and affordably.
        </Text>

        <View className="w-full">
          <View className="flex flex-col items-center p-4 bg-blue-50 rounded-lg shadow-sm mb-4">
            <Truck size={48} color="#3B82F6" className="mb-3" />
            <Text className="text-xl font-semibold text-gray-800 mb-2 text-center">Fast Delivery in Mangalore</Text>
            <Text className="text-gray-600 text-center">
              We offer prompt and reliable grocery delivery services across Mangalore, ensuring that your orders arrive on time with care and quality.
            </Text>
          </View>

          <View className="flex flex-col items-center p-4 bg-green-50 rounded-lg shadow-sm">
            <ShoppingCart size={48} color="#10B981" className="mb-3" />
            <Text className="text-xl font-semibold text-gray-800 mb-2 text-center">Bulk Orders Made Easy</Text>
            <Text className="text-gray-600 text-center">
              Whether you're stocking up for your household or for your business, Grojet provides easy bulk ordering options at great prices with dependable delivery.
            </Text>
          </View>
        </View>

        <Text className="text-md text-gray-600 mt-6 text-center">
          Our mission is to redefine grocery shopping by combining technology with local service. Thank you for choosing Grojet — your neighborhood grocery partner.
        </Text>
      </View>
    </ScrollView>
  );
}
