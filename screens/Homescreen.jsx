import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell, X, ShoppingCart, Wheat, Search, PlusCircle, MinusCircle, Minus, Plus, ShoppingBag,
  Home,
  Heart,
  Baby,
  Shirt,
  CloudDrizzle,
  Pill,
  Monitor,
  Leaf,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svgdata from 'components/Svgdata';
import CategoryTabs from 'components/CategoryTabs';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import SearchBar from 'components/SearchBar';
import GradientBlock from 'components/Home/GradientBlock';


// Product data
const allProducts = [
  { id: '1', name: 'Wheat', price: '27.50', category: 'grains', image: 'https://i.pinimg.com/736x/59/2e/58/592e58975c0849dd99d971daa89dcccc.jpg' },
  { id: '2', name: 'Maize Hyb.', price: '27.50', category: 'grains', image: 'https://i.pinimg.com/736x/67/cb/9f/67cb9f8f23d481e8087efddea69079c2.jpg' },
  { id: '3', name: 'Maize Desi', price: '30.50', category: 'grains', image: 'https://i.pinimg.com/736x/ed/8d/0f/ed8d0f872e5209d0d72996576ad3a6e7.jpg' },
  { id: '4', name: 'Bajra', price: '26.50', category: 'grains', image: 'https://i.pinimg.com/736x/4b/f0/4c/4bf04c342db0e63de082fce7f21902c2.jpg' },
  { id: '5', name: 'Jawar 15 No.', price: '30', category: 'grains', image: 'https://2.wlimg.com/product_images/bc-full/2023/9/12468400/jawar-seeds-1694515828-7076823.jpeg' },
  { id: '6', name: 'Jawar Desi', price: '48', category: 'grains', image: 'https://images.meesho.com/images/products/221215956/zhro7_512.webp' },
  { id: '7', name: 'Jeera Singapore', price: '235', category: 'spices', image: 'https://images.jdmagicbox.com/quickquotes/images_main/cumin-seeds-europe-99-2023118370-vfinzxzn.jpg' },
  { id: '8', name: 'Jeera Bold', price: '260', category: 'spices', image: 'https://lsmedia.linker-cdn.net/1013953/2024/13933635.jpeg' },
  { id: '9', name: 'Jeera Extra Bold', price: '290', category: 'spices', image: 'https://www.jiomart.com/images/product/original/rvkbrioajm/marwar-jeera-whole-cumin-seeds-400g-machine-clean-jira-big-bold-size-400g-product-images-orvkbrioajm-p593794064-3-202504011521.jpg?im=Resize=(420,420)' },
  { id: '10', name: 'Sounf Naturel', price: '160', category: 'spices', image: 'https://rukminim2.flixcart.com/image/850/1000/l29c9e80/edible-seed/9/g/v/200-organic-fennel-seed-indian-spices-saunf-whole-natural-sounf-original-imagdn88gzgtkmnw.jpeg?q=90&crop=false' },
  { id: '11', name: 'Methi', price: '53', category: 'spices', image: 'https://organicmandya.com/cdn/shop/files/MethiSeed_2_2922b02a-1f60-415f-9bb9-a79762798e23.jpg?v=1738227102&width=1000' },
  { id: '12', name: 'Chana Sortex', price: '60', category: 'pulses', image: 'https://5.imimg.com/data5/SELLER/Default/2022/10/GD/NC/CC/159872724/sortex-clean-chana-500x500.jpg' },
  { id: '13', name: 'Chana Dal Sortex', price: '67', category: 'pulses', image: 'https://assets.hyperpure.com/data/images/products/032e592dacccf35c4f67e40c49e099bb.png' },
  { id: '14', name: 'Moong Sortex', price: '90', category: 'pulses', image: 'https://5.imimg.com/data5/VQ/UN/MY-16408377/green-moong-dal.jpg' },
  { id: '15', name: 'Moong Dal', price: '110', category: 'pulses', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREIiN_eX4iwSs4GzR7CQqTQ5Uuy-wsi_256Q&s' },
  { id: '16', name: 'Moong Mogar', price: '130', category: 'pulses', image: 'https://indorinamkeen.com/cdn/shop/files/35.jpg?v=1717236483' },
  { id: '17', name: 'Urad Sortex', price: '90', category: 'pulses', image: 'https://5.imimg.com/data5/SELLER/Default/2025/4/503742631/VE/FQ/MK/12034606/urad-seeds.jpg' },
  { id: '18', name: 'Urad Daal', price: '110', category: 'pulses', image: 'https://5.imimg.com/data5/SELLER/Default/2024/3/399844152/YJ/YH/GW/11560512/white-polished-whole-sabut-urad-dal-500x500.jpg' },
  { id: '19', name: 'Urad Mogar', price: '130', category: 'pulses', image: 'https://5.imimg.com/data5/CK/QB/MY-2685722/urad-mogar-dal.jpg' },
  { id: '20', name: 'Coconut', price: '80', category: 'others', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjc0g3CgUrhjLEJe6gPGi3T6HkTBhFCXzcfg&s' },
];

const categories = [
  {
    id: 'all',
    name: 'All',
    Icon: <ShoppingBag className="w-5 h-5" color="#4A5568" size={20} />,
    isNew: false,
  },
  {
    id: 'fresh',
    name: 'Fresh',
    Icon: <Leaf className="w-5 h-5" color="#4A5568" size={20} />,
    isNew: false,
  },
  {
    id: 'medicines',
    name: 'Medicines',
    Icon: <Pill className="w-5 h-5" color="#4A5568" size={20} />,
    isNew: false,
  },
  {
    id: 'electronics',
    name: 'Electronics',
    Icon: <Monitor className="w-5 h-5" color="#4A5568" size={20} />,
    isNew: false,
  },
  {
    id: 'home',
    name: 'Home',
    Icon: <Home className="w-5 h-5" color="#4A5568" size={20} />,
    isNew: false,
  },
  {
    id: 'beauty',
    name: 'Beauty',
    Icon: <Heart className="w-5 h-5" color="#4A5568" size={20} />,
    isNew: false,
  },
  {
    id: 'kids',
    name: 'Kids',
    Icon: <Baby className="w-5 h-5" color="#4A5568" size={20} />,
    isNew: false,
  },
  {
    id: 'grocery',
    name: 'Grocery',
    Icon: <ShoppingCart className="w-5 h-5" color="#4A5568" size={20} />,
    isNew: false,
  },
  {
    id: 'fashion',
    name: 'Fashion',
    Icon: <Shirt className="w-5 h-5" color="#4A5568" size={20} />,
    isNew: false,
  },
  {
    id: 'monsoon',
    name: 'Monsoon',
    Icon: <CloudDrizzle className="w-5 h-5" color="#4A5568" size={20} />,
    isNew: false,
  },
];

const categoryColors = {
  all: ['lightgreen','white'],
  fresh: ['white', '#16a34a'],
  medicines: ['pink', 'white'],
  electronics: ['lightblue', 'white'],
  home: ['#D6B24A', 'white'],
  beauty: ['white', 'pink'],
  kids: ['#FBFF66', 'white'],
  grocery: ['white', 'lightgreen'],
  fashion: ['white', 'pink'],
  monsoon: ['white', 'lightblue'],
};

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchtext, setSearchText] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [bounceValue] = useState(new Animated.Value(1));
  const [groceryKitchenItems, setGroceryKitchenItems] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchGroceryKitchenItems = async () => {
      const response = await fetch('http://192.168.1.35:5000/home/trending');
      const data = await response.json();
      setGroceryKitchenItems(data);
    };
    fetchGroceryKitchenItems();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? allProducts
    : allProducts.filter(product => product.category === selectedCategory);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
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
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem.quantity > 1) {
        return prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevItems.filter(item => item.id !== productId);
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

  // await AsyncStorage.removeItem('cart');
  // setCartItems([]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['left', 'right', 'bottom']}>
      {/* Top Bar */}
      <GradientBlock
        navigation={navigation}
        location="Mangalore"
        onBellPress={() => navigation.navigate('OffersInfo')}
        selectedCategory={selectedCategory}
        categoryColors={categoryColors}
      />

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Horizontal Category Scroll */}
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categoryColors={categoryColors}
        />

        {/* Products Grid */}
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            {selectedCategory === 'all' ? 'All Products' :
              categories.find(c => c.id === selectedCategory)?.name}
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {filteredProducts.map((product) => {
              const cartItem = cartItems.find(item => item.id === product.id);
              const quantity = cartItem ? cartItem.quantity : 0;

              return (
                <View key={product.id} className="w-[48%] mb-4 bg-white rounded-2xl shadow-md p-3">

                  {/* Product Image */}
                  <Image
                    source={{ uri: product.image }}
                    className="w-full h-32 rounded-xl mb-3"
                    resizeMode="contain"
                  />

                  {/* Product Name */}
                  <Text className="text-base font-semibold text-gray-900 mb-0.5" numberOfLines={1}>
                    {product.name}
                  </Text>

                  {/* Product Price */}
                  <Text className="text-sm text-green-700 font-semibold mb-3">₹{product.price}</Text>

                  {/* Cart Actions */}
                  {quantity > 0 ? (
                    <View className="rounded-full shadow-md overflow-hidden">
                      <LinearGradient
                        colors={['#67f57d', '#1ee83c']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 8, borderRadius: 999 }}
                      >

                        {/* Minus Button */}
                        <TouchableOpacity
                          onPress={() => removeFromCart(product.id)}
                          className="w-8 h-8 bg-white border border-green-300 rounded-full items-center justify-center shadow"
                          activeOpacity={0.9}
                        >
                          <Minus size={20} color="#2F855A" />
                        </TouchableOpacity>

                        {/* Quantity */}
                        <Text className="text-white font-bold text-lg mx-3">{quantity}</Text>

                        {/* Plus Button */}
                        <TouchableOpacity
                          onPress={() => addToCart(product)}
                          className="w-8 h-8 bg-white border border-green-300 rounded-full items-center justify-center shadow"
                          activeOpacity={0.9}
                        >
                          <Plus size={20} color="#2F855A" />
                        </TouchableOpacity>

                      </LinearGradient>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => addToCart(product)}
                      className="bg-white border border-green-200 px-4 py-3 rounded-full items-center"
                      activeOpacity={0.9}
                    >
                      <Text className="text-green-600 font-semibold text-base tracking-wide">ADD</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Grocery & Kitchen Section */}
        <View className="p-4 bg-white mt-2 mb-4 rounded-lg">
          <Text className="text-xl font-bold text-gray-800 mb-4">Trending</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
            {groceryKitchenItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="w-32 items-center mr-4 bg-gray-50 p-3 rounded-lg border border-gray-100"
              >
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 80, height: 80 }}
                  className="rounded-md mb-2"
                />
                <Text className="text-center text-sm font-medium text-gray-800">{item.name}</Text>
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