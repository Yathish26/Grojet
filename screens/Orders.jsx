import { useNavigation } from '@react-navigation/native';
import BackHeader from 'components/BackHeader';
import { Package, ShoppingCart, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';

export default function Orders() {
  const orders = [
    {
      id: 'ORD001',
      date: 'July 1, 2025',
      status: 'Delivered',
      total: '₹450.00',
      items: 3,
      products: [
        { name: 'Fresh Apples (1kg)', price: '₹150.00', image: 'https://i.pinimg.com/736x/4a/de/37/4ade3729109e48e14e0e3126f49df099.jpg' },
        { name: 'Organic Milk (1L)', price: '₹80.00', image: 'https://placehold.co/60x60/4CAF50/FFFFFF?text=Item2' },
        { name: 'Brown Bread', price: '₹50.00', image: 'https://placehold.co/60x60/689F38/FFFFFF?text=Item3' },
      ],
      deliveryAddress: '123 Main St, Garden City, India',
      deliveryDate: 'July 1, 2025',
    },
    {
      id: 'ORD002',
      date: 'June 28, 2025',
      status: 'Out for Delivery',
      total: '₹750.50',
      items: 2,
      products: [
        { name: 'Basmati Rice (5kg)', price: '₹450.50', image: 'https://placehold.co/60x60/4CAF50/FFFFFF?text=Item2' },
        { name: 'Dal (1kg)', price: '₹300.00', image: 'https://placehold.co/60x60/7CB342/FFFFFF?text=Item4' },
      ],
      deliveryAddress: '456 Green Valley Rd, Tech Park, India',
      deliveryDate: 'July 5, 2025',
    },
    {
      id: 'ORD003',
      date: 'June 25, 2025',
      status: 'Cancelled',
      total: '₹200.00',
      items: 1,
      products: [
        { name: 'Olive Oil (1L)', price: '₹200.00', image: 'https://placehold.co/60x60/8BC34A/FFFFFF?text=Item1' },
      ],
      deliveryAddress: '789 Lake View Apt, Downtown, India',
      cancellationReason: 'Customer request',
    },
    {
      id: 'ORD004',
      date: 'June 20, 2025',
      status: 'Confirmed',
      total: '₹320.00',
      items: 4,
      products: [
        { name: 'Potatoes (2kg)', price: '₹80.00', image: 'https://placehold.co/60x60/689F38/FFFFFF?text=Item3' },
        { name: 'Onions (1kg)', price: '₹40.00', image: 'https://placehold.co/60x60/8BC34A/FFFFFF?text=Item1' },
        { name: 'Tomatoes (1kg)', price: '₹60.00', image: 'https://placehold.co/60x60/4CAF50/FFFFFF?text=Item2' },
        { name: 'Spinach (500g)', price: '₹140.00', image: 'https://placehold.co/60x60/7CB342/FFFFFF?text=Item4' },
      ],
      deliveryAddress: '101 City Center, New Area, India',
      deliveryDate: 'July 6, 2025',
    }
  ];

  const navigation = useNavigation();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' };
      case 'Out for Delivery': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' };
      case 'Cancelled': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' };
      case 'Confirmed': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' };
    }
  };

  const RenderOrderItem = (order) => {
    const statusColor = getStatusColor(order.status);
    
    return (
      <TouchableOpacity 
        key={order.id} 
        className={`mb-4 rounded-lg border ${statusColor.border} overflow-hidden`}
      >
        <View className={`p-4 ${statusColor.bg}`}>
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-sm font-medium text-gray-500">Order #{order.id}</Text>
              <Text className="text-lg font-bold text-gray-900 mt-1">{order.total}</Text>
            </View>
            <View className="items-end">
              <Text className="text-sm text-gray-500">{order.date}</Text>
              <View className={`mt-1 px-2 py-1 rounded-full ${statusColor.bg}`}>
                <Text className={`text-xs font-semibold ${statusColor.text}`}>
                  {order.status}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View className="bg-white p-4">
          <View className="flex-row mb-3">
            {order.products.slice(0, 3).map((product, index) => (
              <View key={index} className="mr-2" style={{ width: 60, height: 60 }}>
                <Image 
                  source={{ uri: product.image }} 
                  className="rounded-md w-full h-full" 
                  resizeMode="cover"
                />
                {index === 2 && order.products.length > 3 && (
                  <View className="absolute inset-0 bg-black bg-opacity-40 rounded-md items-center justify-center">
                    <Text className="text-white font-bold text-xs">+{order.products.length - 3}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
          
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">{order.items} {order.items > 1 ? 'items' : 'item'}</Text>
            <View className="flex-row items-center">
              <Text className="text-sm font-medium text-gray-900">View details</Text>
              <ChevronRight size={16} color="#4B5563" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <BackHeader title="My Orders" />
      
      <ScrollView className="flex-1 px-4 pt-2 mb-20">
        {orders.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-20">
            <ShoppingCart size={48} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg font-medium mt-4">No orders yet</Text>
            <Text className="text-gray-400 text-sm mt-2 text-center max-w-xs">
              Your orders will appear here once you've made a purchase
            </Text>
            <TouchableOpacity 
              className="mt-6 bg-green-600 px-6 py-3 rounded-lg"
              onPress={() => navigation.navigate('Home')}
            >
              <Text className="text-white font-medium">Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {orders.map(order => RenderOrderItem(order))}
          </>
        )}
      </ScrollView>
    </View>
  );
}