import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView, Dimensions } from 'react-native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.Debug,
  strict: false,
});

const TAB_WIDTH = 80;

export default function CategoryTabs({ categories, selectedCategory, setSelectedCategory, categoryColors }) {
  const underlineX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  // Get the current category's underline color
  const getUnderlineColor = () => {
    const colors = categoryColors[selectedCategory] || ['#67f57d', '#1ee83c'];
    return colors[1]; // Use the second color for underline
  };

  useEffect(() => {
    const index = categories.findIndex(cat => cat.id === selectedCategory);

    Animated.spring(underlineX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
      stiffness: 100,
    }).start();

    // Optionally scroll to selected tab
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: Math.max(0, (index - 1) * TAB_WIDTH),
        animated: true,
      });
    }
  }, [selectedCategory]);

  return (
    <View className="border-b border-gray-200">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="relative"
        bounces
      >
        <View className="flex-row relative">
          {categories.map((cat, idx) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.8}
                className="items-center justify-center py-3"
                style={{ width: TAB_WIDTH }}
              >
                {/* Badge */}
                {cat.isNew && (
                  <View className="absolute top-1 right-6 bg-red-500 rounded-full px-1 py-0.5 z-10">
                    <Text className="text-white text-[10px] font-bold">NEW</Text>
                  </View>
                )}

                {/* Icon */}
                <View
                  key={cat.id}
                  className={`mb-1 ${isActive ? 'scale-110 opacity-100' : 'scale-100 opacity-70'}`}
                >
                  {cat.Icon}
                </View>

                {/* Label */}
                <Text
                  className={`text-xs font-semibold transition-all duration-200 ${isActive ? 'text-black' : 'text-gray-500'
                    }`}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
          {/* Animated underline with dynamic color */}
          <Animated.View
            style={{
              width: TAB_WIDTH * 0.6,
              transform: [{
                translateX: underlineX
              }],
              marginLeft: TAB_WIDTH * 0.2,
              position: 'absolute',
              bottom: 0,
              backgroundColor: getUnderlineColor(),
            }}
            className="h-1 rounded-t-3xl"
          />
        </View>
      </ScrollView>
    </View>
  );
}