import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { configureReanimatedLogger, ReanimatedLogLevel, } from 'react-native-reanimated';

configureReanimatedLogger({
    level: ReanimatedLogLevel.Debug,
    strict: false,
});

const { width } = Dimensions.get('window');

export default function CategoryTabs({ categories, selectedCategory, setSelectedCategory }) {
    const tabWidth = width / categories.length;
    const underlineX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const index = categories.findIndex(cat => cat.id === selectedCategory);
        Animated.spring(underlineX, {
            toValue: index * tabWidth,
            useNativeDriver: true,
            stiffness: 150,
        }).start();
    }, [selectedCategory]);

    return (
        <View className="border-b border-gray-200">
            <View className="flex-row">
                {categories.map((cat) => {
                    const isActive = selectedCategory === cat.id;

                    return (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => setSelectedCategory(cat.id)}
                            activeOpacity={0.8}
                            className="flex-1 items-center justify-center py-3"
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
                                className={`text-xs font-semibold transition-all duration-200 ${isActive ? 'text-green-700' : 'text-gray-600'
                                    }`}
                            >
                                {cat.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Animated underline */}
            <Animated.View
                style={{
                    width: tabWidth * 0.6,
                    transform: [{
                        translateX: underlineX.interpolate({
                            inputRange: [0, width],
                            outputRange: [0, width],
                            extrapolate: 'clamp',
                        })
                    }],
                    marginLeft: tabWidth * 0.2,
                }}
                className="h-1 bg-green-600 rounded-full absolute bottom-0"
            />
        </View>
    );
}
