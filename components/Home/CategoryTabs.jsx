import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView, Dimensions } from 'react-native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

configureReanimatedLogger({
  level: ReanimatedLogLevel.Debug,
  strict: false,
});

const TAB_WIDTH = 80;
const UNDERLINE_WIDTH = TAB_WIDTH * 0.7;
const SCROLL_PADDING_LEFT = 4;

// AnimatedIcon component to handle color transitions
const AnimatedIcon = ({ IconComponent, isActive, activeColor, inactiveColor = '#6B7280', size = 20 }) => {
  const scaleAnimation = useRef(new Animated.Value(isActive ? 1.2 : 1.0)).current;
  const opacityAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnimation, {
        toValue: isActive ? 1.2 : 1.0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      // Quick fade for smooth color transition effect
      Animated.sequence([
        Animated.timing(opacityAnimation, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, [isActive]);

  const currentColor = isActive ? activeColor : inactiveColor;

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnimation }],
        opacity: opacityAnimation
      }}
    >
      <IconComponent
        size={size}
        color={currentColor}
      />
    </Animated.View>
  );
};

export default function CategoryTabs({ categories, selectedCategory, setSelectedCategory, categoryColors, underlines }) {
  const underlineX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const getUnderlineColor = () => {
    if (underlines && underlines[selectedCategory]) {
      return underlines[selectedCategory];
    }

    if (!categoryColors || !selectedCategory) {
      return '#10B981'; // Default green color
    }
    const colors = categoryColors[selectedCategory];
    if (!colors || !Array.isArray(colors) || colors.length < 2) {
      return '#10B981'; // Fallback color
    }
    return colors[1] || '#10B981';
  };

  useEffect(() => {
    const index = categories.findIndex(cat => cat.id === selectedCategory);

    if (index === -1) return;

    const underlineOffset = (TAB_WIDTH - UNDERLINE_WIDTH) / 2;
    const targetX = SCROLL_PADDING_LEFT + index * (TAB_WIDTH + 4) + underlineOffset;

    Animated.spring(underlineX, {
      toValue: targetX,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();

    if (scrollViewRef.current) {
      const scrollPosition = Math.max(0, targetX - (TAB_WIDTH * 1.5));
      scrollViewRef.current.scrollTo({
        x: scrollPosition,
        animated: true,
      });
    }
  }, [selectedCategory, categories]);

  return (
    <View className="border-b border-gray-100 bg-white">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        bounces
      >
        <View className="flex-row relative" style={{ minHeight: 60 }}>
          {categories.map((cat, idx) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                  setSelectedCategory(cat.id);
                }}
                activeOpacity={0.8}
                className="items-center justify-center py-3 relative"
                style={{
                  width: TAB_WIDTH,
                  backgroundColor: isActive ? `${getUnderlineColor()}10` : 'transparent',
                  borderRadius: 8,
                  marginHorizontal: 2
                }}
              >
                {/* Badge */}
                {cat.isNew && (
                  <View className="absolute top-1 right-6 bg-red-500 rounded-full px-1 py-0.5 z-10">
                    <Text className="text-white text-[10px] font-bold">NEW</Text>
                  </View>
                )}

                {/* Icon */}
                <View className="mb-1">
                  <AnimatedIcon
                    IconComponent={cat.IconComponent}
                    isActive={isActive}
                    activeColor={getUnderlineColor()}
                    inactiveColor="#6B7280"
                    size={20}
                  />
                </View>

                {/* Label */}
                <Text
                  className={`text-xs font-semibold transition-all duration-200`}
                  style={{
                    color: isActive ? getUnderlineColor() : '#6B7280',
                    fontWeight: isActive ? '700' : '500'
                  }}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
          {/* Animated underline with dynamic color */}
          <Animated.View
            style={{
              width: UNDERLINE_WIDTH,
              height: 3,
              transform: [{
                translateX: underlineX
              }],
              position: 'absolute',
              bottom: 0,
              backgroundColor: getUnderlineColor(),
              borderRadius: 2,
              shadowColor: getUnderlineColor(),
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 2,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}