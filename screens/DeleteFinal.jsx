import BackHeader from "components/BackHeader"
import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { useRoute } from "@react-navigation/native";

const DeleteFinal = () => {
    const route = useRoute();
    const { reason } = route.params;
    return (
        <>
            <View className="flex-1 bg-gray-50">
                <BackHeader title="Delete Account" />

                <View className="flex-col gap-4 p-6">
                    <View className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <Text className="text-red-800 font-bold">Warning: Permanent Action</Text>
                        <Text className="text-red-600 text-sm mt-1">
                            This cannot be undone. All data will be erased.
                        </Text>
                    </View>

                    <Text className="text-xl font-bold text-gray-900">{reason}</Text>

                    <View className="space-y-1">
                        <Text className="text-gray-600 text-sm">
                            Do you have any feedback for us? We’d love to improve. (Optional)
                        </Text>
                        <TextInput
                            placeholder="Share your feedback..."
                            multiline
                            numberOfLines={3}
                            className="border border-gray-200 rounded-lg p-4 mt-2 text-gray-800 bg-white"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="bg-red-600 p-4 rounded-lg w-full items-center shadow-sm"
                        onPress={() => {/* Handle deletion */ }}
                    >
                        <Text className="text-white font-semibold text-base">
                            Delete Account Permanently
                        </Text>
                    </TouchableOpacity>

                    <View className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <Text className="text-gray-600 text-xs text-center">
                            By proceeding, you agree that all data—including orders, preferences, and history—will be permanently deleted as per our
                            <Text className="text-blue-500"> Privacy Policy</Text>.
                        </Text>
                    </View>
                </View>
            </View>
        </>
    )
}

export default DeleteFinal