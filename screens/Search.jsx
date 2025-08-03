import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search as SearchIcon, Mic } from 'lucide-react-native';
import BackHeader from 'components/BackHeader';
import { SearchBar } from 'react-native-screens';

const Search = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const insets = useSafeAreaInsets();

  // Trending search suggestions data
  const trendingItems = [
    {
      id: 1,
      title: 'Friendship Band',
      items: [
        { id: 1, name: 'Wonder Woman', image: 'https://www.bbassets.com/media/uploads/p/l/40313020_1-cs-friendship-band-assorted-003.jpg' },
        { id: 2, name: 'Superman', image: 'https://images.jdmagicbox.com/quickquotes/images_main/friendship-band-381063472-enrd1.jpeg' },
      ]
    },
    {
      id: 2,
      title: 'Rakhi',
      items: [
        { id: 3, name: 'Traditional Rakhi', image: 'https://sukkhi.com/cdn/shop/products/CBRAK104549_28i1_29_2da35378-a3ec-4f39-bb95-11adf431986e_2000x.jpg?v=1660911277' },
        { id: 4, name: 'Designer Rakhi', image: 'https://ahoora.in/cdn/shop/files/RAKHI216_1.jpg?crop=center&height=800&v=1747224422&width=800' },
      ]
    },
    {
      id: 3,
      title: 'Vanilla Ice Cream Cup',
      items: [
        { id: 5, name: 'Amul Ice Cream', image: 'https://dailycart.com/cdn/shop/files/A1YhY2Pov3L.jpg?v=1730471236' },
        { id: 6, name: 'Mother Dairy', image: 'https://m.media-amazon.com/images/I/71h4T8djdPL.jpg' },
      ]
    },
    {
      id: 4,
      title: 'Cardboard Box',
      items: [
        { id: 7, name: 'Small Box', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLDMBJB5MWSe3XMHmGwTVR7vFGbRQhIskURw&s' },
        { id: 8, name: 'Large Box', image: 'https://images.thdstatic.com/productImages/6323ca3a-0b38-4efa-9d42-c672f28aba2c/svn/the-home-depot-moving-boxes-lbx-64_1000.jpg' },
      ]
    },
    {
      id: 5,
      title: 'Vanilla Ice Cream Tub',
      items: [
        { id: 9, name: 'Amul Tub', image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/whjpnonako6vmbdpcstd' },
        { id: 10, name: 'Kwality Walls', image: 'https://m.media-amazon.com/images/I/61jEHH-XesL._UF1000,1000_QL80_.jpg' },
      ]
    },
    {
      id: 6,
      title: 'Wishcare Lip Balm',
      items: [
        { id: 11, name: 'Cherry Flavor', image: 'https://www.mywishcare.com/cdn/shop/files/1_22442331-4478-44cb-8ec6-07563ed02440.jpg?v=1706700035' },
        { id: 12, name: 'Vanilla Flavor', image: 'https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/26022078/2025/4/23/c211b909-5517-4457-8628-9863330d17e81745407174507-WishCare-Ceramide-Lip-Balm-with-SPF50-PA-For-Lip-Lightening--1.jpg' },
      ]
    }
  ];

  // Chips & Crisps data
  const chipsAndCrisps = [
    {
      id: 1,
      name: "Lay's West Indies Hot n Sweet Chilli Flavour Potato...",
      image: 'https://m.media-amazon.com/images/I/718mIkrmCfL.jpg',
      weight: '48 g',
      price: 20,
      rating: 4.5,
      reviews: '1,31,284',
      deliveryTime: '11 MINS',
      badge: 'Bestseller',
      isFavorite: false,
    },
    {
      id: 2,
      name: "Lay's American Style Cream & Onion Potato Ch...",
      image: 'https://m.media-amazon.com/images/I/711vAJ8fWlL.jpg',
      weight: '67 g',
      price: 30,
      rating: 4.5,
      reviews: '37,346',
      deliveryTime: '11 MINS',
      options: '2 options',
      isFavorite: false,
    },
    {
      id: 3,
      name: "Kurkure Puffcorn Yummy Cheese Puffs",
      image: 'https://m.media-amazon.com/images/I/81wJJZZ7XuL.jpg',
      weight: '52 g',
      price: 20,
      rating: 4.5,
      reviews: '85,248',
      deliveryTime: '11 MINS',
      options: '2 options',
      isFavorite: false,
    },
  ];

  return (
    <>
      <BackHeader title="Search" />
      <SafeAreaView className="flex-1 bg-white" edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header with Search Bar */}
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 20,
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f3f4f6', // bg-gray-100
                borderRadius: 999,
                paddingHorizontal: 16,
                minHeight: 44, // Ensures enough height on iOS
              }}
            >
              <SearchIcon size={20} color="#999" style={{ marginRight: 8 }} />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: '#374151', // text-gray-700
                  paddingVertical: Platform.OS === 'ios' ? 10 : 8,
                  minHeight: 36,
                  textAlignVertical: 'center', // fixes vertical alignment in Android, doesn't hurt iOS
                  includeFontPadding: false, // Android only, helps align text
                }}
                placeholder="Search for atta, dal, coke and more"
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
                returnKeyType="search"
              />
            </View>

            <TouchableOpacity style={{ padding: 8, marginLeft: 8 }}>
              <Mic size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Trending in your city */}
          <View className="py-5">
            <Text className="text-lg font-bold text-gray-900 mb-4 px-4">Trending in your city</Text>
            <View className="flex-row flex-wrap px-4 gap-3">
              {trendingItems.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className="w-[47%] bg-green-500 rounded-2xl p-3 mb-3"
                  activeOpacity={0.9}
                >
                  <Text className="text-base font-semibold text-white mb-2">{category.title}</Text>
                  <View className="flex-row gap-2">
                    {category.items.map((item, index) => (
                      <View key={item.id} className="bg-white rounded-lg p-1">
                        <Image source={{ uri: item.image }} className="w-10 h-10 rounded" />
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Chips & Crisps */}
          <View className="py-5">
            <Text className="text-lg font-bold text-gray-900 mb-4 px-4">Chips & Crisps</Text>
            <View className="flex-row gap-3 px-4">
              {chipsAndCrisps.map((product) => (
                <View key={product.id} className="flex-1 bg-white  mr-1">
                  {/* Badge */}
                  {product.badge && (
                    <View className="absolute top-3 left-3 bg-yellow-400 px-2 py-1 rounded z-10">
                      <Text className="text-xs font-bold text-white">{product.badge}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    className="absolute top-20 right-3 border flex-col items-center bg-white border-green-600  rounded-xl z-10"
                    onPress={() => addToCart(product)}
                  >
                    <Text className={`text-md font-bold ${!product.options && 'py-2 px-4'}  text-green-500`}>ADD</Text>
                    {product.options && (
                      <View className='bg-green-100 px-2 py-1 rounded-xl'>
                        <Text className="text-xs text-black ">{product.options}</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Product Image */}
                  <Image source={{ uri: product.image }} className="w-full h-24 rounded-lg mb-2" resizeMode="contain" />

                  {/* Delivery Time */}
                  <View className="flex-row items-center mb-2">
                    <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    <Text className="text-[10px] text-gray-500 font-semibold">{product.deliveryTime}</Text>
                  </View>

                  {/* Product Name */}
                  <Text className="font-semibold text-gray-800 text-[15px] mb-1" numberOfLines={2}>{product.name}</Text>

                  {/* Rating + Reviews */}
                  <View className="flex-row items-center mb-2">
                    <Text className="text-yellow-400 text-xs mr-1">★</Text>
                    <Text className="text-xs font-semibold text-gray-700 mr-1">{product.rating}</Text>
                    <Text className="text-xs text-gray-400">({product.reviews})</Text>
                  </View>

                  {/* Weight + Price */}
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center bg-gray-100 rounded px-2 py-0.5">
                      <View className="w-2 h-2 rounded-full bg-green-500 mr-1" />
                      <Text className="text-xs font-semibold text-gray-500">{product.weight}</Text>
                    </View>
                    <Text className="font-bold text-base text-gray-900">₹{product.price}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Search;