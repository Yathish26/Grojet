import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingCart } from 'lucide-react-native';

const FloatingCartButton = ({ 
  totalItems, 
  bounceValue, 
  onPress, 
  cartItems = [] 
}) => {
  const insets = useSafeAreaInsets();

  if (totalItems <= 0) {
    return null;
  }

  return (
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
        onPress={() => onPress(cartItems)}
        className="flex-row items-center"
      >
        <ShoppingCart size={24} color="white" />
        <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center">
          <Text className="text-white text-xs font-bold">{totalItems}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cartButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default FloatingCartButton;
