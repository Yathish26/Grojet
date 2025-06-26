import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CircleUserRoundIcon, Home, Layers2, Locate, Navigation2, PaintRoller, PlugZap, ReceiptText, Search, ShoppingCart, Tv, Umbrella, UserRound, Volleyball, X } from 'lucide-react-native';
import Svg, { Path } from "react-native-svg";

// Dummy data for categories, bestsellers, and grocery items
const categories = [
  { id: 'all', name: 'All', icon: <ReceiptText size={20} color="#4A5568" />, isNew: false },
  { id: 'monsoon', name: 'Monsoon', icon: <Umbrella size={20} color="#4A5568" />, isNew: true },
  { id: 'electronics', name: 'Electronics', icon: <PlugZap size={20} color="#4A5568" />, isNew: false },
  {
    id: 'beauty',
    name: 'Beauty',
    icon: <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      className="injected-svg"
      data-src="https://cdn.hugeicons.com/icons/blush-brush-02-stroke-standard.svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      role="img"
      color="#4a4a4a"
    >
      <Path
        d="M6.08594 3.99414L6.41749 4.89014C6.72135 5.7113 7.36878 6.35873 8.18994 6.66259L9.08594 6.99414L8.18994 7.32569C7.36878 7.62955 6.72135 8.27698 6.41749 9.09814L6.08594 9.99414L5.75439 9.09814C5.45053 8.27698 4.8031 7.62955 3.98194 7.32569L3.08594 6.99414L3.98194 6.66259C4.8031 6.35873 5.45053 5.7113 5.75439 4.89014L6.08594 3.99414Z"
        stroke="#4a4a4a"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.0386 14.9951C14.4376 19.861 11.4306 21.7441 10.0581 22.0028C7.42795 21.6554 5.70783 20.3663 4.63036 18.8624M15.0386 14.9951L12.0176 12.9777M15.0386 14.9951L17.5967 9.99416M12.0176 12.9777C7.95744 15.7109 4.65834 14.6371 3.14417 13.8776C3.07915 13.845 3.00175 13.8889 3.00059 13.9617C2.98129 15.1727 3.4326 17.1906 4.63036 18.8624M12.0176 12.9777L15.0236 8.38354M15.0236 8.38354L18.8579 2.52349C19.1891 2.02342 19.844 1.85533 20.3743 2.13425C20.9454 2.43462 21.1656 3.14192 20.8663 3.71445L17.5967 9.99416M15.0236 8.38354L17.5967 9.99416M4.63036 18.8624C6.72157 19.4846 9.39667 18.4653 10.1715 17.9526"
        stroke="#4a4a4a"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  },
  { id: 'decor', name: 'Decor', icon: <PaintRoller size={20} color="#4A5568" />, isNew: false },
  { id: 'home_appliances', name: 'Appliances', icon: <Tv size={20} color="#4A5568" />, isNew: false },
  { id: 'sports', name: 'Sports', icon: <Volleyball size={20} color="#4A5568" />, isNew: false },
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
      'https://placehold.co/50x50/FEE2E2/EF4444?text=🍟', // Red (fries)
      'https://placehold.co/50x50/BFDBFE/2563EB?text=🥨', // Blue (pretzel)
      'https://placehold.co/50x50/E9D5FF/8B5CF6?text=🌰', // Purple (nut)
      'https://placehold.co/50x50/D1FAE5/065F46?text=🍪', // Green (cookie)
    ],
  },
  {
    id: 'drinks_juices',
    name: 'Drinks & Juices',
    more: '+125 more',
    images: [
      'https://placehold.co/50x50/FEE2E2/EF4444?text=🥤',
      'https://placehold.co/50x50/BFDBFE/2563EB?text=🥛',
      'https://placehold.co/50x50/D1FAE5/065F46?text=🍾',
      'https://placehold.co/50x50/FCD34D/92400E?text=🍹',
    ],
  },
  {
    id: 'bakery_biscuits',
    name: 'Bakery & Biscuits',
    more: '+113 more',
    images: [
      'https://placehold.co/50x50/FEE2E2/EF4444?text=🍫',
      'https://placehold.co/50x50/BFDBFE/2563EB?text=🍩',
      'https://placehold.co/50x50/D1FAE5/065F46?text=🥐',
      'https://placehold.co/50x50/FCD34D/92400E?text=🍞',
    ],
  },
  {
    id: 'dairy_eggs',
    name: 'Dairy, Bread & Eggs',
    more: '+12 more',
    images: [
      'https://placehold.co/50x50/FCD34D/92400E?text=🧀',
      'https://placehold.co/50x50/A7F3D0/10B981?text=🥚',
      'https://placehold.co/50x50/FCA5A5/DC2626?text=🧈',
      'https://placehold.co/50x50/D1FAE5/065F46?text=🥖',
    ],
  },
  {
    id: 'oil_ghee',
    name: 'Oil, Ghee & Masala',
    more: '+141 more',
    images: [
      'https://placehold.co/50x50/FEE2E2/EF4444?text=🧴',
      'https://placehold.co/50x50/BFDBFE/2563EB?text=🌶️',
      'https://placehold.co/50x50/D1FAE5/065F46?text=🧂',
      'https://placehold.co/50x50/FCD34D/92400E?text=🍲',
    ],
  },
];

