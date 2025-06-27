import { useNavigation } from '@react-navigation/native';
import { ChevronRight, Package, Box, ShoppingCart, Info, ArrowLeft, ChevronLeft } from 'lucide-react-native'; // Importing relevant Lucide icons for React Native
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'; // React Native components

export default function Orders() {
    // Mock data for orders. In a real application, this would come from an API or state management.
    const orders = [
        {
            id: 'ORD001',
            date: 'June 25, 2025',
            status: 'Delivered',
            total: '$45.00',
            items: 3,
            deliveryAddress: '123 Main St, Anytown, USA',
            details: 'Product A, Product B, Product C',
            deliveryDate: 'June 28, 2025',
        },
        {
            id: 'ORD002',
            date: 'June 20, 2025',
            status: 'Processing',
            total: '$75.50',
            items: 5,
            deliveryAddress: '456 Oak Ave, Anytown, USA',
            details: 'Product D, Product E',
            deliveryDate: 'July 5, 2025', // Future date for processing order
        },
        {
            id: 'ORD003',
            date: 'June 18, 2025',
            status: 'Cancelled',
            total: '$20.00',
            items: 1,
            deliveryAddress: '789 Pine Ln, Anytown, USA',
            details: 'Product F',
            cancellationReason: 'Customer request',
        },
    ];


    const noOrders = [];

    const displayOrders = orders;

    const navigation = useNavigation();

    return (
        <ScrollView className="flex-1 bg-gray-100 pb-20"> {/* Added pb-20 for bottom padding */}
            {/* Header with back button */}
            <View className="flex-row items-center p-4 pt-6 bg-white border-b border-gray-200">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ChevronLeft size={20} color="#4A5568" /> {/* Using ArrowLeft icon */}
                </TouchableOpacity>
                <Text className="text-xl font-semibold text-gray-800 ml-4">My Orders</Text> {/* Added ml-4 for spacing */}
            </View>

            <View className="p-4">
                {displayOrders.length === 0 ? (
                    /* No orders placed yet message */
                    <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-4 items-center justify-center h-48">
                        <ShoppingCart size={48} color="#9CA3AF" className="mb-4" />
                        <Text className="text-gray-500 text-lg font-medium text-center">No orders placed yet.</Text>
                        <Text className="text-gray-400 text-sm mt-2 text-center">Start shopping to see your orders here!</Text>
                    </View>

                ) : (
                    /* List of orders */
                    displayOrders.map((order) => (
                        <TouchableOpacity key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3" >
                            <View className="flex-row justify-between items-center mb-2">
                                <View className="flex-row items-center">
                                    <Package size={20} color="#4A5568" className="mr-2" />
                                    <Text className="text-base font-semibold text-gray-800">Order #{order.id}</Text>
                                </View>
                                <ChevronRight size={20} color="#4A5568" />
                            </View>
                            <Text className="text-sm text-gray-600 mb-1">Date: {order.date}</Text>
                            <Text className="text-sm text-gray-600 mb-1">Items: {order.items}</Text>
                            <Text className="text-sm text-gray-600 mb-1">Total: {order.total}</Text>
                            <View className="flex-row items-center mt-2">
                                <Text className={`text-xs font-semibold px-2 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {order.status}
                                </Text>
                                {order.status === 'Delivered' && order.deliveryDate && (
                                    <Text className="ml-2 text-xs text-gray-500">Delivered on {order.deliveryDate}</Text>
                                )}
                                {order.status === 'Processing' && order.deliveryDate && (
                                    <Text className="ml-2 text-xs text-gray-500">Est. delivery by {order.deliveryDate}</Text>
                                )}
                                {order.status === 'Cancelled' && order.cancellationReason && (
                                    <Text className="ml-2 text-xs text-gray-500">Reason: {order.cancellationReason}</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </ScrollView>
    );
}
