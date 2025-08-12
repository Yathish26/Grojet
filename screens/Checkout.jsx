import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    MapPin,
    Edit3,
    Plus,
    Tag,
    CreditCard,
    Smartphone,
    Banknote,
    Wallet,
    TruckIcon,
    CheckCircle,
    ChevronRight,
    X,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackHeader from 'components/BackHeader';
import * as Haptics from 'expo-haptics';
import { API_HEADER } from 'endp/bline';

const API_BASE_URL = API_HEADER;

export default function Checkout({ route, navigation }) {
    const { cartItems } = route.params || { cartItems: [] };
    
    // State management
    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showCouponModal, setShowCouponModal] = useState(false);
    
    // Order calculations
    const [orderSummary, setOrderSummary] = useState({
        subtotal: 0,
        deliveryFee: 0,
        taxes: 0,
        discount: 0,
        total: 0
    });

    useEffect(() => {
        loadAddresses();
        calculateOrderSummary();
    }, [cartItems, appliedCoupon]);

    const loadAddresses = async () => {
        try {
            const storedAddresses = await AsyncStorage.getItem('addresses');
            if (storedAddresses) {
                const addressList = JSON.parse(storedAddresses);
                setAddresses(addressList);
                // Auto-select first address or default address
                const defaultAddress = addressList.find(addr => addr.isDefault) || addressList[0];
                setSelectedAddress(defaultAddress);
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
        }
    };

    const calculateOrderSummary = () => {
        const subtotal = cartItems.reduce((total, item) => {
            return total + (parseFloat(item.pricing?.sellingPrice || 0) * item.quantity);
        }, 0);

        const deliveryFee = subtotal >= 499 ? 0 : 40; // Free delivery above ₹499
        const taxes = subtotal * 0.18; // 18% GST
        const discount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent / 100) : 0;
        const total = subtotal + deliveryFee + taxes - discount;

        setOrderSummary({
            subtotal: subtotal.toFixed(2),
            deliveryFee: deliveryFee.toFixed(2),
            taxes: taxes.toFixed(2),
            discount: discount.toFixed(2),
            total: total.toFixed(2)
        });
    };

    const applyCoupon = () => {
        // Mock coupon validation
        const mockCoupons = {
            'GROJET10': { discountPercent: 10, maxDiscount: 100, minOrder: 300 },
            'WELCOME20': { discountPercent: 20, maxDiscount: 200, minOrder: 500 },
            'FIRSTORDER': { discountPercent: 15, maxDiscount: 150, minOrder: 250 }
        };

        const coupon = mockCoupons[couponCode.toUpperCase()];
        const subtotal = parseFloat(orderSummary.subtotal);

        if (!coupon) {
            Alert.alert('Invalid Coupon', 'The coupon code you entered is not valid.');
            return;
        }

        if (subtotal < coupon.minOrder) {
            Alert.alert('Minimum Order Not Met', `This coupon requires a minimum order of ₹${coupon.minOrder}`);
            return;
        }

        setAppliedCoupon(coupon);
        setShowCouponModal(false);
        Alert.alert('Coupon Applied!', `You saved ₹${Math.min(subtotal * coupon.discountPercent / 100, coupon.maxDiscount).toFixed(2)}`);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
    };

    const paymentMethods = [
        { id: 'razorpay', name: 'UPI / Cards / Net Banking', icon: CreditCard, description: 'Pay with Razorpay (All methods)' },
        { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay when order is delivered' },
    ];

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            Alert.alert('Address Required', 'Please select a delivery address');
            return;
        }

        if (!selectedPaymentMethod) {
            Alert.alert('Payment Method Required', 'Please select a payment method');
            return;
        }

        setLoading(true);

        try {
            if (selectedPaymentMethod === 'razorpay') {
                // Initialize Razorpay payment
                initiateRazorpayPayment();
            } else if (selectedPaymentMethod === 'cod') {
                // Process COD order
                await processCODOrder();
            }
        } catch (error) {
            console.error('Order placement error:', error);
            Alert.alert('Error', 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const initiateRazorpayPayment = () => {
        // Razorpay integration will be implemented here
        Alert.alert('Payment', 'Razorpay integration coming soon!');
    };

    const processCODOrder = async () => {
        // Process cash on delivery order
        const orderData = {
            items: cartItems,
            address: selectedAddress,
            deliveryInstructions,
            paymentMethod: 'cod',
            orderSummary,
            appliedCoupon
        };

        // Clear cart and navigate to success
        await AsyncStorage.removeItem('cart');
        Alert.alert('Order Placed!', 'Your order has been placed successfully. You can pay when it\'s delivered.', [
            { text: 'OK', onPress: () => navigation.navigate('MainTabs', { screen: 'Orders' }) }
        ]);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['left', 'right', 'bottom']}>
            <BackHeader title="Checkout" />
            
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Delivery Address */}
                <View className="bg-white mx-4 mt-4 p-4 rounded-xl">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-lg font-bold text-gray-900">Delivery Address</Text>
                        <TouchableOpacity 
                            onPress={() => setShowAddressModal(true)}
                            className="flex-row items-center"
                        >
                            <Text className="text-green-600 font-medium mr-1">Change</Text>
                            <ChevronRight size={16} color="#22c55e" />
                        </TouchableOpacity>
                    </View>
                    
                    {selectedAddress ? (
                        <View className="flex-row">
                            <MapPin size={20} color="#6b7280" className="mt-1" />
                            <View className="ml-3 flex-1">
                                <Text className="font-semibold text-gray-900">{selectedAddress.name}</Text>
                                <Text className="text-gray-600 mt-1">{selectedAddress.phone}</Text>
                                <Text className="text-gray-600 mt-1">
                                    {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                                </Text>
                                {selectedAddress.landmark && (
                                    <Text className="text-gray-500 text-sm mt-1">Near: {selectedAddress.landmark}</Text>
                                )}
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('AddNewAddress')}
                            className="flex-row items-center py-4 border-2 border-dashed border-gray-300 rounded-lg justify-center"
                        >
                            <Plus size={20} color="#6b7280" />
                            <Text className="text-gray-600 font-medium ml-2">Add Delivery Address</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Delivery Instructions */}
                <View className="bg-white mx-4 mt-4 p-4 rounded-xl">
                    <Text className="text-lg font-bold text-gray-900 mb-3">Delivery Instructions</Text>
                    <TextInput
                        value={deliveryInstructions}
                        onChangeText={setDeliveryInstructions}
                        placeholder="Any specific instructions for delivery? (Optional)"
                        multiline
                        numberOfLines={3}
                        className="border border-gray-200 rounded-lg p-3 text-gray-700"
                        textAlignVertical="top"
                    />
                </View>

                {/* Order Summary */}
                <View className="bg-white mx-4 mt-4 p-4 rounded-xl">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Order Summary</Text>
                    
                    {cartItems.map((item, index) => (
                        <View key={index} className="flex-row justify-between items-center py-2">
                            <View className="flex-1">
                                <Text className="font-medium text-gray-900">{item.name}</Text>
                                <Text className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.pricing?.sellingPrice}</Text>
                            </View>
                            <Text className="font-semibold text-gray-900">
                                ₹{(item.quantity * parseFloat(item.pricing?.sellingPrice || 0)).toFixed(2)}
                            </Text>
                        </View>
                    ))}
                    
                    <View className="border-t border-gray-200 mt-4 pt-4">
                        <View className="flex-row justify-between py-1">
                            <Text className="text-gray-600">Subtotal</Text>
                            <Text className="text-gray-900">₹{orderSummary.subtotal}</Text>
                        </View>
                        <View className="flex-row justify-between py-1">
                            <Text className="text-gray-600">Delivery Fee</Text>
                            <Text className="text-gray-900">
                                {orderSummary.deliveryFee === '0.00' ? 'Free' : `₹${orderSummary.deliveryFee}`}
                            </Text>
                        </View>
                        <View className="flex-row justify-between py-1">
                            <Text className="text-gray-600">Taxes (GST)</Text>
                            <Text className="text-gray-900">₹{orderSummary.taxes}</Text>
                        </View>
                        {appliedCoupon && (
                            <View className="flex-row justify-between py-1">
                                <Text className="text-green-600">Discount</Text>
                                <Text className="text-green-600">-₹{orderSummary.discount}</Text>
                            </View>
                        )}
                        <View className="border-t border-gray-200 mt-2 pt-2 flex-row justify-between">
                            <Text className="text-lg font-bold text-gray-900">Total</Text>
                            <Text className="text-lg font-bold text-green-600">₹{orderSummary.total}</Text>
                        </View>
                    </View>
                </View>

                {/* Coupon Section */}
                <View className="bg-white mx-4 mt-4 p-4 rounded-xl">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-lg font-bold text-gray-900">Coupons & Offers</Text>
                        {!appliedCoupon && (
                            <TouchableOpacity 
                                onPress={() => setShowCouponModal(true)}
                                className="flex-row items-center"
                            >
                                <Text className="text-green-600 font-medium mr-1">Apply</Text>
                                <Tag size={16} color="#22c55e" />
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    {appliedCoupon ? (
                        <View className="flex-row items-center justify-between bg-green-50 p-3 rounded-lg">
                            <View className="flex-row items-center">
                                <CheckCircle size={20} color="#22c55e" />
                                <View className="ml-3">
                                    <Text className="font-semibold text-green-700">Coupon Applied!</Text>
                                    <Text className="text-sm text-green-600">You saved ₹{orderSummary.discount}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={removeCoupon}>
                                <X size={20} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity 
                            onPress={() => setShowCouponModal(true)}
                            className="flex-row items-center justify-center py-3 border-2 border-dashed border-gray-300 rounded-lg"
                        >
                            <Tag size={20} color="#6b7280" />
                            <Text className="text-gray-600 font-medium ml-2">Apply Coupon Code</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Payment Methods */}
                <View className="bg-white mx-4 mt-4 p-4 rounded-xl">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Payment Method</Text>
                    
                    {paymentMethods.map((method) => {
                        const IconComponent = method.icon;
                        return (
                            <TouchableOpacity
                                key={method.id}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setSelectedPaymentMethod(method.id);
                                }}
                                className={`flex-row items-center p-4 mb-3 rounded-lg border-2 ${
                                    selectedPaymentMethod === method.id 
                                        ? 'border-green-500 bg-green-50' 
                                        : 'border-gray-200 bg-white'
                                }`}
                            >
                                <IconComponent 
                                    size={24} 
                                    color={selectedPaymentMethod === method.id ? "#22c55e" : "#6b7280"} 
                                />
                                <View className="ml-3 flex-1">
                                    <Text className={`font-semibold ${
                                        selectedPaymentMethod === method.id ? 'text-green-700' : 'text-gray-900'
                                    }`}>
                                        {method.name}
                                    </Text>
                                    <Text className="text-sm text-gray-500 mt-1">{method.description}</Text>
                                </View>
                                {selectedPaymentMethod === method.id && (
                                    <CheckCircle size={20} color="#22c55e" />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View className="h-20" />
            </ScrollView>

            {/* Bottom Place Order Button */}
            <View className="bg-white border-t border-gray-200 p-4">
                <TouchableOpacity
                    onPress={handlePlaceOrder}
                    disabled={loading}
                    className={`py-4 rounded-xl items-center justify-center ${
                        loading ? 'bg-gray-400' : 'bg-green-600'
                    }`}
                    activeOpacity={0.9}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <View className="flex-row items-center">
                            <Text className="text-white font-bold text-lg mr-2">
                                Place Order • ₹{orderSummary.total}
                            </Text>
                            <TruckIcon size={20} color="white" />
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Address Selection Modal */}
            <Modal
                visible={showAddressModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <SafeAreaView className="flex-1 bg-white">
                    <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                        <Text className="text-xl font-bold">Select Address</Text>
                        <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                            <X size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView className="flex-1 p-4">
                        {addresses.map((address, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setSelectedAddress(address);
                                    setShowAddressModal(false);
                                }}
                                className={`p-4 mb-3 rounded-lg border-2 ${
                                    selectedAddress?.id === address.id 
                                        ? 'border-green-500 bg-green-50' 
                                        : 'border-gray-200'
                                }`}
                            >
                                <Text className="font-semibold text-gray-900">{address.name}</Text>
                                <Text className="text-gray-600 mt-1">{address.phone}</Text>
                                <Text className="text-gray-600 mt-1">
                                    {address.address}, {address.city}, {address.state} - {address.pincode}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        
                        <TouchableOpacity 
                            onPress={() => {
                                setShowAddressModal(false);
                                navigation.navigate('AddNewAddress');
                            }}
                            className="flex-row items-center justify-center py-4 border-2 border-dashed border-gray-300 rounded-lg mt-4"
                        >
                            <Plus size={20} color="#6b7280" />
                            <Text className="text-gray-600 font-medium ml-2">Add New Address</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            {/* Coupon Modal */}
            <Modal
                visible={showCouponModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <SafeAreaView className="flex-1 bg-white">
                    <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                        <Text className="text-xl font-bold">Apply Coupon</Text>
                        <TouchableOpacity onPress={() => setShowCouponModal(false)}>
                            <X size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>
                    
                    <View className="p-4">
                        <Text className="text-gray-600 mb-4">Enter your coupon code below:</Text>
                        
                        <View className="flex-row mb-4">
                            <TextInput
                                value={couponCode}
                                onChangeText={setCouponCode}
                                placeholder="Enter coupon code"
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 mr-3"
                                autoCapitalize="characters"
                            />
                            <TouchableOpacity
                                onPress={applyCoupon}
                                className="bg-green-600 px-6 py-3 rounded-lg justify-center"
                            >
                                <Text className="text-white font-semibold">Apply</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <Text className="text-gray-500 text-sm mb-4">Available Coupons:</Text>
                        
                        {['GROJET10', 'WELCOME20', 'FIRSTORDER'].map((code) => (
                            <TouchableOpacity
                                key={code}
                                onPress={() => setCouponCode(code)}
                                className="border border-gray-200 rounded-lg p-3 mb-2"
                            >
                                <Text className="font-semibold text-gray-900">{code}</Text>
                                <Text className="text-sm text-gray-500">
                                    {code === 'GROJET10' && 'Get 10% off (Max ₹100)'}
                                    {code === 'WELCOME20' && 'Get 20% off (Max ₹200)'}
                                    {code === 'FIRSTORDER' && 'Get 15% off (Max ₹150)'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}
