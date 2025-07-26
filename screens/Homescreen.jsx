import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Animated,
  Easing
} from 'react-native';
import { Bell, X, ShoppingCart, Wheat, Search, PlusCircle, MinusCircle, Minus, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svgdata from 'components/Svgdata';
import CategoryTabs from 'components/CategoryTabs';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import SearchBar from 'components/SearchBar';


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
    Icon: <Svgdata icon="all" className="w-5 h-5" color="#4A5568" size={20} />,
    isNew: false,
  },
  {
    id: 'grains',
    name: 'Grains',
    Icon: <Wheat className="w-5 h-5" color="#4A5568" size={20} />,
    isNew: false,
  },
  {
    id: 'pulses',
    name: 'Pulses',
    Icon: <Svgdata icon="pulses" className="w-5 h-5" color="#4A5568" size={20} />,
    isNew: false,
  },
  {
    id: 'spices',
    name: 'Spices',
    Icon: <Svgdata icon="spices" className="w-5 h-5" color="#4A5568" size={20} />,
    isNew: false,
  },
  {
    id: 'others',
    name: 'Others',
    Icon: <Svgdata icon="leaf" className="w-5 h-5" color="#4A5568" size={20} />,
    isNew: false,
  },
];

const groceryKitchenItems = [
  { id: 'veg', name: 'Vegetables & Fruits', image: 'https://i.pinimg.com/736x/ae/d9/11/aed9114ac106c26a1a67263e0635386c.jpg' },
  { id: 'atta', name: 'Atta, Rice & Dal', image: 'https://i.pinimg.com/736x/79/c4/5a/79c45aacd5dfbd3ff53cc4fd5275dbcb.jpg' },
  { id: 'oil_ghee_spices', name: 'Oil, Ghee & Spices', image: 'https://i.pinimg.com/736x/12/4f/ba/124fba10f7f343da6bd2a364992523fb.jpg' },
  { id: 'dairy_bakery', name: 'Dairy & Bakery', image: 'https://i.pinimg.com/736x/77/fc/a9/77fca901813d38ef4b1bbe9234b1eaab.jpg' },
  { id: 'snacks', name: 'Snacks & Beverages', image: 'https://i.pinimg.com/736x/90/d0/ea/90d0ea939da33dc9f0dba30656930615.jpg' },
  { id: 'clean', name: 'Cleaning Essentials', image: 'https://i.pinimg.com/736x/bc/52/fa/bc52fabb16921d546cc380cc0561a530.jpg' },
];

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchtext, setSearchText] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [bounceValue] = useState(new Animated.Value(1));

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
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Top Bar */}
      <LinearGradient
        colors={['#ffffff', '#32a852']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          paddingHorizontal: 16, // px-4 = 16
          paddingBottom: 12,     // pb-3 = 12 (pb-3 is usually 12px in Tailwind)
          borderBottomWidth: 1,  // border-b
          borderBottomColor: '#f3f4f6', // border-gray-100
        }}
      >
        <View className="flex-row justify-between items-center mt-3">
          <Image
            source={require('../assets/grojetpng.png')}
            className="w-32 h-16"
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => navigation.navigate('OffersInfo')} className="bg-white/30 p-2 rounded-full">
            <Bell size={24} color="#4a4a4a" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="flex-row items-center mt-2">
          <View className="flex-row items-center gap-1">
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              role="img"
              color="#4a4a4a"
            >
              <Path
                d="M15.5 11C15.5 12.933 13.933 14.5 12 14.5C10.067 14.5 8.5 12.933 8.5 11C8.5 9.067 10.067 7.5 12 7.5C13.933 7.5 15.5 9.067 15.5 11Z"
                stroke="#4a4a4a"
                strokeWidth={1.5}
              />
              <Path
                d="M21 11C21 18 12 22 12 22C12 22 3 18 3 11C3 6.02944 7.02944 2 12 2C16.9706 2 21 6.02944 21 11Z"
                stroke="#4a4a4a"
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </Svg>
            <Text className="text-md text-gray-800 font-semibold">Mangalore</Text>
          </View>
        </TouchableOpacity>

        {/* Search Bar */}
        <SearchBar searchtext={searchtext} setSearchText={setSearchText} />
      </LinearGradient>

      <ScrollView className="flex-1 pb-20">
        {/* Horizontal Category Scroll */}
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
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
          <Text className="text-xl font-bold text-gray-800 mb-4">Grocery & Kitchen</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
            {groceryKitchenItems.map((item) => (
              <TouchableOpacity
                key={item.id}
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
          style={[styles.cartButton, { transform: [{ scale: bounceValue }] }]}
          className="absolute bottom-24 right-5 bg-green-600 rounded-xl p-4 shadow-lg"
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