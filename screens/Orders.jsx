import { useNavigation } from '@react-navigation/native';
import BackHeader from 'components/BackHeader';
import { Package, ShoppingCart, ChevronRight, ArrowRight } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';

export default function Orders() {
  const orders = []

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
      <BackHeader title="My Orders" middle={true} />
        {orders.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <View className="bg-green-50 w-40 h-40 flex items-center justify-center rounded-full mb-6">
              <Image source={require('assets/Orders/trolley.png')} className="w-24 h-24" />
            </View>
            <Text className="text-gray-800 text-2xl font-bold mb-2">No Orders Yet</Text>
            <Text className="text-gray-500 text-base mb-8 text-center max-w-xs">
              Your orders will appear here once you've made a purchase
            </Text>
            <TouchableOpacity
              className="mt-2 bg-green-600 px-8 py-4 rounded-full shadow-lg flex-row items-center"
              onPress={() => navigation.navigate('MainTabs', { screen: 'Homescreen' })}
            >
              <Text className="text-white font-semibold text-base mr-2">Start Shopping</Text>
              <ArrowRight size={18} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {orders.map(order => RenderOrderItem(order))}
          </>
        )}
    </View>
  );
}