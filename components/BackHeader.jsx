import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, Search } from 'lucide-react-native';

export default function BackHeader({
    title,
    search,
    middle,
    noback,
    textColor = 'black',
    backgroundColor = 'white'
}) {
    const navigation = useNavigation();

    return (
        <SafeAreaView
            style={{ backgroundColor }}
            edges={['top', 'left', 'right']}
        >
            <View className="flex-row items-center justify-between p-4" style={{ backgroundColor }}>
                <View className="flex-row gap-4 items-center" style={{ flex: middle ? 1 : undefined }}>
                    {!noback && (
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <ChevronLeft size={20} color={textColor} />
                        </TouchableOpacity>
                    )}
                    {!middle && (
                        <Text className="text-xl font-semibold" style={{ color: textColor }}>{title}</Text>
                    )}
                </View>
                {middle && (
                    <View style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }}>
                        <Text className="text-xl font-semibold" style={{ color: textColor }}>{title}</Text>
                    </View>
                )}
                {search ? (
                    <View className="flex-row">
                        <TouchableOpacity onPress={() => navigation.navigate('Search')} className="p-2">
                            <Search size={20} color={textColor} />
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>
        </SafeAreaView>
    )
}