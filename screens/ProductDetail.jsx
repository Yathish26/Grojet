import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Animated,
    Easing,
    Dimensions,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Share } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ShoppingCart,
    Minus,
    Plus,
    Star,
    Heart,
    Share2,
    Package,
    Truck,
    Shield,
    Info,
    X
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import BackHeader from 'components/BackHeader';
import FloatingCartButton from 'components/FloatingCartButton';
import ImageViewing from 'react-native-image-viewing';

const { width: screenWidth } = Dimensions.get('window');
const API_BASE_URL = "http://172.16.0.39:5000";

export default function ProductDetail({ route, navigation }) {
    const { product: initialProduct } = route.params;
    const [product, setProduct] = useState(initialProduct);
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [bounceValue] = useState(new Animated.Value(1));
    const [imageIndex, setImageIndex] = useState(0);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [imageViewerIndex, setImageViewerIndex] = useState(0);
    const insets = useSafeAreaInsets();

    const images = (product.images && product.images.length > 0)
        ? product.images.map((img) => ({ uri: img }))
        : product.thumbnail ? [{ uri: product.thumbnail }] : [];

    const fetchProductDetails = async () => {
        if (!product._id) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/products/product/${product._id}`);
            const data = await response.json();

            if (response.ok && data.product) {
                setProduct(data.product);
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                try {
                    const [storedCart, storedWishlist] = await Promise.all([
                        AsyncStorage.getItem('cart'),
                        AsyncStorage.getItem('wishlist')
                    ]);
                    if (storedCart) setCartItems(JSON.parse(storedCart));
                    if (storedWishlist) setWishlistItems(JSON.parse(storedWishlist));
                } catch (error) {
                    console.log('Error loading data', error);
                }
            };
            loadData();
        }, [])
    );

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

    useEffect(() => {
        const saveWishlist = async () => {
            try {
                await AsyncStorage.setItem('wishlist', JSON.stringify(wishlistItems));
            } catch (error) {
                console.log('Failed to save wishlist', error);
            }
        };
        saveWishlist();
    }, [wishlistItems]);

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

    const toggleWishlist = async (prod) => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                Alert.alert('Login Required', 'Please login to manage wishlist');
                return;
            }
            const resp = await fetch(`${API_BASE_URL}/auth/wishlist/${prod._id}/toggle`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await resp.json();
            if (!resp.ok) {
                console.log('Wishlist toggle failed', data);
                Alert.alert('Wishlist', data.message || 'Failed to update wishlist');
                return;
            }
            // data.wishlist is array of product IDs; refetch details for added one if necessary
            setWishlistItems(prev => {
                const isIn = prev.some(p => p._id === prod._id);
                if (isIn) return prev.filter(p => p._id !== prod._id);
                return [...prev, prod];
            });
            await AsyncStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        } catch (err) {
            console.log('Toggle wishlist error', err);
        }
    };

    const shareProduct = async () => {
        try {
            await Share.share({
                message: 'grojetdelivery.com', 
                title: 'Grojet Delivery',      
            });
        } catch (error) {
            Alert.alert('Share', 'Could not open share dialog.');
        }
    };

    const cartItem = cartItems.find(item => item._id === product._id);
    const quantity = cartItem ? cartItem.quantity : 0;
    const isInWishlist = wishlistItems.some(item => item._id === product._id);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const discountPercentage = product.pricing?.mrp && product.pricing?.sellingPrice
        ? Math.round(((product.pricing.mrp - product.pricing.sellingPrice) / product.pricing.mrp) * 100)
        : 0;

    const handleImagePress = (idx) => {
        setImageViewerIndex(idx);
        setImageViewerVisible(true);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['left', 'right', 'bottom']}>
            <BackHeader title={product.name || 'Product Details'} search={true} />

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {loading && (
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.8)', zIndex: 1000, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#22c55e" />
                        <Text style={{ marginTop: 8, color: '#6b7280' }}>Loading details...</Text>
                    </View>
                )}

                {/* Product Images */}
                <View style={{ backgroundColor: '#f9fafb' }}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => {
                            const newIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                            setImageIndex(newIndex);
                        }}
                    >
                        {/* Main product image */}
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => handleImagePress(0)}
                            style={{ width: screenWidth, height: 300, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', padding: 16 }}
                        >
                            <Image
                                source={{ uri: product.thumbnail || product.images?.[0] }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        {product.images?.slice(1).map((image, index) => (
                            <TouchableOpacity
                                key={index + 1}
                                activeOpacity={0.85}
                                onPress={() => handleImagePress(index + 1)}
                                style={{ width: screenWidth, height: 300, justifyContent: 'center', alignItems: 'center', padding: 16 }}
                            >
                                <Image
                                    source={{ uri: image }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    {product.images && product.images.length > 1 && (
                        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 8 }}>
                            {product.images.map((_, index) => (
                                <View
                                    key={index}
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        marginHorizontal: 4,
                                        backgroundColor: index === imageIndex ? '#10b981' : '#d1d5db',
                                    }}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Product Info */}
                <View style={{ padding: 16 }}>
                    {product.brand && (
                        <Text style={{ fontSize: 13, color: '#059669', fontWeight: '500', marginBottom: 4 }}>{product.brand}</Text>
                    )}
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>{product.name}</Text>
                    {product.rating?.average && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <Star size={16} color="#fbbf24" fill="#fbbf24" />
                            <Text style={{ fontSize: 13, color: '#4b5563', marginLeft: 4, fontWeight: '500' }}>
                                {product.rating.average.toFixed(1)} ({product.rating.count} reviews)
                            </Text>
                        </View>
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#059669', marginRight: 12 }}>
                            ₹{product.pricing?.sellingPrice}
                        </Text>
                        {product.pricing?.mrp > product.pricing?.sellingPrice && (
                            <>
                                <Text style={{ fontSize: 17, color: '#9ca3af', textDecorationLine: 'line-through', marginRight: 8 }}>
                                    ₹{product.pricing?.mrp}
                                </Text>
                                <Text style={{ fontSize: 13, color: '#dc2626', fontWeight: '600', backgroundColor: '#fee2e2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                                    {discountPercentage}% OFF
                                </Text>
                            </>
                        )}
                    </View>
                    {product.pricing?.offerTag && (
                        <View style={{ backgroundColor: '#ffedd5', borderWidth: 1, borderColor: '#fed7aa', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                            <Text style={{ color: '#ea580c', fontWeight: '500' }}>{product.pricing.offerTag}</Text>
                        </View>
                    )}
                    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                        <TouchableOpacity
                            onPress={shareProduct}
                            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}
                            activeOpacity={0.7}
                        >
                            <Share2 size={20} color="#374151" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => toggleWishlist(product)}
                            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}
                            activeOpacity={0.7}
                        >
                            <Heart
                                size={20}
                                color={isInWishlist ? "#ef4444" : "#374151"}
                                fill={isInWishlist ? "#ef4444" : "transparent"}
                            />
                        </TouchableOpacity>
                    </View>

                    {product.description && (
                        <View style={{ borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 16, marginBottom: 16 }}>
                            <Text style={{ fontSize: 17, fontWeight: '600', color: '#111827', marginBottom: 12 }}>Description</Text>
                            <Text style={{ color: '#4b5563', lineHeight: 22 }}>
                                {showFullDescription
                                    ? product.description
                                    : `${product.description.substring(0, 150)}${product.description.length > 150 ? '...' : ''}`
                                }
                            </Text>
                            {product.description.length > 150 && (
                                <TouchableOpacity
                                    onPress={() => setShowFullDescription(!showFullDescription)}
                                    style={{ marginTop: 8 }}
                                >
                                    <Text style={{ color: '#059669', fontWeight: '500' }}>
                                        {showFullDescription ? 'Show Less' : 'Read More'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    <View style={{ borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 16, marginBottom: 16 }}>
                        <Text style={{ fontSize: 17, fontWeight: '600', color: '#111827', marginBottom: 12 }}>Product Details</Text>

                        {/* Brand */}
                        {product.brand && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Package size={16} color="#6b7280" />
                                <Text style={{ color: '#4b5563', marginLeft: 8 }}>Brand: {product.brand}</Text>
                            </View>
                        )}

                        {/* Category */}
                        {product.category && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Info size={16} color="#6b7280" />
                                <Text style={{ color: '#4b5563', marginLeft: 8 }}>
                                    Category: {product.category.name || product.category_string || product.category}
                                </Text>
                            </View>
                        )}

                        {/* Stock Status */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Shield size={16} color={product.stock?.status === 'in_stock' ? "#22c55e" : product.stock?.status === 'limited' ? "#f59e0b" : "#ef4444"} />
                            <Text style={{
                                color: product.stock?.status === 'in_stock' ? '#10b981' : product.stock?.status === 'limited' ? '#f59e0b' : '#ef4444',
                                marginLeft: 8,
                                fontWeight: '500'
                            }}>
                                {product.stock?.status === 'in_stock' ? 'In Stock' :
                                    product.stock?.status === 'limited' ? 'Limited Stock' : 'Out of Stock'}
                            </Text>
                        </View>

                        {/* Delivery Info */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Truck size={16} color="#6b7280" />
                            <Text style={{ color: '#4b5563', marginLeft: 8 }}>
                                {product.delivery?.isInstant
                                    ? `Instant delivery ${product.delivery.deliveryTimeInMinutes ? `in ${product.delivery.deliveryTimeInMinutes} mins` : ''}`
                                    : 'Standard delivery'}
                            </Text>
                        </View>

                        {/* Free delivery info */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Truck size={16} color="#6b7280" />
                            <Text style={{ color: '#4b5563', marginLeft: 8 }}>Free delivery on orders above ₹499</Text>
                        </View>

                        {/* Tax Information */}
                        {product.tax?.gstRate && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Info size={16} color="#6b7280" />
                                <Text style={{ color: '#4b5563', marginLeft: 8 }}>
                                    GST: {product.tax.gstRate}% {product.tax.includedInPrice ? '(Included in price)' : '(Extra)'}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Highlights Section */}
                    {product.highlights && product.highlights.length > 0 && (
                        <View style={{ borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 16, marginBottom: 16 }}>
                            <Text style={{ fontSize: 17, fontWeight: '600', color: '#111827', marginBottom: 12 }}>Key Features</Text>
                            {product.highlights.map((highlight, index) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
                                    <Text style={{ color: '#10b981', fontWeight: 'bold', marginRight: 8 }}>•</Text>
                                    <Text style={{ color: '#4b5563', flex: 1, lineHeight: 20 }}>{highlight}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Variants Section */}
                    {product.variants && product.variants.length > 0 && (
                        <View style={{ borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 16, marginBottom: 16 }}>
                            <Text style={{ fontSize: 17, fontWeight: '600', color: '#111827', marginBottom: 12 }}>Available Variants</Text>
                            {product.variants.map((variant, index) => (
                                <View key={index} style={{
                                    backgroundColor: '#f9fafb',
                                    padding: 12,
                                    borderRadius: 8,
                                    marginBottom: 8,
                                    borderWidth: 1,
                                    borderColor: '#e5e7eb'
                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: '600', color: '#111827' }}>{variant.label}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontWeight: 'bold', color: '#059669', marginRight: 8 }}>₹{variant.price}</Text>
                                            {variant.mrp && variant.mrp > variant.price && (
                                                <Text style={{ color: '#9ca3af', textDecorationLine: 'line-through', fontSize: 12 }}>₹{variant.mrp}</Text>
                                            )}
                                        </View>
                                    </View>
                                    {variant.unit && (
                                        <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>Unit: {variant.unit}</Text>
                                    )}
                                    {variant.stock !== undefined && (
                                        <Text style={{ color: variant.stock > 0 ? '#10b981' : '#ef4444', fontSize: 12, marginTop: 2 }}>
                                            {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                </View>
            </ScrollView>

            {/* Fullscreen Image Viewer */}
            <ImageViewing
                images={images}
                imageIndex={imageViewerIndex}
                visible={imageViewerVisible}
                onRequestClose={() => setImageViewerVisible(false)}
                swipeToCloseEnabled={true}
                doubleTapToZoomEnabled={true}
                FooterComponent={({ imageIndex }) => (
                    <View style={{
                        position: 'absolute',
                        bottom: 30,
                        left: 0,
                        right: 0,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            color: '#fff',
                            fontSize: 16,
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 16,
                        }}>
                            {`${imageIndex + 1} / ${images.length}`}
                        </Text>
                    </View>
                )}
                HeaderComponent={() => (
                    <TouchableOpacity
                        style={{ position: 'absolute', top: 40, right: 20, zIndex: 100 }}
                        onPress={() => setImageViewerVisible(false)}
                    >
                        <X color="#fff" size={32} />
                    </TouchableOpacity>
                )}
            />

            {/* Bottom Action Bar */}
            <View className="flex-row items-center justify-between py-4 px-4 bg-white border-t border-gray-100">
                <View className="flex-1">
                    <Text className="text-2xl font-bold text-gray-900">
                        ₹{product.pricing?.sellingPrice || product.pricing?.price}
                    </Text>
                    {product.pricing?.mrp && product.pricing?.sellingPrice && product.pricing?.mrp > product.pricing?.sellingPrice && (
                        <View className="flex-row items-center mt-1">
                            <Text className="text-lg text-gray-400 line-through mr-2">
                                ₹{product.pricing.mrp}
                            </Text>
                            <Text className="text-sm text-red-600 font-semibold bg-red-50 px-2 py-1 rounded">
                                {discountPercentage}% OFF
                            </Text>
                        </View>
                    )}
                </View>

                {/* Add to Cart / Plus Minus Controls */}
                <View className="items-center">
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
                            }}
                        >
                            {/* Minus button */}
                            <TouchableOpacity
                                onPress={() => removeFromCart(product._id)}
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
                                onPress={() => addToCart(product)}
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
                            onPress={() => addToCart(product)}
                            className="bg-white border border-green-200 py-2 px-6 rounded-full items-center"
                            activeOpacity={0.9}
                        >
                            <Text className="text-green-600 font-semibold text-base tracking-wide">ADD</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Floating Cart Button */}
            <FloatingCartButton
                totalItems={totalItems}
                bounceValue={bounceValue}
                cartItems={cartItems}
                onPress={(cartItems) => navigation.navigate('Cart', { cartItems })}
            />
        </SafeAreaView>
    );
}