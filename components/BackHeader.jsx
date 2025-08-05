import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, Search } from "lucide-react-native";
import { View, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BackHeader({ title, search }) {
    const navigation = useNavigation();

    return (
        <SafeAreaView
            style={{ backgroundColor: 'white' }}
            edges={['top', 'left', 'right']}
        >
            <View className="flex-row items-center justify-between p-4 bg-white">
                <View className="flex-row gap-4 items-center">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ChevronLeft size={20} color="#4A5568" />
                    </TouchableOpacity>
                    <Text className="text-xl font-semibold text-gray-800">{title}</Text>
                </View>
                {search ? (
                    <View className="flex-row">
                        <TouchableOpacity onPress={() => navigation.navigate('Search')} className="p-2">
                            <Search size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>
        </SafeAreaView>
    )
}