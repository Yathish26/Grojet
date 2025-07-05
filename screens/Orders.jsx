import { useNavigation } from '@react-navigation/native';
import BackHeader from 'components/BackHeader';
import { Package, ShoppingCart, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';

// Dummy product images (in a real app, these would come from your backend)
const productImages = [
  'https://i.pinimg.com/736x/4e/a5/c8/4ea5c8c480625906a692bafa65ba7aad.jpg',
  'https://i.pinimg.com/736x/2b/c5/a6/2bc5a6a8634fbb69ba0e066aa5676c39.jpg',
  'https://i.pinimg.com/736x/b5/d5/61/b5d56134cc60550895d3368d6b8a5428.jpg',
];

export default function Orders() {
  const orders = [
    {
      id: 'ORD001',
      date: 'June 25, 2025',
      status: 'Delivered',
      total: '₹45.00',
      items: 3,
      products: [
        { name: 'Wireless Headphones', price: '₹25.00', image: productImages[0] },
        { name: 'Smart Watch', price: '₹15.00', image: productImages[1] },
        { name: 'Phone Case', price: '₹5.00', image: productImages[2] },
      ],
      deliveryAddress: '123 Main St, Anytown, USA',
      deliveryDate: 'June 28, 2025',
    },
    {
      id: 'ORD002',
      date: 'June 20, 2025',
      status: 'Shipped',
      total: '₹75.50',
      items: 2,
      products: [
        { name: 'Bluetooth Speaker', price: '₹45.50', image: productImages[1] },
        { name: 'USB Cable Pack', price: '₹30.00', image: productImages[2] },
      ],
      deliveryAddress: '456 Oak Ave, Anytown, USA',
      deliveryDate: 'July 5, 2025',
      trackingNumber: 'TRK123456789',
    },
    {
      id: 'ORD003',
      date: 'June 18, 2025',
      status: 'Cancelled',
      total: '₹20.00',
      items: 1,
      products: [
        { name: 'Screen Protector', price: '₹20.00', image: productImages[0] },
      ],
      deliveryAddress: '789 Pine Ln, Anytown, USA',
      cancellationReason: 'Customer request',
    },
  ];

  const navigation = useNavigation();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' };
      case 'Shipped': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' };
      case 'Cancelled': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' };
    }
  };

  const renderOrderItem = (order) => {
    const statusColor = getStatusColor(order.status);
    
    return (
      <TouchableOpacity 
        key={order.id} 
        className={`mb-4 rounded-lg border ${statusColor.border} overflow-hidden`}
        // onPress={() => navigation.navigate('OrderDetails', { order })}
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
          
          {order.status === 'Shipped' && order.trackingNumber && (
            <Text className="text-xs text-blue-600 mt-1">Tracking #: {order.trackingNumber}</Text>
          )}
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
      
      <ScrollView className="flex-1 px-4 pt-2">
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
            {orders.map(renderOrderItem)}
          </>
        )}
      </ScrollView>
    </View>
  );
}