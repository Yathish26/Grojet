import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  CreditCard,
  Gift,
  Bank,
  Check,
  Plus,
  X,
} from 'lucide-react-native';
import Svgdata from 'components/Svgdata';
import BackHeader from 'components/BackHeader';
import { MaskedTextInput } from "react-native-mask-text";
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://172.16.0.39:5000'; // adjust if needed

const Payments = () => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddUpi, setShowAddUpi] = useState(false);
  const [cards, setCards] = useState([]); // server cards
  const [upiId, setUpiId] = useState(null); // single UPI id
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savingCard, setSavingCard] = useState(false);
  const [savingUpi, setSavingUpi] = useState(false);

  // Form states
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [newUpiId, setNewUpiId] = useState('');

  const detectCardType = (number) => {
    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const mastercardRegex = /^5[1-5][0-9]{14}$/;

    if (visaRegex.test(number)) return 'visa';
    if (mastercardRegex.test(number)) return 'mastercard';
    return 'unknown';
  };

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) { setLoading(false); return; }
      const resp = await fetch(`${API_BASE_URL}/auth/payments`, { headers: { 'Authorization': `Bearer ${token}` }});
      const data = await resp.json();
      if (resp.ok) {
        // Convert server cards to UI format
        const serverCards = (data.cards || []).map((c, idx) => ({
          id: idx.toString(),
          type: c.brand,
          maskedNumber: `•••• •••• •••• ${c.last4}`,
          expiry: `${String(c.expiryMonth).padStart(2,'0')}/${String(c.expiryYear).slice(-2)}`,
          name: c.nameOnCard,
          isDefault: c.isDefault
        }));
        setCards(serverCards);
        setUpiId(data.upi || null);
        setPoints(data.points || 0);
      }
    } catch (err) {
      console.log('Fetch payments error', err);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handleAddCard = async () => {
    if (!newCard.number || !newCard.expiry || !newCard.name) {
      Alert.alert('Error', 'Fill all card details');
      return;
    }
    if (newCard.number.replace(/\s+/g,'').length !== 16) {
      Alert.alert('Error', 'Enter 16-digit card number');
      return;
    }
    try {
      setSavingCard(true);
      const token = await SecureStore.getItemAsync('userToken');
      const resp = await fetch(`${API_BASE_URL}/auth/payments/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ cardNumber: newCard.number, expiry: newCard.expiry, name: newCard.name })
      });
      const data = await resp.json();
      if (!resp.ok) {
        Alert.alert('Error', data.message || 'Failed to add card');
      } else {
        setNewCard({ number: '', expiry: '', cvv: '', name: '' });
        setShowAddCard(false);
        fetchPayments();
      }
    } catch (err) { console.log('Add card error', err); }
    finally { setSavingCard(false); }
  };

  const setDefaultCard = async (cardIndex) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const resp = await fetch(`${API_BASE_URL}/auth/payments/cards/${cardIndex}/default`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` }});
      if (resp.ok) fetchPayments();
    } catch (err) { console.log('Set default card error', err); }
  };

  const handleAddUpi = async () => {
    if (!newUpiId.includes('@')) {
      Alert.alert('Error', 'Enter valid UPI ID');
      return;
    }
    try {
      setSavingUpi(true);
      const token = await SecureStore.getItemAsync('userToken');
      const resp = await fetch(`${API_BASE_URL}/auth/payments/upi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ upiId: newUpiId })
      });
      const data = await resp.json();
      if (!resp.ok) Alert.alert('Error', data.message || 'Failed to save UPI');
      else {
        setUpiId(data.upi);
        setShowAddUpi(false);
        setNewUpiId('');
      }
    } catch (err) { console.log('Add UPI error', err); }
    finally { setSavingUpi(false); }
  };

  const renderCardLogo = (type) => {
    const logos = {
      visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png',
      mastercard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png',
      unknown: 'https://cdn-icons-png.flaticon.com/512/196/196578.png',
    };
    return (
      <Image
        source={{ uri: logos[type] || logos.unknown }}
        className="w-10 h-6 mr-3"
        resizeMode="contain"
      />
    );
  };

  const paymentMethods = [
    { id: 'card', title: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', title: 'UPI', icon: Bank },
    { id: 'points', title: 'Grojet Points', icon: Gift }
  ];

  return (
    <>
      <BackHeader title="Payment Methods" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // adjust offset as needed
      >
        <View className="flex-1 bg-gray-50">
          <KeyboardAwareScrollView
            className="flex-1 px-4 pt-2"
            contentContainerStyle={{ paddingBottom: 20 }}
            extraScrollHeight={20} // increases space above keyboard (tweak as needed)
            enableOnAndroid={true} // ensures it works on Android too
          >
            {/* Tabs for Payment Methods */}
            <View className="flex-row justify-between mb-6 bg-white rounded-2xl p-2 border border-gray-200">
              {paymentMethods.map((method) => {
                const isSelected = selectedMethod === method.id;
                const Icon = method.icon;

                return (
                  <TouchableOpacity
                    key={method.id}
                    onPress={() => setSelectedMethod(method.id)}
                    className={`flex-1 items-center py-3 rounded-xl ${isSelected ? 'bg-green-50 border border-green-300' : ''}`}
                  >
                    <View className={`p-2 rounded-full ${isSelected ? 'bg-green-100' : 'bg-gray-50'}`}>
                      {method.id !== 'upi' && <Icon size={20} color={isSelected ? '#10B981' : '#4B5563'} />}
                      {method.id === 'upi' && <Svgdata icon={'upi'} size={20} color={isSelected ? '#3B82F6' : '#4B5563'} />}
                    </View>
                    <Text className={`text-xs mt-1 ${isSelected ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
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
          {loading && <ActivityIndicator color="#10B981" className="mb-2" />}
          {cards.map((card, idx) => (
                    <TouchableOpacity
            key={card.id}
                      className="bg-white p-4 rounded-xl border mb-2 border-gray-200 flex-row items-center"
            onPress={() => setDefaultCard(idx)}
                    >
            {renderCardLogo(card.type)}
                      <View className="flex-1">
                        <Text className="text-gray-800 font-medium">{card.maskedNumber}</Text>
                        <Text className="text-gray-500 text-xs">Expires {card.expiry} • {card.name}</Text>
                      </View>
                      {card.isDefault ? (
                        <View className="bg-green-100 px-2 py-1 rounded-full">
                          <Text className="text-green-800 text-xs font-medium">Default</Text>
                        </View>
                      ) : (
                        <View className="w-4 h-4 rounded-full border border-gray-200" />
                      )}
                    </TouchableOpacity>
                  ))}

                  {showAddCard ? (
                    <View className="bg-white p-4 rounded-xl border border-gray-200 mt-2">
                      <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-semibold text-gray-800">Add New Card</Text>
                        <TouchableOpacity onPress={() => setShowAddCard(false)}>
                          <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                      </View>

                      <Text className="text-sm text-gray-600 mb-1">Card Number</Text>
                      <MaskedTextInput
                        mask="9999 9999 9999 9999"
                        onChangeText={(text, rawText) => setNewCard({ ...newCard, number: rawText })}
                        value={newCard.number}
                        keyboardType="numeric"
                        className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-3"
                        placeholder="5548 5678 9012 3456"
                      />

                      <View className="flex-row mb-3">
                        <View className="flex-1 mr-2">
                          <Text className="text-sm text-gray-600 mb-1">Expiry Date</Text>
                          <MaskedTextInput
                            mask="99/99"
                            onChangeText={(text) => setNewCard({ ...newCard, expiry: text })}
                            value={newCard.expiry}
                            keyboardType="numeric"
                            className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                            placeholder="MM/YY"
                          />
                        </View>
                        <View className="flex-1 ml-2">
                          <Text className="text-sm text-gray-600 mb-1">CVV</Text>
                          <MaskedTextInput
                            mask="999"
                            onChangeText={(text) => setNewCard({ ...newCard, cvv: text })}
                            value={newCard.cvv}
                            keyboardType="numeric"
                            className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                            placeholder="123"
                          />
                        </View>
                      </View>

                      <Text className="text-sm text-gray-600 mb-1">Cardholder Name</Text>
                      <TextInput
                        onChangeText={(text) => setNewCard({ ...newCard, name: text })}
                        value={newCard.name}
                        className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4"
                        placeholder="John Doe"
                      />

                      <TouchableOpacity
                        className="bg-green-500 py-3 rounded-lg items-center"
                        onPress={handleAddCard}
                        disabled={savingCard}
                      >
                        <Text className="text-white font-medium">{savingCard ? 'Adding...' : 'Add Card'}</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex-row items-center justify-center mt-2"
                      onPress={() => setShowAddCard(true)}
                    >
                      <Plus size={18} color="#6B7280" />
                      <Text className="text-gray-600 ml-2 font-medium">Add new card</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

        {selectedMethod === 'points' && (
                <View className="bg-white p-6 rounded-xl items-center shadow-xs">
                  <View className="bg-purple-100 p-4 rounded-full mb-4">
                    <Gift size={28} color="#8B5CF6" />
                  </View>
          <Text className="text-gray-500 mb-1">Your Grojet Points</Text>
          <Text className="text-3xl font-bold text-gray-800 mb-2">{points}</Text>
          <Text className="text-gray-500 text-sm mb-6">Value: ₹{(points/100).toFixed(2)}</Text>
                  <View className="w-full">
                    <Text className="text-sm font-medium text-gray-700 mb-2">Points Benefits</Text>
                    <View className="bg-purple-50 p-3 rounded-lg mb-2">
                      <Text className="text-purple-800 text-sm">100 points = ₹1</Text>
                    </View>
                    <View className="bg-purple-50 p-3 rounded-lg mb-2">
                      <Text className="text-purple-800 text-sm">Earn 2 points per ₹100 spent</Text>
                    </View>
                    <View className="bg-purple-50 p-3 rounded-lg">
                      <Text className="text-purple-800 text-sm">No expiry on points</Text>
                    </View>
                  </View>
                </View>
              )}

              {selectedMethod === 'upi' && (
                <View className="bg-white p-6 rounded-xl shadow-xs">
                  <Text className="text-sm font-medium text-gray-500 mb-4">Saved UPI ID</Text>
                  {upiId && (
                    <View className="flex-row items-center justify-between p-4 bg-blue-50 rounded-lg mb-3">
                      <Text className="text-gray-800 font-medium">{upiId}</Text>
                      <Check size={20} color="#3B82F6" />
                    </View>
                  )}

                  {showAddUpi ? (
                    <View className="border-2 border-dashed border-gray-300 rounded-xl p-4 mt-2">
                      <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-semibold text-gray-800">Add New UPI ID</Text>
                        <TouchableOpacity onPress={() => setShowAddUpi(false)}>
                          <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                      </View>

                      <Text className="text-sm text-gray-600 mb-1">UPI ID</Text>
                      <TextInput
                        onChangeText={setNewUpiId}
                        value={newUpiId}
                        keyboardType="email-address"
                        className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4"
                        placeholder="username@upi"
                        autoCapitalize="none"
                      />

                      <TouchableOpacity
                        className="bg-blue-500 py-3 rounded-lg items-center"
                        onPress={handleAddUpi}
                        disabled={savingUpi}
                      >
                        <Text className="text-white font-medium">{savingUpi ? 'Saving...' : 'Add UPI ID'}</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex-row items-center justify-center mt-2"
                      onPress={() => setShowAddUpi(true)}
                    >
                      <Plus size={18} color="#6B7280" />
                      <Text className="text-gray-600 ml-2 font-medium">{upiId ? 'Update UPI ID' : 'Add new UPI ID'}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </KeyboardAwareScrollView>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default Payments;