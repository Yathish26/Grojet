import { TouchableOpacity, Text, View, TouchableWithoutFeedback } from 'react-native';

export default function AlertBox({ title, message, onb1, onb2, b1, b2 }) {
    return (
        <View className="absolute inset-0 justify-center items-center bg-black/50 z-50 px-6">
            <TouchableWithoutFeedback onPress={onb2}>
                <View className="absolute inset-0" />
            </TouchableWithoutFeedback>
            
            <View className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
                <View className="items-center mb-4">
                    <Text className="text-xl font-bold text-gray-800 text-center">{title}</Text>
                </View>

                <Text className="text-base text-gray-600 text-center mb-6 leading-5">
                    {message}
                </Text>

                <View className='flex-row gap-3'>
                    <TouchableOpacity
                        onPress={onb1}
                        activeOpacity={0.8}
                        className="flex-1 bg-gray-200 px-4 py-3 rounded-lg"
                    >
                        <Text className="text-gray-800 text-center font-medium">{b1}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onb2}
                        activeOpacity={0.8}
                        className="flex-1 bg-green-500 px-4 py-3 rounded-lg"
                    >
                        <Text className="text-white text-center font-medium">{b2}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}