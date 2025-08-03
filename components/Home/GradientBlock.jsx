import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BadgePercent, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchBar from '../SearchBar'; // adjust path as needed
import PropTypes from 'prop-types';
import AppText from 'components/AppText';

const DEFAULT_GRADIENT = ['#ffffff', '#b9fbc0']; // white to light green

const GradientBlock = ({
    navigation,
    location = 'Mangalore',
    onBellPress,
    selectedCategory = 'all',
    categoryColors = {} // Ensure default as empty object
}) => {
    const [searchtext, setSearchText] = useState('');
    const insets = useSafeAreaInsets();

    const gradientColors = (
        Array.isArray(categoryColors[selectedCategory]) && categoryColors[selectedCategory].length > 0
            ? categoryColors[selectedCategory]
            : DEFAULT_GRADIENT
    );

    return (
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
                paddingHorizontal: 16,
                paddingTop: Platform.OS === 'ios' ? insets.top + 8 : StatusBar.currentHeight + 8,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#f3f4f6',
            }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Image
                        source={require('../../assets/gb.png')}
                        alt="Grojet Logo"
                        style={{ width: 90, height: 64, borderRadius: 16 }}
                        resizeMode="contain"
                    />
                <TouchableOpacity
                    onPress={onBellPress ? onBellPress : () => navigation?.navigate('OffersInfo')}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        padding: 8,
                        borderRadius: 999,
                        shadowColor: 'white',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        borderColor: '#f3f4f6',
                        borderWidth: 1,
                    }}
                >
                    <BadgePercent width={24} height={24} color="#4a4a4a" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MapPin size={16} color="#4a4a4a" />
                    <AppText color={'#4a4a4a'} weight={'500'}>{location}</AppText>
                </View>
            </TouchableOpacity>

            {/* Search Bar */}
            <SearchBar 
                searchtext={searchtext} 
                setSearchText={setSearchText} 
                placeholder="Search for Fresh Fruits" 
                navigation={navigation}
            />
        </LinearGradient>
    );
};

GradientBlock.propTypes = {
    navigation: PropTypes.object,
    location: PropTypes.string,
    onBellPress: PropTypes.func,
    selectedCategory: PropTypes.string,
    categoryColors: PropTypes.object,
};

export default GradientBlock;