import React, { useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, Image, View, Text, RefreshControl } from 'react-native';
import { Bell, ChevronRight, Gift, Box, Tag, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import BackHeader from 'components/BackHeader';

const OffersInfo = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('offers');
    const [refreshing, setRefreshing] = useState(false);

    // Dummy data for offers
    const offers = [
        {
            id: '1',
            title: 'Summer Special',
            description: 'Get 20% off on all grains and pulses',
            validUntil: 'Valid until 30th June',
            code: 'SUMMER20',
            image: 'https://i.pinimg.com/736x/79/c4/5a/79c45aacd5dfbd3ff53cc4fd5275dbcb.jpg'
        },
        {
            id: '2',
            title: 'First Order Discount',
            description: '15% off on your first order above ₹500',
            validUntil: 'Valid for new customers',
            code: 'NEW15',
            image: 'https://i.pinimg.com/736x/a3/0e/04/a30e0470e38b82947692cfbb37f7ad65.jpg'
        },
        {
            id: '3',
            title: 'Bulk Purchase Offer',
            description: 'Buy 5kg+ of any product and get 10% extra',
            validUntil: 'No expiry',
            code: 'BULK10',
            image: 'https://i.pinimg.com/736x/12/4f/ba/124fba10f7f343da6bd2a364992523fb.jpg'
        },
    ];

    // Dummy data for notifications
    const notifications = [
        {
            id: '1',
            title: 'Order Shipped',
            description: 'Your order #12345 has been shipped and will arrive soon',
            time: '2 hours ago',
            read: false,
            icon: 'package'
        },
        {
            id: '2',
            title: 'Payment Received',
            description: 'We have received your payment for order #12345',
            time: 'Yesterday',
            read: false,
            icon: 'dollar'
        },
        {
            id: '3',
            title: 'New Offer Available',
            description: 'Special summer discounts on grains and pulses',
            time: '2 days ago',
            read: true,
            icon: 'tag'
        },
    ];

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    return (
        <>
            <BackHeader title="Offers & Notifications" />
            <SafeAreaView className="flex-1 bg-gray-50">

                {/* Tabs */}
                <View className="flex-row mt-2">
                    <TouchableOpacity
                        className={`flex-1 py-2 items-center ${activeTab === 'offers' ? 'border-b-2 border-green-600' : ''}`}
                        onPress={() => setActiveTab('offers')}
                    >
                        <Text className={`font-medium ${activeTab === 'offers' ? 'text-green-600' : 'text-gray-600'}`}>
                            Offers
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`flex-1 py-2 items-center ${activeTab === 'notifications' ? 'border-b-2 border-green-600' : ''}`}
                        onPress={() => setActiveTab('notifications')}
                    >
                        <Text className={`font-medium ${activeTab === 'notifications' ? 'text-green-600' : 'text-gray-600'}`}>
                            Notifications
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    className="flex-1"
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#039e18']}
                        />
                    }
                >
                    {activeTab === 'offers' ? (
                        <View className="p-4">
                            {offers.map((offer) => (
                                <TouchableOpacity
                                    key={offer.id}
                                    className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
                                    onPress={() => navigation.navigate('OfferDetails', { offer })}
                                >
                                    <View className="flex-row">
                                        <Image
                                            source={{ uri: offer.image }}
                                            className="w-24 h-24"
                                        />
                                        <View className="flex-1 p-3">
                                            <Text className="text-lg font-semibold text-gray-800">{offer.title}</Text>
                                            <Text className="text-sm text-gray-600 mt-1">{offer.description}</Text>
                                            <View className="flex-row justify-between items-center mt-2">
                                                <Text className="text-xs text-gray-500">{offer.validUntil}</Text>
                                                <Text className="text-xs font-medium text-green-600">Use code: {offer.code}</Text>
                                            </View>
                                        </View>
                                        <View className="absolute top-2 right-2 bg-green-600 p-1 rounded-full">
                                            <Gift size={16} color="white" />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <View className="p-4">
                            {notifications.map((notification) => (
                                <TouchableOpacity
                                    key={notification.id}
                                    className={`bg-white rounded-lg p-4 mb-3 ${!notification.read ? 'border-l-4 border-green-500' : ''}`}
                                    onPress={() => navigation.navigate('NotificationDetails', { notification })}
                                >
                                    <View className="flex-row items-center">
                                        <View className="mr-3">
                                            {notification.icon === 'package' && <Box size={24} color="#4a4a4a" />}
                                            {notification.icon === 'dollar' && <Tag size={24} color="#4a4a4a" />}
                                            {notification.icon === 'tag' && <Gift size={24} color="#4a4a4a" />}
                                        </View>
                                        <View className="flex-1">
                                            <Text className="font-medium text-gray-800">{notification.title}</Text>
                                            <Text className="text-sm text-gray-600 mt-1">{notification.description}</Text>
                                            <Text className="text-xs text-gray-400 mt-2">{notification.time}</Text>
                                        </View>
                                        <ChevronRight size={20} color="#999" />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default OffersInfo;