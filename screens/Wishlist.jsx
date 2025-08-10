import BackHeader from 'components/BackHeader';
import { Heart, Minus, Plus, ShoppingCart, X } from 'lucide-react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Animated, Easing } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FloatingCartButton from 'components/FloatingCartButton';
import { useFocusEffect } from '@react-navigation/native';

const API_BASE_URL = 'http://192.168.1.38:5000';

export default function Wishlist({ navigation }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [bounceValue] = useState(new Animated.Value(1));

  const loadLocal = async () => {
    try {
      const stored = await AsyncStorage.getItem('wishlist');
      if (stored) setWishlist(JSON.parse(stored));
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) setCart(JSON.parse(storedCart));
    } catch (e) { console.log('Load local wishlist error', e); }
  };

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) { await loadLocal(); setLoading(false); return; }
      const resp = await fetch(`${API_BASE_URL}/auth/wishlist`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await resp.json();
      if (resp.ok) {
        // data.wishlist contains product docs (populated) or ids
        const items = (data.wishlist || []).map(p => ({
          _id: p._id || p.id,
            name: p.name,
            thumbnail: p.thumbnail || p.imageUrl,
            description: p.description || '',
            pricing: p.pricing || { sellingPrice: p.price },
        }));
        setWishlist(items);
        await AsyncStorage.setItem('wishlist', JSON.stringify(items));
      }
    } catch (err) {
      console.log('Fetch wishlist error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchWishlist(); }, [fetchWishlist]));

  const removeItem = async (id) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      setWishlist(prev => prev.filter(i => i._id === undefined ? i.id !== id : i._id !== id));
      if (token) {
        await fetch(`${API_BASE_URL}/auth/wishlist/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      }
      await AsyncStorage.setItem('wishlist', JSON.stringify(wishlist.filter(i => (i._id||i.id) !== id)));
    } catch (err) { console.log('Remove wishlist item error', err); }
  };

  const addToCart = async (item) => {
    try {
      const existing = cart.find(c => c._id === item._id);
      let updated;
      if (existing) {
        // If already in cart, do nothing (we'll show remove button instead)
        return;
      } else {
        updated = [...cart, { ...item, quantity: 1 }];
      }
      setCart(updated);
      await AsyncStorage.setItem('cart', JSON.stringify(updated));
      Animated.sequence([
        Animated.timing(bounceValue, { toValue: 1.3, duration: 120, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 1, duration: 120, easing: Easing.linear, useNativeDriver: true })
      ]).start();
    } catch (err) { console.log('Add to cart error', err); }
  };

  const totalItems = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);

  return (
    <View className="flex-1 bg-gray-100">
    <ScrollView className="flex-1 pb-20">
      <BackHeader title="My Wishlist" />

      <View className="p-4">
        {loading && (
          <View className="flex-row items-center justify-center mb-4">
            <ActivityIndicator color="#059669" />
            <Text className="ml-2 text-gray-500">Loading wishlist...</Text>
          </View>
        )}
        {(!loading && wishlist.length === 0) ? (
          <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-4 flex items-center justify-center h-48">
            <View className="flex-col items-center">
              <Heart size={48} color="#9CA3AF" className="mx-auto mb-4" />
              <Text className="text-gray-500 text-lg font-medium">No items in wishlist yet.</Text>
              <Text className="text-gray-400 text-sm mt-2">Add items to your wishlist to see them here!</Text>
            </View>
          </View>
        ) : (
          wishlist.map((item) => (
            <View key={item._id} className="flex-row bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3">
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              >
                <Image source={{ uri: item.thumbnail }} resizeMode='contain' className="w-20 h-20 rounded-lg mr-4" />
              </TouchableOpacity>
              <View className="flex-1">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('ProductDetail', { product: item })}
                >
                  <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
                </TouchableOpacity>
                {item.description ? <Text className="text-sm text-gray-600 mb-2">{item.description}</Text> : null}
                <Text className="text-lg font-bold text-gray-900">₹{item.pricing?.sellingPrice}</Text>
                <View className="flex-row justify-end mt-2">
                  <TouchableOpacity
                    onPress={() => removeItem(item._id)}
                    className="flex-row items-center p-2 gap-2 rounded-md"
                  >
                    <Minus size={18} color="#DC2626" className="mr-1" />
                    <Text className="text-red-600">Remove</Text>
                  </TouchableOpacity>
                  {cart.some(c => c._id === item._id) ? (
                    <TouchableOpacity
                      onPress={async ()=>{
                        const updated = cart.filter(c=> c._id !== item._id);
                        setCart(updated);
                        await AsyncStorage.setItem('cart', JSON.stringify(updated));
                        Animated.sequence([
                          Animated.timing(bounceValue, { toValue: 1.3, duration: 120, easing: Easing.linear, useNativeDriver: true }),
                          Animated.timing(bounceValue, { toValue: 1, duration: 120, easing: Easing.linear, useNativeDriver: true })
                        ]).start();
                      }}
                      className="ml-4 flex-row items-center p-2 rounded-md"
                    >
                      <X size={18} color="#dc2626" className="mr-1" />
                      <Text className="text-red-600">Remove from Cart</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => addToCart(item)}
                      className="ml-4 flex-row items-center p-2 rounded-md"
                    >
                      <Plus size={18} color="#3B82F6" className="mr-1" />
                      <Text className="text-blue-600">Add to Cart</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
    <FloatingCartButton
      totalItems={totalItems}
      bounceValue={bounceValue}
      cartItems={cart}
      onPress={(items)=> navigation.navigate('Cart', { cartItems: items })}
    />
    </View>
  );
}
