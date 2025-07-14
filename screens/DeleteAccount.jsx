import { useNavigation } from '@react-navigation/native';
import BackHeader from 'components/BackHeader';
import { ChevronRight } from 'lucide-react-native';
import { View, Text, TouchableOpacity } from 'react-native';

const DeleteAccount = () => {
    const reasons = [
        "I don't want to use Grojet anymore",
        "I'm using a different account",
        "I'm worried about my privacy",
        "This app isn't working properly",
        "Other"
    ];

    const navigation = useNavigation();

    return (
        <View className="flex-1 bg-gray-50">
            <BackHeader title="Delete Account" />
            <View className='flex-col px-6 pt-4 pb-2'>
                <Text className='text-2xl font-bold text-gray-900'>Delete My Account</Text>
                <Text className='text-sm text-gray-500 mt-1'>Tell us why you're leaving</Text>
            </View>
            <View className='flex-col mx-4 my-2 bg-white rounded-xl shadow-sm overflow-hidden'>
                {reasons.map((reason, index) => (
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('DeleteFinal', { reason })} 
                        key={index} 
                        className={`flex-row justify-between items-center px-5 py-4 ${index !== reasons.length - 1 ? 'border-b border-gray-100' : ''}`}
                        activeOpacity={0.7}
                    >
                        <Text className="text-gray-800 text-base">{reason}</Text>
                        <ChevronRight size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default DeleteAccount;