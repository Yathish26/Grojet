import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import { View, TouchableOpacity, Text } from "react-native";


export default function BackHeader({title}) {
    const navigation = useNavigation();
    return (
        <View className="flex-row items-center p-4 pt-6 bg-white border-b border-gray-200">
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <ChevronLeft size={20} color="#4A5568" />
            </TouchableOpacity>
            <Text className="text-xl font-semibold text-gray-800 ml-4">{title}</Text> 
        </View>
    )
}
