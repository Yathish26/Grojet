import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Animated,
    Easing,
    Platform,
    ActivityIndicator,
    FlatList,
    Alert,
    StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ShoppingCart,
    Minus,
    Plus,
    Star,
    Grid3X3,
    List,
    SlidersHorizontal,
    ChevronUp,
    ChevronDown,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import BackHeader from 'components/BackHeader';

const API_BASE_URL = "http://192.168.1.38:5000";

export default function CategoryProducts({ route, navigation }) {
    const { category } = route.params;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [bounceValue] = useState(new Animated.Value(1));
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const insets = useSafeAreaInsets();

    // Fetch category products
    const fetchProducts = async (pageNum = 1, reset = false) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const response = await fetch(
                `${API_BASE_URL}/products/${category._id}/products?page=${pageNum}&limit=20&sortBy=${sortBy}&sortOrder=${sortOrder}`
            );
            const data = await response.json();

            if (reset || pageNum === 1) {
                setProducts(data.products);
            } else {
                setProducts(prev => [...prev, ...data.products]);
            }

            setTotalPages(data.pagination.totalPages);
            setPage(pageNum);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch products');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchProducts(1, true);
    }, [sortBy, sortOrder]);

    // Cart management
    const addToCart = (product) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);
            if (existingItem) {
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });

        Animated.sequence([
            Animated.timing(bounceValue, {
                toValue: 1.3,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: true
            }),
            Animated.timing(bounceValue, {
                toValue: 1,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ]).start();
    };

    const removeFromCart = (productId) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === productId);
            if (existingItem && existingItem.quantity > 1) {
                return prevItems.map(item =>
                    item._id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                return prevItems.filter(item => item._id !== productId);
            }
        });
    };

    // Load cart from storage
    useFocusEffect(
        useCallback(() => {
            const loadCart = async () => {
                try {
                    const storedCart = await AsyncStorage.getItem('cart');
                    if (storedCart) {
                        setCartItems(JSON.parse(storedCart));
                    }
                } catch (error) {
                    console.log('Error loading cart', error);
                }
            };
            loadCart();
        }, [])
    );

    // Save cart to storage
    useEffect(() => {
        const saveCart = async () => {
            try {
                await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
            } catch (error) {
                console.log('Failed to save cart', error);
            }
        };
        saveCart();
    }, [cartItems]);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Load more products
    const loadMore = () => {
        if (!loadingMore && page < totalPages) {
            fetchProducts(page + 1);
        }
    };

    // Render product item
    const renderProductItem = ({ item }) => {
        const cartItem = cartItems.find(cartItem => cartItem._id === item._id);
        const quantity = cartItem ? cartItem.quantity : 0;

        if (viewMode === 'list') {
            return (
                <View className="flex-row bg-white rounded-xl p-3 my-1 mx-2">
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('ProductDetail', { product: item })}
                        activeOpacity={0.9}
                    >
                        <Image source={{ uri: item.thumbnail }} className="w-20 h-20 rounded-lg mr-3" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('ProductDetail', { product: item })}
                            activeOpacity={0.7}
                        >
                            <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={2}>{item.name}</Text>
                        </TouchableOpacity>
                        <Text className="text-sm text-gray-500 mb-2">{item.brand}</Text>
                        <View className="flex-row items-center mb-1">
                            <Text className="text-base font-bold text-emerald-700 mr-2">₹{item.pricing?.sellingPrice}</Text>
                            {item.pricing?.mrp > item.pricing?.sellingPrice && (
                                <Text className="text-sm text-gray-400 line-through mr-2">₹{item.pricing?.mrp}</Text>
                            )}
                            {item.pricing?.offerTag && (
                                <Text className="text-xs text-red-600 font-semibold">{item.pricing.offerTag}</Text>
                            )}
                        </View>
                        {item.rating?.average && (
                            <View className="flex-row items-center">
                                <Star size={12} color="#fbbf24" fill="#fbbf24" />
                                <Text className="text-xs text-gray-400 ml-1">{item.rating.average.toFixed(1)} ({item.rating.count})</Text>
                            </View>
                        )}
                    </View>
                    <View className="justify-center items-center min-w-[80px]">
                        {quantity > 0 ? (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 4,
                                    paddingVertical: 4,
                                    borderRadius: 999,
                                    backgroundColor: '#fff',
                                    borderWidth: 1,
                                    borderColor: '#68D391',
                                    marginTop: 8,
                                }}
                            >
                                {/* Minus button */}
                                <TouchableOpacity
                                    onPress={() => removeFromCart(item._id)}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                        backgroundColor: 'green',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    activeOpacity={0.9}
                                >
                                    <Minus size={18} color="#fff" />
                                </TouchableOpacity>

                                {/* Quantity */}
                                <Text
                                    style={{
                                        color: '#2F855A',
                                        fontWeight: '600',
                                        fontSize: 18,
                                        minWidth: 32,
                                        textAlign: 'center',
                                        marginHorizontal: 8,
                                        letterSpacing: 1,
                                    }}
                                >
                                    {quantity}
                                </Text>

                                {/* Plus button */}
                                <TouchableOpacity
                                    onPress={() => addToCart(item)}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                        backgroundColor: 'green',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    activeOpacity={0.9}
                                >
                                    <Plus size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={() => addToCart(item)}
                                className="bg-white border border-emerald-500 rounded-lg px-5 py-2 items-center"
                                style={{ minWidth: 60 }}
                            >
                                <Text className="text-emerald-500 text-base font-semibold">ADD</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            );
        }

        // Grid view
        return (
            <View className="flex-1 bg-white rounded-xl p-3 m-1 max-w-[48%]">
                <TouchableOpacity 
                    onPress={() => navigation.navigate('ProductDetail', { product: item })}
                    activeOpacity={0.9}
                >
                    <Image
                        source={{ uri: item.thumbnail }}
                        className="w-full h-36 rounded-xl mb-2"
                        style={{ width: '100%', height: 144, borderRadius: 12 }}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('ProductDetail', { product: item })}
                    activeOpacity={0.7}
                >
                    <Text className="text-sm font-semibold text-gray-900 mb-1" numberOfLines={2}>{item.name}</Text>
                </TouchableOpacity>
                <Text className="text-xs text-gray-500 mb-1">{item.brand}</Text>
                <View className="flex-row items-center mb-1">
                    <Text className="text-sm font-bold text-emerald-700 mr-2">₹{item.pricing?.sellingPrice}</Text>
                    {item.pricing?.mrp > item.pricing?.sellingPrice && (
                        <Text className="text-xs text-gray-400 line-through">₹{item.pricing?.mrp}</Text>
                    )}
                </View>
                {item.pricing?.offerTag && (
                    <Text className="text-[10px] text-red-600 font-semibold mb-1">{item.pricing.offerTag}</Text>
                )}
                {item.rating?.average && (
                    <View className="flex-row items-center mb-2">
                        <Star size={10} color="#fbbf24" fill="#fbbf24" />
                        <Text className="text-[10px] text-gray-400 ml-1">{item.rating.average.toFixed(1)}</Text>
                    </View>
                )}
                {quantity > 0 ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 4,
                            paddingVertical: 4,
                            borderRadius: 999,
                            backgroundColor: '#fff',
                            borderWidth: 1,
                            borderColor: '#68D391',
                            marginTop: 8,
                        }}
                    >
                        {/* Minus button */}
                        <TouchableOpacity
                            onPress={() => removeFromCart(item._id)}
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: 'green',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            activeOpacity={0.9}
                        >
                            <Minus size={18} color="#fff" />
                        </TouchableOpacity>

                        {/* Quantity */}
                        <Text
                            style={{
                                color: '#2F855A',
                                fontWeight: '600',
                                fontSize: 18,
                                minWidth: 32,
                                textAlign: 'center',
                                marginHorizontal: 8,
                                letterSpacing: 1,
                            }}
                        >
                            {quantity}
                        </Text>

                        {/* Plus button */}
                        <TouchableOpacity
                            onPress={() => addToCart(item)}
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: 'green',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            activeOpacity={0.9}
                        >
                            <Plus size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={() => addToCart(item)}
                        className="bg-white border border-green-200 py-2 rounded-full items-center mt-2"
                        activeOpacity={0.9}
                    >
                        <Text className="text-green-600 font-semibold text-base tracking-wide">ADD</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    if (loading && page === 1) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50" edges={['left', 'right', 'bottom']}>
                <BackHeader title={category.name} search={true} />
                <View className="flex-1 items-center justify-center">
                    <View className="items-center justify-center w-32 h-32">
                        <ActivityIndicator size="large" color="#22c55e" />
                        <Text className="mt-4 text-base text-gray-400">Loading ...</Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['left', 'right', 'bottom']}>
            {/* Header */}
            <BackHeader title={category.name} search={true} />

            {/* Category Info */}
            <View className="flex-row items-center p-4 bg-white mb-2">
                <Image source={{ uri: category.image }} resizeMode="contain" className="w-15 h-15 rounded-xl mr-4" style={{ width: 60, height: 60 }} />
                <View className="flex-1">
                    <Text className="text-xl font-bold text-gray-900 mb-1">{category.name}</Text>
                    <Text className="text-sm text-gray-500 mb-1">{category.description || 'Discover amazing products'}</Text>
                    <Text className="text-xs text-emerald-500 font-medium">{products.length} products</Text>
                </View>
            </View>

            {/* Controls */}
            <View className="px-4 py-3 bg-white border-b border-gray-200">
                {/* Sort Button and View Toggle Row */}
                <View className="flex-row justify-between items-center">
                    {/* Sort Button */}
                    <View>
                        <TouchableOpacity
                            onPress={() => setShowSort(prev => !prev)}
                            className="flex-row items-center px-3 py-2 rounded-lg border border-gray-300 bg-white"
                            activeOpacity={0.8}
                        >
                            <SlidersHorizontal size={18} color="#666" />
                            <Text className="ml-2 text-sm text-gray-700 font-semibold">
                                Sort
                            </Text>
                            <Text className="ml-1 text-lg">{showSort ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* View Toggle */}
                    <View className="flex-row rounded-lg border border-gray-300 overflow-hidden">
                        <TouchableOpacity
                            onPress={() => setViewMode('grid')}
                            className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-50' : 'bg-white'}`}
                        >
                            <Grid3X3 size={18} color={viewMode === 'grid' ? '#22c55e' : '#666'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list' ? 'bg-emerald-50' : 'bg-white'}`}
                        >
                            <List size={18} color={viewMode === 'list' ? '#22c55e' : '#666'} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Animated/Collapsible Sort Options */}
                {showSort && (
                    <View className="flex-row flex-wrap mt-3 gap-2">
                        <TouchableOpacity
                            onPress={() => { setSortBy('name'); setSortOrder('asc'); setShowSort(false); }}
                            className={`px-3 py-2 rounded-lg border ${sortBy === 'name' && sortOrder === 'asc' ? 'bg-emerald-100 border-emerald-500' : 'border-gray-300 bg-white'}`}
                        >
                            <Text className={`text-sm ${sortBy === 'name' && sortOrder === 'asc' ? 'text-emerald-700 font-bold' : 'text-gray-700'}`}>Name A-Z</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setSortBy('name'); setSortOrder('desc'); setShowSort(false); }}
                            className={`px-3 py-2 rounded-lg border ${sortBy === 'name' && sortOrder === 'desc' ? 'bg-emerald-100 border-emerald-500' : 'border-gray-300 bg-white'}`}
                        >
                            <Text className={`text-sm ${sortBy === 'name' && sortOrder === 'desc' ? 'text-emerald-700 font-bold' : 'text-gray-700'}`}>Name Z-A</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setSortBy('price'); setSortOrder('asc'); setShowSort(false); }}
                            className={`px-3 py-2 rounded-lg border ${sortBy === 'price' && sortOrder === 'asc' ? 'bg-emerald-100 border-emerald-500' : 'border-gray-300 bg-white'}`}
                        >
                            <Text className={`text-sm ${sortBy === 'price' && sortOrder === 'asc' ? 'text-emerald-700 font-bold' : 'text-gray-700'}`}>Price ↑</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setSortBy('price'); setSortOrder('desc'); setShowSort(false); }}
                            className={`px-3 py-2 rounded-lg border ${sortBy === 'price' && sortOrder === 'desc' ? 'bg-emerald-100 border-emerald-500' : 'border-gray-300 bg-white'}`}
                        >
                            <Text className={`text-sm ${sortBy === 'price' && sortOrder === 'desc' ? 'text-emerald-700 font-bold' : 'text-gray-700'}`}>Price ↓</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setSortBy('discount'); setSortOrder('desc'); setShowSort(false); }}
                            className={`px-3 py-2 rounded-lg border ${sortBy === 'discount' && sortOrder === 'desc' ? 'bg-emerald-100 border-emerald-500' : 'border-gray-300 bg-white'}`}
                        >
                            <Text className={`text-sm ${sortBy === 'discount' && sortOrder === 'desc' ? 'text-emerald-700 font-bold' : 'text-gray-700'}`}>Highest Discount</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Products List */}
            <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item._id}
                numColumns={viewMode === 'grid' ? 2 : 1}
                key={viewMode}
                contentContainerStyle={{ padding: 8 }}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={() =>
                    loadingMore ? (
                        <View className="py-5 items-center">
                            <ActivityIndicator size="small" color="#22c55e" />
                        </View>
                    ) : null
                }
            />

            {/* Floating Cart Button */}
            {totalItems > 0 && (
                <Animated.View
                    style={[
                        styles.cartButton,
                        {
                            transform: [{ scale: bounceValue }],
                            bottom: Platform.OS === 'ios' ? insets.bottom + 80 : 96,
                            right: 20
                        }
                    ]}
                    className="absolute bg-green-600 rounded-xl p-4 shadow-lg"
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Cart', { cartItems })}
                        className="flex-row items-center"
                    >
                        <ShoppingCart size={24} color="white" />
                        <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center">
                            <Text className="text-white text-xs font-bold">{totalItems}</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    cartButton: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});