import BackHeader from 'components/BackHeader';
import { Heart, ArrowLeft, Tag, ShoppingCart, XCircle, PlusCircle } from 'lucide-react-native'; // Importing relevant Lucide icons for React Native
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'; // React Native components, including Image for product images

export default function Wishlist() {
  // Mock data for wishlist items. Prices are now in Indian Rupees.
  const wishlistItems = [
    {
      id: 'WL001',
      name: 'Wireless Bluetooth Headphones',
      price: '₹9,999', // Price in Rupees
      imageUrl: 'https://placehold.co/80x80/E2E8F0/4A5568?text=Product+1',
      description: 'High-quality sound with noise cancellation.',
    },
    {
      id: 'WL002',
      name: 'Smartwatch Series 7',
      price: '₹24,999', // Price in Rupees
      imageUrl: 'https://placehold.co/80x80/E2E8F0/4A5568?text=Product+2',
      description: 'Track your fitness and receive notifications.',
    },
    {
      id: 'WL003',
      name: 'Ergonomic Office Chair',
      price: '₹29,000', // Price in Rupees
      imageUrl: 'https://placehold.co/80x80/E2E8F0/4A5568?text=Product+3',
      description: 'Comfortable and supportive for long working hours.',
    },
  ];

  // Set to an empty array to simulate "No items in wishlist yet"
  const emptyWishlist = [];

  const displayWishlist = wishlistItems; // Change this to 'emptyWishlist' to test the empty state

  return (
    <ScrollView className="flex-1 bg-gray-100 pb-20"> {/* Added pb-20 for bottom padding */}
      {/* Header with back button */}
      <BackHeader title="My Wishlist" />

      <View className="p-4">
        {displayWishlist.length === 0 ? (
          /* No items in wishlist yet message */
          <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-4 flex items-center justify-center h-48">
            <View className="text-center">
              <Heart size={48} color="#9CA3AF" className="mx-auto mb-4" /> {/* Heart icon for empty wishlist */}
              <Text className="text-gray-500 text-lg font-medium">No items in wishlist yet.</Text>
              <Text className="text-gray-400 text-sm mt-2">Add items to your wishlist to see them here!</Text>
            </View>
          </View>
        ) : (
          /* List of wishlist items */
          displayWishlist.map((item) => (
            <View key={item.id} className="flex-row bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3">
              <Image source={{ uri: item.imageUrl }} className="w-20 h-20 rounded-lg object-cover mr-4" />
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
                <Text className="text-sm text-gray-600 mb-2">{item.description}</Text>
                <Text className="text-lg font-bold text-gray-900">{item.price}</Text>
                <View className="flex-row justify-end mt-2">
                  <TouchableOpacity
                    onPress={() => console.log(`Remove ${item.name} from wishlist`)}
                    className="flex-row items-center p-2 rounded-md"
                  >
                    <XCircle size={18} color="#DC2626" className="mr-1" />
                    <Text className="text-red-600">Remove</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => console.log(`Add ${item.name} to cart`)}
                    className="ml-4 flex-row items-center p-2 rounded-md"
                  >
                    <PlusCircle size={18} color="#3B82F6" className="mr-1" />
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
