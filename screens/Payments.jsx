import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import {
  CreditCard,
  Wallet,
  Bank,
  DollarSign,
  Check,
  Plus,
  IndianRupee,
} from 'lucide-react-native';
import Svgdata from 'components/Svgdata';
import BackHeader from 'components/BackHeader';


const Payments = () => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [showAddCard, setShowAddCard] = useState(false); // State to manage add card form visibility

  // Fallback dummy icon if any are missing
  const FallbackIcon = () => (
    <View style={{ width: 20, height: 20, backgroundColor: 'red', borderRadius: 4 }} />
  );

  const paymentMethods = [
    {
      id: 'card',
      title: 'Credit/Debit Card',
      icon: CreditCard,
      cards: [
        {
          id: '1',
          type: 'visa',
          number: '•••• •••• •••• 4242',
          expiry: '05/25',
          isDefault: true,
        },
        {
          id: '2',
          type: 'mastercard',
          number: '•••• •••• •••• 5555',
          expiry: '08/26',
          isDefault: false,
        },
      ],
    },
    {
      id: 'wallet',
      title: 'Wallet',
      icon: Wallet || FallbackIcon, // Using FallbackIcon if Wallet is undefined
      balance: '₹1,245.50',
    },
    {
      id: 'upi',
      title: 'UPI',
      icon: Bank || FallbackIcon, // Using FallbackIcon if Bank is undefined
      upiId: 'user@upi',
    },
    {
      id: 'cod',
      title: 'Cash on Delivery',
      icon: IndianRupee || FallbackIcon, // Using FallbackIcon if DollarSign is undefined
      description: 'Pay when you receive your order',
    },
  ];

  const renderCardLogo = (type) => {
    const logos = {
      visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png',
      mastercard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png',
    };
    return (
      <Image
        source={{ uri: logos[type] }}
        className="w-10 h-6 mr-3"
        resizeMode="contain"
      />
    );
  };

  return (
    <>
      <BackHeader title="Payment Methods" />
      <View className="flex-1 bg-gray-50">
        <ScrollView className="flex-1 px-4 pt-2">
          {/* Tabs for Payment Methods */}
          <View className="flex-row justify-between mb-6 bg-white rounded-xl p-1 shadow-sm">
            {paymentMethods.map((method) => {
              const isSelected = selectedMethod === method.id;
              const Icon = method.icon;

              return (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => setSelectedMethod(method.id)}
                  className={`flex-1 items-center py-2 rounded-lg ${isSelected ? 'bg-green-50' : ''}`}
                >
                  <View className={`p-2 rounded-full ${isSelected ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {method.id !== 'upi' && <Icon size={20} color={isSelected ? 'green' : '#4B5563'} />}
                    {method.id === 'upi' && <Svgdata icon={'upi'} size={20} color={isSelected ? '#3B82F6' : '#4B5563'} />}
                  </View>
                  <Text className={`text-xs mt-1 ${isSelected ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                    {method.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Content per method */}
          <View className="mb-6">
            {selectedMethod === 'card' && (
              <View className="space-y-3">
                <Text className="text-sm font-medium text-gray-500 mb-1">Saved Cards</Text>
                {paymentMethods.find((m) => m.id === 'card')?.cards.map((card) => (
                  <TouchableOpacity
                    key={card.id}
                    className="bg-white p-4 rounded-xl border border-gray-200 flex-row items-center"
                  >
                    {renderCardLogo(card.type)}
                    <View className="flex-1">
                      <Text className="text-gray-800 font-medium">{card.number}</Text>
                      <Text className="text-gray-500 text-xs">Expires {card.expiry}</Text>
                    </View>
                    {card.isDefault && (
                      <View className="bg-green-100 px-2 py-1 rounded-full">
                        <Text className="text-green-800 text-xs font-medium">Default</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex-row items-center justify-center mt-2"
                  onPress={() => setShowAddCard(true)}
                >
                  <Plus size={18} color="#6B7280" />
                  <Text className="text-gray-600 ml-2 font-medium">Add new card</Text>
                </TouchableOpacity>
              </View>
            )}

            {selectedMethod === 'wallet' && (
              <View className="bg-white p-6 rounded-xl items-center">
                <View className="bg-green-100 p-4 rounded-full mb-4">
                  <Wallet size={28} color="green" />
                </View>
                <Text className="text-gray-500 mb-1">Wallet Balance</Text>
                <Text className="text-3xl font-bold text-gray-800 mb-6">₹1,245.50</Text>
                <TouchableOpacity className="bg-green-500 px-6 py-3 rounded-full">
                  <Text className="text-white font-medium">Add Money</Text>
                </TouchableOpacity>
              </View>
            )}

            {selectedMethod === 'upi' && (
              <View className="bg-white p-6 rounded-xl">
                <Text className="text-sm font-medium text-gray-500 mb-4">Saved UPI ID</Text>
                <View className="flex-row items-center justify-between p-4 bg-green-50 rounded-lg mb-6">
                  <Text className="text-gray-800 font-medium">user@upi</Text>
                  <Check size={20} color="#10B981" />
                </View>
                <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex-row items-center justify-center">
                  <Plus size={18} color="#6B7280" />
                  <Text className="text-gray-600 ml-2 font-medium">Add new UPI ID</Text>
                </TouchableOpacity>
              </View>
            )}

            {selectedMethod === 'cod' && (
              <View className="bg-white p-6 rounded-xl items-center">
                <View className="bg-green-100 p-4 rounded-full mb-4">
                  <DollarSign size={28} color="#10B981" />
                </View>
                <Text className="text-xl font-bold text-gray-800 mb-2">Cash on Delivery</Text>
                <Text className="text-gray-500 text-center mb-6">
                  Pay with cash when your order is delivered
                </Text>
                <TouchableOpacity className="bg-green-500 px-6 py-3 rounded-full">
                  <Text className="text-white font-medium">Select COD</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default Payments;
