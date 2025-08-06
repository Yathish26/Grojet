import { useNavigation } from '@react-navigation/native';
import BackHeader from 'components/BackHeader';
import { Truck, ShoppingBasket, Package, Award } from 'lucide-react-native';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

// Icon mapping for dynamic rendering
const ICONS = {
  Truck: <Truck size={28} color="#3B82F6" />,
  Package: <Package size={28} color="#10B981" />,
  Award: <Award size={28} color="#F59E0B" />,
  ShoppingBasket: <ShoppingBasket size={28} color="#F59E0B" />,
};

// Example JSON data
const aboutUsData = {
  hero: {
    image: require('../assets/grojetF.png'),
    text: 'Your trusted local grocery delivery partner in Mangalore and Udupi',
  },
  mission: "We're redefining grocery shopping by combining technology with personalized service, bringing fresh essentials to your doorstep with speed and care.",
  features: [
    {
      icon: 'Truck',
      bgColor: 'bg-blue-100',
      title: 'Fast Local Delivery',
      description: 'Serving all Mangalore neighborhoods with reliable same-day delivery from local stores.',
    },
    {
      icon: 'Package',
      bgColor: 'bg-green-100',
      title: 'Bulk Order Solutions',
      description: 'Special wholesale pricing and scheduled deliveries for businesses and large households.',
    },
    {
      icon: 'Award',
      bgColor: 'bg-amber-100',
      title: 'Quality Guaranteed',
      description: 'We personally select fresh produce and verify all items before delivery.',
    },
  ],
  cta: {
    text: "Have questions? We'd love to hear from you.",
    button: {
      label: 'Contact Support',
      screen: 'Support',
    },
  },
};

export default function AboutUs() {
  const navigation = useNavigation();
  return (
    <>
      <BackHeader title="About Us" />
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-6 pt-4 pb-8">
          {/* Hero Section */}
          <View className="items-center mb-8">
            <Image
              source={aboutUsData.hero.image}
              resizeMode="contain"
              style={{ width: 128, height: 128, marginBottom: 8 }}
            />
            <Text className="text-lg text-gray-600 text-center leading-relaxed">
              {aboutUsData.hero.text}
            </Text>
          </View>

          {/* Mission Statement */}
          <View className="bg-gray-50 p-5 rounded-2xl mb-8">
            <Text className="text-gray-700 text-center leading-relaxed">
              {aboutUsData.mission}
            </Text>
          </View>

          {/* Features Grid */}
          <View className="flex-col gap-4 mb-8">
            {aboutUsData.features.map((feature, idx) => (
              <View
                key={idx}
                className={`flex-row items-start p-5 bg-white rounded-2xl shadow-sm border border-gray-100`}
              >
                <View className={`${feature.bgColor} p-3 rounded-lg mr-4`}>
                  {ICONS[feature.icon]}
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-semibold text-gray-900 mb-1">{feature.title}</Text>
                  <Text className="text-gray-600">{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Closing CTA */}
          <View className="items-center mt-4">
            <Text className="text-gray-500 text-sm mb-4 text-center">
              {aboutUsData.cta.text}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(aboutUsData.cta.button.screen)}
              className="bg-green-600 px-8 py-3 rounded-full shadow-sm"
              activeOpacity={0.9}
            >
              <Text className="text-white font-medium">{aboutUsData.cta.button.label}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