const groceryKitchenItems = [
  { id: 'veg', name: 'Vegetables & Fruits', image: 'https://placehold.co/100x100/A7F3D0/10B981?text=🥦+🍎' },
  { id: 'atta', name: 'Atta, Rice & Dal', image: 'https://placehold.co/100x100/BFDBFE/2563EB?text=🍚+🥣' },
  { id: 'oil_ghee_spices', name: 'Oil, Ghee & Spices', image: 'https://placehold.co/100x100/FCD34D/92400E?text=🍶+🌶️' },
  { id: 'dairy_bakery', name: 'Dairy & Bakery', image: 'https://placehold.co/100x100/FEE2E2/EF4444?text=🥛+🍞' },
  { id: 'snacks', name: 'Snacks & Beverages', image: 'https://placehold.co/100x100/D1FAE5/065F46?text=🍟+🥤' },
  { id: 'clean', name: 'Cleaning Essentials', image: 'https://placehold.co/100x100/E9D5FF/8B5CF6?text=🧹+🧼' },
];


export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchtext, setSearchText] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" /> {/* Status bar for the top */}

      {/* Top Bar (Blinkit Header) */}
      <View className="bg-white px-4 pt-4 pb-3 mt-8 shadow-sm border-b border-gray-100">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-xl font-bold text-gray-800">Grojet</Text>
          <View className="bg-gray-100 p-2 rounded-full">
            <CircleUserRoundIcon size={24} color="black" />
          </View>
        </View>

        <TouchableOpacity className="flex-row items-center bg-white">
          <View className="flex flex-row items-center">
            <Navigation2 size={20} color="#4A5568" />
            <Text className="text-sm text-gray-600">Mangalore ▼</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="p-4 bg-white border-b border-gray-200 shadow-sm">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Search size={20} color="#666" />
          <TextInput
            className="flex-1 text-gray-800 text-base px-3"
            value={searchtext}
            onChangeText={setSearchText}
            placeholder="Search 'bottle'"
            placeholderTextColor="#999"
          />
          {searchtext.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <X size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>


      <ScrollView className="flex-1 pb-20"> {/* Add padding for bottom nav */}
        {/* Horizontal Category Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="py-3 px-3 bg-white border-b border-gray-200"
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              className={`relative items-center mx-2 px-4 py-3 rounded-2xl flex-col
        ${selectedCategory === cat.id ? 'bg-blue-100' : 'bg-gray-100'}`}
            >
              {/* New badge */}
              {cat.isNew && (
                <View className="absolute top-0 right-0 bg-red-500 rounded-full px-1 py-0.5 -mt-2 -mr-2 z-10">
                  <Text className="text-white text-[10px] font-bold">NEW</Text>
                </View>
              )}

              {/* Icon */}
              <View className="mb-1">
                {cat.icon}
              </View>

              {/* Label */}
              <Text
                className={`text-xs font-semibold ${selectedCategory === cat.id ? 'text-blue-700' : 'text-gray-700'
                  }`}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>


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

                {/* Sub label */}
                <Text className="text-xs uppercase text-gray-400 text-center mb-1 tracking-wider">
                  {bestseller.more}
                </Text>

                {/* Main label */}
                <Text className="text-sm font-semibold text-gray-800 text-center">
                  {bestseller.name}
                </Text>
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

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md flex-row justify-around py-3">
        <TouchableOpacity className="items-center">
          <Home size={24} color="#4A5568" />
          <Text className="text-xs text-blue-600">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <ShoppingCart size={24} color="#4A5568" />
          <Text className="text-xs text-gray-500">Order Again</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Layers2 size={24} color="#4A5568" />
          <Text className="text-xs text-gray-500">Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <UserRound size={24} color="#4A5568" />
          <Text className="text-xs text-gray-500">Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}