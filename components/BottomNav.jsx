import { Home, ShoppingCart, UserRound } from 'lucide-react-native';
import React, { useRef, useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BottomNav({ currentRoute }) {
  const navigation = useNavigation();
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);

  const routes = [
    { name: 'Home', icon: Home },
    { name: 'Orders', icon: ShoppingCart },
    { name: 'Profile', icon: UserRound }
  ];

  const getIndex = (name) => routes.findIndex(r => r.name === name);

  useEffect(() => {
    const index = getIndex(currentRoute);
    if (tabWidth > 0 && index >= 0) {
      Animated.spring(indicatorAnim, {
        toValue: index * tabWidth,
        useNativeDriver: true,
        stiffness: 120,
        damping: 14,
        mass: 0.5
      }).start();
    }
  }, [currentRoute, tabWidth]);

  const handlePress = (routeName) => {
    navigation.navigate(routeName);
  };

  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setTabWidth(width / routes.length);
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg flex-row pb-2 z-50"
      onLayout={handleLayout}
    >
      {/* Top Indicator */}
      {tabWidth > 0 && (
        <Animated.View
          className="absolute top-0 h-1 bg-green-500 rounded-full"
          style={{
            width: tabWidth,
            transform: [{ translateX: indicatorAnim }]
          }}
        />
      )}

      {routes.map((route) => {
        const isActive = currentRoute === route.name;
        const Icon = route.icon;

        return (
          <TouchableOpacity
            key={route.name}
            onPress={() => handlePress(route.name)}
            className="flex-1 items-center justify-center py-3"
            activeOpacity={0.8}
          >
            <View className="p-2 rounded-full">
              <Icon
                size={24}
                color={isActive ? '#10B981' : '#9CA3AF'}
                fill={isActive ? '#10B981' : 'transparent'}
              />
            </View>
            <Text
              className={`text-xs font-medium ${isActive ? 'text-green-600' : 'text-gray-400'}`}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
