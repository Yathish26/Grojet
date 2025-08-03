import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HotDeals = ({ hotDeals, onProductPress, onAddPress }) => {
    if (!hotDeals || hotDeals.length === 0) {
        return (
            <View className="p-4">
                <Text className="text-[22px] font-bold text-gray-900 mb-4 tracking-[0.2px]">
                Hot Deals
                </Text>
                <Text className="text-gray-400 text-base">
                    No hot deals available at the moment.
                </Text>
            </View>
        );
    }

    const cardMargin = 8;
    const numColumns = 3;
    const totalMargin = (numColumns - 1) * cardMargin;
    const cardWidth = (Dimensions.get('window').width - 32 - totalMargin) / numColumns;

    return (
        <View className="p-4">
            <Text className="text-xl font-bold text-gray-900 mb-4 tracking-[0.2px]">
            Hot Deals
            </Text>
            <View className="flex-row flex-wrap">
                {hotDeals.map((item, idx) => (
                    <TouchableOpacity
                        key={item._id}
                        activeOpacity={0.85}
                        className="mb-3 p-2"
                        style={{
                            width: cardWidth,
                            marginRight: (idx + 1) % numColumns === 0 ? 0 : cardMargin,
                            elevation: 4,
                        }}
                        onPress={() => onProductPress && onProductPress(item)}
                    >
                        <View className="items-center mb-2 bg-white rounded-2xl overflow-hidden h-28 justify-center">
                            <Image
                                source={{ uri: item.thumbnail }}
                                className="w-[90%] h-[70px] rounded-lg"
                                resizeMode="cover"
                            />
                        </View>
                        <Text
                            className="text-[13px] font-bold text-[#22223b] mb-0.5"
                            numberOfLines={2}
                        >
                            {item.name}
                        </Text>
                        <Text
                            className="text-xs text-gray-500 mb-0.5"
                            numberOfLines={1}
                        >
                            {item.brand}
                        </Text>
                        {/* New container for pricing and add button */}
                        <View className="flex-row items-center justify-between mt-1">
                            <View>
                                <View className="flex-row items-center mb-0.5">
                                    <Text className="text-green-600 font-bold text-[13px] mr-1">
                                        ₹{item.pricing?.sellingPrice}
                                    </Text>
                                    {item.pricing?.mrp > item.pricing?.sellingPrice && (
                                        <Text className="text-gray-400 text-[11px] line-through mr-1">
                                            ₹{item.pricing?.mrp}
                                        </Text>
                                    )}
                                </View>
                                {item.pricing?.offerTag && (
                                    <Text className="text-red-400 font-semibold text-[11px]">
                                        {item.pricing.offerTag}
                                    </Text>
                                )}
                            </View>

                            {/* The new "Add" button */}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                className="w-6 h-6 bg-green-600 rounded-full items-center justify-center"
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onAddPress && onAddPress(item);
                                }}
                            >
                                <Icon name="plus" size={12} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default HotDeals;