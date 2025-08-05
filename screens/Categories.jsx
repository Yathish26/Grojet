import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image as ExpoImage } from "expo-image";
import GradientBlock from "components/Home/GradientBlock";
import AppText from "components/AppText";

const API_URL = "https://api.grojetdelivery.com/categories";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SPACING = 12;
const NUM_COLUMNS = 4;
const CARD_WIDTH = (SCREEN_WIDTH - SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function Categories({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const filtered = data.filter(
          (cat) => cat.isActive && cat.showOnHome
        );
        filtered.sort((a, b) => {
          if (a.mainCategory === b.mainCategory) {
            return (a.order ?? 0) - (b.order ?? 0);
          }
          return a.mainCategory.localeCompare(b.mainCategory);
        });
        if (mounted) setCategories(filtered);
      })
      .catch((err) => {
        if (mounted) {
          setCategories([]);
          setError(true);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const grouped = {};
  categories.forEach((cat) => {
    if (!grouped[cat.mainCategory]) grouped[cat.mainCategory] = [];
    grouped[cat.mainCategory].push(cat);
  });
  const mainCategories = Object.keys(grouped);

  const CategoryCard = ({ item }) => (
    <View className="items-center" style={{ width: CARD_WIDTH, marginHorizontal: SPACING / 2, marginBottom: SPACING }}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => navigation.navigate("CategoryProducts", { category: item })}
        className="bg-white rounded-3xl flex items-center justify-center p-2" // Added padding to the box
        style={{
          width: CARD_WIDTH,
          height: CARD_WIDTH, // Make the white box square
        }}
      >
        <ExpoImage
          source={item.image}
          style={{
            width: CARD_WIDTH * 0.8, // Make image take up more space within the box
            height: CARD_WIDTH * 0.8,
          }}
          contentFit="contain"
          transition={200}
          cachePolicy="immutable"
        />
      </TouchableOpacity>
      <Text
        className="text-center text-neutral-700 text-sm font-medium mt-2" // Margin top for spacing from the box
        style={{
          minHeight: 32, // Consistent height for 2 lines
          lineHeight: 16,
          width: '95%' // Ensure text fits within box width for wrapping
        }}
        numberOfLines={2}
      >
        {item.name}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
        <View className="flex-1 bg-gray-50 items-center justify-center">
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text className="mt-4 text-lg text-gray-600 font-medium">
            Fetching amazing categories...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
        <View className="flex-1 bg-gray-50 items-center justify-center p-5">
          <Text className="text-xl font-bold text-red-600 text-center">
            Oops! Something went wrong.
          </Text>
          <Text className="mt-2 text-base text-gray-700 text-center">
            We couldn't load the categories. Please check your network connection
            or try again later.
          </Text>
          <TouchableOpacity
            className="mt-6 bg-green-500 py-3 px-6 rounded-lg shadow-md"
            onPress={() => {
              setLoading(true);
              setError(false);
              fetch(API_URL)
                .then((res) => {
                  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                  return res.json();
                })
                .then((data) => {
                  const filtered = data.filter((cat) => cat.isActive && cat.showOnHome);
                  filtered.sort((a, b) => {
                    if (a.mainCategory === b.mainCategory) {
                      return (a.order ?? 0) - (b.order ?? 0);
                    }
                    return a.mainCategory.localeCompare(b.mainCategory);
                  });
                  setCategories(filtered);
                })
                .catch(() => {
                  setError(true);
                })
                .finally(() => setLoading(false));
            }}
          >
            <Text className="text-white text-lg font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['left', 'right', 'bottom']}>
      <GradientBlock 
        navigation={navigation} 
        location="Mangalore" 
        selectedCategory="categories"
      />
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-3 mt-3 bg-white">
          {mainCategories.map((mainKey) => (
            <View key={mainKey} className="mb-6">
              <AppText weight={"bold"} className="text-md font-bold text-gray-600 mb-4 ml-1 uppercase">
                {mainKey}
              </AppText>
              <FlatList
                data={grouped[mainKey]}
                keyExtractor={(item) => item._id}
                numColumns={NUM_COLUMNS}
                scrollEnabled={false}
                renderItem={({ item }) => <CategoryCard item={item} />}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                }}
                initialNumToRender={6}
                windowSize={5}
                removeClippedSubviews={true}
                updateCellsBatchingPeriod={15}
                maxToRenderPerBatch={12}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}