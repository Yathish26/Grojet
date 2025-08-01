import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";


export default function BackHeader({title}) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    return (
        <SafeAreaView 
            style={{ backgroundColor: 'white' }} 
            edges={['top', 'left', 'right']}
        >
            <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ChevronLeft size={20} color="#4A5568" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold text-gray-800 ml-4">{title}</Text> 
            </View>
        </SafeAreaView>
    )
}
