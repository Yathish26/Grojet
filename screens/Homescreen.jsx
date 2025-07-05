import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Bell, Box, CircleUserRoundIcon, Flame, Gift, Home, Layers2, Leaf, LeafyGreen, Locate, Navigation2, Package, PaintRoller, PlugZap, ReceiptText, Search, ShoppingCart, Tv, Umbrella, UserRound, Vegan, Volleyball, Wheat, X } from 'lucide-react-native';
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from 'expo-linear-gradient';
import Svgdata from 'components/Svgdata';
import CategoryTabs from 'components/CategoryTabs';

// Dummy data for categories, bestsellers, and grocery items
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
    Icon: <Wheat size={20} color="#4A5568" />,
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
    Icon: <LeafyGreen size={20} color="#4A5568" />,
    isNew: false,
  },
];


const bestsellersCategories = [
  {
    id: 'veg_fruits',
    name: 'Vegetables & Fruits',
    more: '+71 more',
    images: [
      'https://i.pinimg.com/736x/4a/de/37/4ade3729109e48e14e0e3126f49df099.jpg', // Yellow (fruit)
      'https://i.pinimg.com/736x/26/ab/01/26ab01cec3231e5ec2e743c422e2aeca.jpg', // Green (onion)
      'https://i.pinimg.com/736x/1c/16/62/1c1662f546cc85a1d77732c840ff9113.jpg', // Red (banana)
      'https://i.pinimg.com/736x/47/20/dd/4720ddc8b21b7c05f92fe8f80566ed08.jpg', // Light green (potato)
    ],
  },
  {
    id: 'chips_namkeen',
    name: 'Chips & Namkeen',
    more: '+280 more',
    images: [
      'https://i.pinimg.com/736x/70/49/61/704961d2f6aff08cddc62f937000f0cc.jpg', // Red (fries)
      'https://i.pinimg.com/736x/c0/d6/51/c0d6512332ce5deea379b9e4a5211187.jpg', // Blue (pretzel)
      'https://i.pinimg.com/736x/c1/8a/63/c18a634891a35b0b80cb2889e8ff6d4a.jpg', // Purple (nut)
      'https://i.pinimg.com/736x/9e/72/13/9e72139236215e8ddc04ade8f4784e09.jpg', // Green (cookie)
    ],
  },
  {
    id: 'drinks_juices',
    name: 'Drinks & Juices',
    more: '+125 more',
    images: [
      'https://i.pinimg.com/736x/6f/16/26/6f162666c6650083f90885eb32fb6448.jpg',
      'https://i.pinimg.com/736x/83/a0/76/83a0765413aa33f05e1867ffedf2a429.jpg',
      'https://i.pinimg.com/736x/2f/2b/a3/2f2ba30aa098d1cfabed4ff8309e1117.jpg',
      'https://i.pinimg.com/736x/c6/0e/37/c60e373b7c5123c46f181c679fc388fc.jpg',
    ],
  },
  {
    id: 'bakery_biscuits',
    name: 'Bakery & Biscuits',
    more: '+113 more',
    images: [
      'https://i.pinimg.com/736x/8f/9f/2d/8f9f2d3f1fbef3283836c0c0d2936f44.jpg',
      'https://i.pinimg.com/736x/e3/98/3f/e3983fc41b690eefdb90996f6fc906c8.jpg',
      'https://i.pinimg.com/736x/18/e8/4f/18e84f373a1d7e3b121acf59b3777d79.jpg',
      'https://i.pinimg.com/736x/1b/dc/c6/1bdcc675fed703b9a6fecfb572d74114.jpg',
    ],
  },
  {
    id: 'dairy_eggs',
    name: 'Dairy, Bread & Eggs',
    more: '+12 more',
    images: [
      'https://i.pinimg.com/736x/e5/5c/0f/e55c0f188c99366d3f63c73c7b1363d8.jpg',
      'https://i.pinimg.com/736x/46/b8/7d/46b87dc1b5990413635bd9822e447240.jpg',
      'https://i.pinimg.com/736x/19/fb/1d/19fb1d9d5c381eced66413726d641b51.jpg',
      'https://i.pinimg.com/736x/cc/ae/ab/ccaeabf7766f4f303dba162bc08c907e.jpg',
    ],
  },
  {
    id: 'oil_ghee',
    name: 'Oil, Ghee & Masala',
    more: '+141 more',
    images: [
      'https://i.pinimg.com/736x/ac/38/52/ac3852fa65c08c33423f171d4e685598.jpg',
      'https://i.pinimg.com/736x/81/b0/e6/81b0e60ba40853f9f2b7a9c8fdea6840.jpg',
      'https://i.pinimg.com/736x/a3/0e/04/a30e0470e38b82947692cfbb37f7ad65.jpg',
      'https://i.pinimg.com/736x/3f/95/41/3f9541ffd94c2e472f65f7a497731b4e.jpg',
    ],
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">

      {/* Top Bar */}
      <LinearGradient
        colors={['#ffffff', '#039e18']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="px-4 pb-3 border-b border-gray-100"
      >
        <View className="flex-row justify-between items-center mt-3">
          <Image
            source={require('../assets/grojetpng.png')}
            className="w-32 h-16"
            resizeMode="contain"
          />
          <View className="bg-white/30 p-2 rounded-full">
            <Bell size={24} color="#4a4a4a" />
          </View>
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
        <View className="py-4">
          <View className="flex-row items-center bg-white rounded-xl px-4 py-1">
            <Search size={20} color="#666" />
            <TextInput
              className="flex-1 text-gray-800 text-base px-3"
              value={searchtext}
              onChangeText={setSearchText}
              placeholder="Search 'coconut'"
              placeholderTextColor="#999"
            />
            {searchtext.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <X size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>


      <ScrollView className="flex-1 pb-20">
        {/* Horizontal Category Scroll */}
        <CategoryTabs categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />


        {/* Bestsellers Section */}
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">Bestsellers</Text>
          <View className="flex-row flex-wrap justify-between -mx-1">
            {bestsellersCategories.map((bestseller) => (
              <TouchableOpacity
                key={bestseller.id}
                activeOpacity={0.85}
                className="w-[48%] mx-1 mb-4 bg-white rounded-2xl shadow-xl  p-4"
              >
                {/* Image Grid - Force rows of 2 or 3 items */}
                <View className="flex-row flex-wrap justify-center mb-2">
                  {bestseller.images.map((img, index) => (
                    <View
                      key={index}
                      className="w-[40%] aspect-square m-1 rounded-lg overflow-hidden "
                    >
                      <Image
                        source={{ uri: img }}
                        className="w-full h-full object-cover"
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                </View>

                <View className='flex-1 justify-center items-center'>
                  {/* Sub label */}
                  <Text className="text-xs uppercase text-gray-400  mb-1 tracking-wider">
                    {bestseller.more}
                  </Text>

                  {/* Main label */}
                  <Text className="text-sm font-semibold text-gray-800 ">
                    {bestseller.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
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

        {/* Placeholder for more content */}
        <View className="h-20"></View>
      </ScrollView>

    </SafeAreaView>
  );
}