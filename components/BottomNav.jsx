import { Home, ShoppingCart, UserRound } from 'lucide-react-native';
import React, { useRef, useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, Animated } from 'react-native';

export default function BottomNav({ state, descriptors, navigation }) {
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);

  const routes = [
    { name: 'Homescreen', icon: Home, label: 'Home' },
    { name: 'Orders', icon: ShoppingCart, label: 'Orders' },
    { name: 'Profile', icon: UserRound, label: 'Profile' }
  ];

  useEffect(() => {
    if (tabWidth > 0 && state.index >= 0) {
      Animated.spring(indicatorAnim, {
        toValue: state.index * tabWidth,
        useNativeDriver: true,
        stiffness: 120,
        damping: 14,
        mass: 0.5
      }).start();
    }
  }, [state.index, tabWidth]);

  // Use jumpTo for tab navigation (no history stack)
  const handlePress = (routeName, index) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes[index].key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(state.routes[index].name);
    }
  };

  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setTabWidth(width / state.routes.length);
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg flex-row z-50"
      onLayout={handleLayout}
    >
      {/* Top Indicator */}
      {tabWidth > 0 && (
        <Animated.View
          className="absolute top-0 h-1 bg-green-500 rounded-b-3xl"
          style={{
            width: tabWidth,
            transform: [{ translateX: indicatorAnim }]
          }}
        />
      )}

      {state.routes.map((tabRoute, index) => {
        const isActive = state.index === index;
        const routeConfig = routes.find(r => r.name === tabRoute.name);
        const Icon = routeConfig?.icon;

        return (
          <TouchableOpacity
            key={tabRoute.key}
            onPress={() => handlePress(tabRoute.name, index)}
            className="flex-1 items-center justify-center py-3"
            activeOpacity={0.8}
          >
            <View className="p-2 rounded-full">
              {Icon && (
                <Icon
                  size={24}
                  color={isActive ? '#10B981' : '#9CA3AF'}
                  fill={isActive ? '#10B981' : 'transparent'}
                />
              )}
            </View>
            <Text
              className={`text-xs font-medium ${isActive ? 'text-green-600' : 'text-gray-400'}`}
            >
              {routeConfig?.label || tabRoute.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}