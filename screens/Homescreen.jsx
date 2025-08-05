import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ShoppingCart, Minus, Plus, ShoppingBag,
  Home,
  Heart,
  Baby,
  Shirt,
  CloudDrizzle,
  Pill,
  Monitor,
  Leaf,
} from 'lucide-react-native';
import CategoryTabs from 'components/Home/CategoryTabs';
import GradientBlock from 'components/Home/GradientBlock';
import HotDeals from 'components/Home/HotDeals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

const categories = [
  {
    id: 'all',
    name: 'All',
    IconComponent: ShoppingBag,
    isNew: false,
  },
  {
    id: 'fresh',
    name: 'Fresh',
    IconComponent: Leaf,
    isNew: false,
  },
  {
    id: 'medicines',
    name: 'Medicines',
    IconComponent: Pill,
    isNew: false,
  },
  {
    id: 'electronics',
    name: 'Electronics',
    IconComponent: Monitor,
    isNew: false,
  },
  {
    id: 'home',
    name: 'Home',
    IconComponent: Home,
    isNew: false,
  },
  {
    id: 'beauty',
    name: 'Beauty',
    IconComponent: Heart,
    isNew: false,
  },
  {
    id: 'kids',
    name: 'Kids',
    IconComponent: Baby,
    isNew: false,
  },
  {
    id: 'grocery',
    name: 'Grocery',
    IconComponent: ShoppingCart,
    isNew: false,
  },
  {
    id: 'fashion',
    name: 'Fashion',
    IconComponent: Shirt,
    isNew: false,
  },
  {
    id: 'monsoon',
    name: 'Monsoon',
    IconComponent: CloudDrizzle,
    isNew: false,
  },
];

const categoryColors = {
  all: ['#22C55E', '#ffffff'],
  fresh: ['#22C55E', '#ffffff'],
  medicines: ['#F59E0B', '#ffffff'],
  electronics: ['#3B82F6', '#ffffff'],
  home: ['#8B5CF6', '#ffffff'],
  beauty: ['#EC4899', '#ffffff'],
  kids: ['#F59E0B', '#ffffff'],
  grocery: ['#10B981', '#ffffff'],
  fashion: ['#EC4899', '#ffffff'],
  monsoon: ['#06B6D4', '#ffffff'],
};

const categoryTheme = {
  all: '#22C55E',
  fresh: '#22C55E',
  medicines: '#F59E0B',
  electronics: '#3B82F6',
  home: '#8B5CF6',
  beauty: '#EC4899',
  kids: '#F59E0B',
  grocery: '#10B981',
  fashion: '#EC4899',
  monsoon: '#06B6D4',
}

const categoryTint = {
  all: '#f6fff4',
  fresh: '#e4faf1',
  medicines: '#fdebe4',
  electronics: '#e6f7fa',
  home: '#f3f0f8',
  beauty: '#fdeff3',
  kids: '#fdebe4',
  grocery: '#e1fcf3',
  fashion: '#fdeff3',
  monsoon: '#e6f6fb',
};

