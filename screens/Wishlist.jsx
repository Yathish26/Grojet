import BackHeader from 'components/BackHeader';
import { Heart, ArrowLeft, Tag, ShoppingCart, Minus, Plus } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';

export default function Wishlist() {
  const wishlistItems = [
    {
      id: 'WL001',
      name: 'Wireless Bluetooth Headphones',
      price: '₹9,999',
      imageUrl: 'https://i.pinimg.com/736x/67/2a/2e/672a2eca2b68c1ab9d960e8a864e3e17.jpg',
      description: 'High-quality sound with noise cancellation.',
    },
    {
      id: 'WL002',
      name: 'Smartwatch Series 7',
      price: '₹24,999',
      imageUrl: 'https://i.pinimg.com/736x/07/dc/d4/07dcd45cd41417dde08fed1772fe708f.jpg',
      description: 'Track your fitness and receive notifications.',
    },
    {
      id: 'WL003',
      name: 'Ergonomic Office Chair',
      price: '₹29,000',
      imageUrl: 'https://i.pinimg.com/736x/59/4f/51/594f51bef80afe17f27c0d01b1bf8e9c.jpg',
      description: 'Comfortable and supportive for long working hours.',
    },
  ];

  const emptyWishlist = [];

  const displayWishlist = wishlistItems;

  return (
    <ScrollView className="flex-1 bg-gray-100 pb-20"> {/* Added pb-20 for bottom padding */}
      {/* Header with back button */}
      <BackHeader title="My Wishlist" />

      <View className="p-4">
        {displayWishlist.length === 0 ? (
          /* No items in wishlist yet message */
          <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-4 flex items-center justify-center h-48">
            <View className="flex-col items-center">
              <Heart size={48} color="#9CA3AF" className="mx-auto mb-4" />
              <Text className="text-gray-500 text-lg font-medium">No items in wishlist yet.</Text>
              <Text className="text-gray-400 text-sm mt-2">Add items to your wishlist to see them here!</Text>
            </View>
          </View>
        ) : (
          /* List of wishlist items */
          displayWishlist.map((item) => (
            <View key={item.id} className="flex-row bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3">
              <Image source={{ uri: item.imageUrl }} resizeMode='contain' className="w-20 h-20 rounded-lg mr-4" />
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
                <Text className="text-sm text-gray-600 mb-2">{item.description}</Text>
                <Text className="text-lg font-bold text-gray-900">{item.price}</Text>
                <View className="flex-row justify-end mt-2">
                  <TouchableOpacity
                    onPress={() => console.log(`Remove ${item.name} from wishlist`)}
                    className="flex-row items-center p-2 gap-2 rounded-md"
                  >
                    <Minus size={18} color="#DC2626" className="mr-1" />
                    <Text className="text-red-600">Remove</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => console.log(`Add ${item.name} to cart`)}
                    className="ml-4 flex-row items-center p-2 rounded-md"
                  >
                    <Plus size={18} color="#3B82F6" className="mr-1" />
                    <Text className="text-blue-600">Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
