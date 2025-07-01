import BackHeader from 'components/BackHeader';
import { ArrowLeft, Truck, ShoppingCart, Clock } from 'lucide-react-native'; // Importing relevant Lucide icons for React Native
import { View, Text, TouchableOpacity, ScrollView, BackHandler } from 'react-native'; // React Native components

export default function AboutUs() {
  return (
    <ScrollView className="flex-1 bg-gray-100 pb-20"> {/* Added pb-20 for bottom padding */}
      {/* Header with back button */}
      <BackHeader title="About Us" />

      <View className="p-4 flex-1"> {/* flex-1 to push content to top if short */}
          <Text className="text-3xl font-bold text-gray-800 mb-4 text-center">Welcome to Grojet!</Text>

          <Text className="text-lg text-gray-700 mb-6 leading-relaxed text-center">
            At Grojet, we're revolutionizing the way you shop for groceries. We are your go-to solution for
            <Text className="font-semibold text-blue-600"> quick grocery deliveries </Text>
            right to your doorstep, ensuring you get what you need, when you need it.
          </Text>

          <View className="w-full"> {/* Added w-full to ensure grid items take full width */}
            <View className="flex flex-col items-center p-4 bg-blue-50 rounded-lg shadow-sm mb-4"> {/* Added mb-4 for spacing between cards */}
              <Truck size={48} color="#3B82F6" className="mb-3" />
              <Text className="text-xl font-semibold text-gray-800 mb-2 text-center">Lightning-Fast Delivery</Text>
              <Text className="text-gray-600 text-center">
                Forget long waits! Our streamlined logistics ensure your groceries are
                <Text className="font-medium text-blue-700"> delivered incredibly fast</Text>,
                so you can enjoy fresh produce and pantry staples without delay.
              </Text>
            </View>

            <View className="flex flex-col items-center p-4 bg-green-50 rounded-lg shadow-sm">
              <ShoppingCart size={48} color="#10B981" className="mb-3" />
              <Text className="text-xl font-semibold text-gray-800 mb-2 text-center">Bulk Sales Made Easy</Text>
              <Text className="text-gray-600 text-center">
                Whether for your home or business, Grojet offers convenient
                <Text className="font-medium text-green-700"> bulk sales options</Text>.
                Get larger quantities at competitive prices, delivered with the same efficiency.
              </Text>
            </View>
          </View>

          <Text className="text-md text-gray-600 mt-6 text-center"> {/* Increased mt to 6 */}
            Grojet is built to make your grocery shopping experience seamless, reliable, and incredibly efficient.
            Experience the future of grocery delivery with us!
          </Text>
        </View>
    </ScrollView>
  );
}