const API_BASE_URL = "https://api.grojetdelivery.com";

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchtext, setSearchText] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [bounceValue] = useState(new Animated.Value(1));
  const [filteredHotDeals, setFilteredHotDeals] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [offers, setOffers] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const currentBgColor = (categoryTint[selectedCategory] || '#f6fff4');

  // Fetch data from backend
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/home/featured?limit=4`).then(r => r.json()),
      fetch(`${API_BASE_URL}/home/hotdeals?minDiscount=10`).then(r => r.json()),
      fetch(`${API_BASE_URL}/home/new?limit=10`).then(r => r.json()),
      fetch(`${API_BASE_URL}/home/offers?minDiscount=10`).then(r => r.json()),
      fetch(`${API_BASE_URL}/home/trending?limit=6`).then(r => r.json()),
      fetch(`${API_BASE_URL}/home/categories/list?from=3&to=10`).then(r => r.json())
    ]).then(([featured, newp, offer, trending, quickpicks, categories]) => {
      setFilteredHotDeals(offer.filter(p => p.pricing?.discountPercent >= 10));
      setFeaturedProducts(featured);
      setNewArrivals(newp);
      setOffers(offer);
      setTrendingProducts(trending);
      setCategoriesList(categories);
      setLoading(false);
    }).catch(err => {
      setLoading(false);
      // Optionally set some error state here
    });
  }, []);

  // Filter featured products by category if not "all"
  const filteredFeatured = selectedCategory === 'all'
    ? featuredProducts
    : featuredProducts.filter(product =>
      (product.category_string || "").toLowerCase().includes(selectedCategory)
    );

  // Cart management and animation
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

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useFocusEffect(
    useCallback(() => {
      const loadCart = async () => {
        try {
          const storedCart = await AsyncStorage.getItem('cart');
          if (storedCart) {
            setCartItems(JSON.parse(storedCart));
          } else {
            setCartItems([]);
          }
        } catch (error) {
          console.log('Error loading cart on focus', error);
        }
      };
      loadCart();
    }, [])
  );

  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.log('Failed to save cart to storage', error);
      }
    };
    saveCart();
  }, [cartItems]);

  // UI render helpers
  const renderProductCard = (product, idx) => {
    const cartItem = cartItems.find(item => item._id === product._id);
    const quantity = cartItem ? cartItem.quantity : 0;
    const isLastCol = (idx + 1) % 2 === 0;

    return (
      <View
        key={product._id}
        className={`bg-white rounded-2xl p-3 mb-4 w-[48%] ${!isLastCol ? "mr-[4%]" : ""}`}
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <View className="items-center mb-3 bg-gray-50 rounded-xl">
          <Image
            source={{ uri: product.thumbnail }}
            className="w-full h-28 rounded-xl"
            resizeMode="contain"
          />
        </View>
        <Text className="text-base font-semibold text-gray-900 mb-0.5" numberOfLines={2}>
          {product.name}
        </Text>
        <View className="flex-row items-center mb-1.5">
          <Text className="text-sm text-green-700 font-semibold mr-2">
            ₹{product.pricing?.sellingPrice}
          </Text>
          {product.pricing?.mrp > product.pricing?.sellingPrice && (
            <Text className="text-xs text-gray-400 line-through mr-2">
              ₹{product.pricing?.mrp}
            </Text>
          )}
          {product.pricing?.offerTag && (
            <Text className="text-xs text-red-500 font-semibold">
              {product.pricing.offerTag}
            </Text>
          )}
        </View>
        {/* Cart Actions */}
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
              borderColor: '#68D391', // green-200
              marginTop: 8,
            }}
          >
            {/* Minus button */}
            <TouchableOpacity
              onPress={() => removeFromCart(product._id)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: 'green', // green-400
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
                backgroundColor: 'green', // green-400
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
            className="bg-white border border-green-200 py-2 rounded-full items-center mt-2"
            activeOpacity={0.9}
          >
            <Text className="text-green-600 font-semibold text-base tracking-wide">ADD</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={{ marginTop: 20, fontSize: 16, color: "#888" }}>Loading Products...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: currentBgColor }} edges={['left', 'right', 'bottom']}>
      {/* Top Bar */}
      <GradientBlock
        navigation={navigation}
        location="Mangalore"
        onBellPress={() => navigation.navigate('OffersInfo')}
        selectedCategory={selectedCategory}
        categoryColors={categoryColors}
      />

      {/* Horizontal Category Scroll */}
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categoryColors={categoryColors}
          underlines={categoryTheme}
        />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >

        {/* Hot Deals */}
        <HotDeals 
          hotDeals={filteredHotDeals}
        />

        {/* Featured Products */}
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            {selectedCategory === 'all' ? 'Featured Products' :
              categories.find(c => c.id === selectedCategory)?.name}
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {filteredFeatured.length > 0 ? (
              filteredFeatured.map((product, idx) => renderProductCard(product, idx))
            ) : (
              <Text className="text-gray-400 text-base">No products found for this category.</Text>
            )}
          </View>
        </View>

        {/* New Arrivals */}
        <View className="p-4 bg-white mt-2 mb-4 rounded-lg">
          <Text className="text-xl font-bold text-gray-800 mb-4">New Arrivals</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
            {newArrivals.map((product, index) => (
              <View key={product._id || index} className="w-36 items-center mr-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <Image
                  source={{ uri: product.thumbnail }}
                  style={{ width: 80, height: 80 }}
                  className="rounded-md mb-2"
                />
                <Text className="text-center text-sm font-medium text-gray-800" numberOfLines={2}>{product.name}</Text>
                <Text className="text-xs text-green-700 font-semibold">₹{product.pricing?.sellingPrice}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Offers / Discounts */}
        <View className="p-4 bg-white mt-2 mb-4 rounded-lg">
          <Text className="text-xl font-bold text-gray-800 mb-4">Best Offers</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
            {offers.map((product, index) => (
              <View key={product._id || index} className="w-36 items-center mr-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <Image
                  source={{ uri: product.thumbnail }}
                  style={{ width: 80, height: 80 }}
                  className="rounded-md mb-2"
                />
                <Text className="text-center text-sm font-medium text-gray-800" numberOfLines={2}>{product.name}</Text>
                <Text className="text-xs text-green-700 font-semibold">₹{product.pricing?.sellingPrice}</Text>
                {product.pricing?.offerTag && (
                  <Text className="text-xs text-red-500">{product.pricing.offerTag}</Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>


        {/* Quick Picks (Shop by Category) */}
        <View className="p-4 bg-white mt-2 mb-4 rounded-lg">
          <Text className="text-xl font-bold text-gray-800 mb-4">Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
            {categoriesList.map((cat, index) => (
              <View key={cat._id || index} className="w-40 mr-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <Image
                  source={{ uri: cat.image }}
                  style={{ width: 60, height: 60 }}
                  resizeMode="cover"
                  className="rounded-md mb-2 self-center"
                />
                <Text className="text-center text-sm font-semibold text-gray-800 mb-2">{cat.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Trending Section */}
        <View className="p-4 bg-white mt-2 mb-4 rounded-lg">
          <Text className="text-xl font-bold text-gray-800 mb-4">Trending</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
            {trendingProducts.map((item, index) => (
              <TouchableOpacity
                key={item._id || index}
                className="w-32 items-center mr-4 bg-gray-50 p-3 rounded-lg border border-gray-100"
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  style={{ width: 80, height: 80 }}
                  className="rounded-md mb-2"
                />
                <Text className="text-center text-sm font-medium text-gray-800" numberOfLines={2}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View className="h-20"></View>
      </ScrollView>

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