import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingCart, Plus, Minus, ArrowRight } from 'lucide-react-native';
import BackHeader from 'components/BackHeader';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const loadCart = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('cart');
                setCartItems(jsonValue != null ? JSON.parse(jsonValue) : []);
            } catch (e) {
                console.error('Failed to load cart:', e);
            } finally {
                setLoading(false);
            }
        };
        const unsubscribe = navigation.addListener('focus', loadCart);
        return unsubscribe;
    }, [navigation]);

    const updateQuantity = async (id, delta) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return { ...item, quantity: newQty > 1 ? newQty : 1 };
            }
            return item;
        });
        setCartItems(updatedCart);
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeItem = async (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + (parseFloat(item.price.split('-')[0]) * item.quantity), 0).toFixed(2);
    };

    return (
        <View className="flex-1 bg-gray-50">
  <BackHeader title="My Cart" />
  {loading ? (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#4ade80" />
    </View>
  ) : cartItems.length === 0 ? (
    <View className="flex-1 items-center justify-center px-4">
      <View className="bg-green-50 p-6 rounded-full mb-6">
        <ShoppingCart size={56} color="#22c55e" />
      </View>
      <Text className="text-gray-800 text-2xl font-bold mb-2">Your cart is empty</Text>
      <Text className="text-gray-500 text-base mb-8 text-center max-w-xs">
        Looks like you haven't added anything to your cart yet
      </Text>
      <TouchableOpacity
        className="mt-2 bg-green-600 px-8 py-4 rounded-full shadow-lg flex-row items-center"
        onPress={() => navigation.navigate('Home')}
      >
        <Text className="text-white font-semibold text-base mr-2">Start Shopping</Text>
        <ArrowRight size={18} color="white" />
      </TouchableOpacity>
    </View>
  ) : (
    <>
      <ScrollView className="px-4 pt-4" showsVerticalScrollIndicator={false}>
        {cartItems.map(item => {
          const pricePerItem = parseFloat(item.price.split('-')[0]);
          const totalForItem = (pricePerItem * item.quantity).toFixed(2);
          return (
            <View
              key={item.id}
              className="flex-row items-center bg-white p-4 mb-4 rounded-xl"
              style={{
                elevation: 1,
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <Image
                source={{ uri: item.image }}
                className="w-24 h-24 rounded-lg mr-4"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-1">{item.name}</Text>
                <Text className="text-sm text-gray-500 mb-3">
                  ₹{pricePerItem} per item
                </Text>
                
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item.id, -1);
                        } else {
                          removeItem(item.id);
                        }
                      }}
                      className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center border border-gray-200"
                    >
                      <Minus size={16} color="#6b7280" />
                    </TouchableOpacity>
                    <Text className="mx-4 text-lg font-semibold text-gray-800">{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, 1)}
                      className="w-9 h-9 rounded-full bg-green-50 items-center justify-center border border-green-200"
                    >
                      <Plus size={16} color="#22c55e" />
                    </TouchableOpacity>
                  </View>
                  
                  <Text className="text-lg font-bold text-gray-900">
                    ₹{totalForItem}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Fixed bottom checkout panel */}
      <View className="bg-white pt-4 pb-8 px-6 border-t border-gray-100">
        <View className="flex-row justify-between mb-6">
          <Text className="text-lg font-medium text-gray-700">Subtotal</Text>
          <Text className="text-lg font-bold text-gray-900">₹{getTotal()}</Text>
        </View>
        <View className="flex-row justify-between mb-6">
          <Text className="text-lg font-medium text-gray-700">Delivery</Text>
          <Text className="text-lg font-bold text-gray-900">Free</Text>
        </View>
        <View className="border-b border-gray-100 mb-6" />
        <View className="flex-row justify-between mb-6">
          <Text className="text-xl font-bold text-gray-900">Total</Text>
          <Text className="text-xl font-extrabold text-green-600">₹{getTotal()}</Text>
        </View>
        <TouchableOpacity
          className="bg-green-600 py-4 rounded-xl items-center shadow-sm flex-row justify-center"
          onPress={() => alert('Proceeding to Checkout...')}
          activeOpacity={0.9}
        >
          <Text className="text-white font-bold text-lg mr-2">Proceed to Checkout</Text>
          <ArrowRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </>
  )}
</View>
    );
}