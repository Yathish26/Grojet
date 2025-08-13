import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { Bell, Mail, ShoppingBag, Gift, Info, Settings } from 'lucide-react-native';
import BackHeader from 'components/BackHeader';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { API_HEADER } from 'endp/bline';

const API_BASE_URL = API_HEADER;

const Notifications = () => {
  const navigation = useNavigation();

  const [notificationSettings, setNotificationSettings] = useState({
    generalNotifications: true,
    emailNotifications: true,
    orderUpdates: true,
    promotionsOffers: false,
    appUpdates: true,
    securityAlerts: true,
  });
  const [hasEmail, setHasEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchPrefs = useCallback(async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) { setLoading(false); return; }
      const resp = await fetch(`${API_BASE_URL}/auth/notification-preferences`, { headers: { 'Authorization': `Bearer ${token}` }});
      const data = await resp.json();
      if (resp.ok) {
        setNotificationSettings(data.preferences || notificationSettings);
        setHasEmail(!!data.hasEmail);
      }
    } catch (err) { console.log('Fetch notification prefs error', err); } finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { fetchPrefs(); }, [fetchPrefs]));

  const saveAll = async () => {
    try {
      setSaving(true);
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) return;
      const resp = await fetch(`${API_BASE_URL}/auth/notification-preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(notificationSettings)
      });
      const data = await resp.json();
      if (resp.ok) {
        setNotificationSettings(data.preferences);
        setHasEmail(data.hasEmail);
        setDirty(false);
      }
    } catch (err) { console.log('Save prefs error', err); }
    finally { setSaving(false); }
  };

  const handleToggle = (settingName) => {
    setNotificationSettings(prev => ({ ...prev, [settingName]: !prev[settingName] }));
    setDirty(true);
  };

  const handleToggleAllNotifications = () => {
    const newState = !notificationSettings.generalNotifications;
    const updated = {
      generalNotifications: newState,
      emailNotifications: hasEmail ? newState : false,
      orderUpdates: newState,
      promotionsOffers: newState,
      appUpdates: newState,
      securityAlerts: newState,
    };
    setNotificationSettings(updated);
    setDirty(true);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <BackHeader title="Notifications" />

  <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="bg-white mx-2 p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
          <Text className="text-xs uppercase text-gray-500 font-bold mb-4 tracking-wide">General Notifications</Text>

          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row gap-2 items-center">
              <Bell size={20} color="#4b5563" />
              <Text className="text-base text-gray-800 font-medium">Enable All Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#5ae060" }}
              thumbColor={notificationSettings.generalNotifications ? "#388E3C" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggleAllNotifications} // Call the new handler
              value={notificationSettings.generalNotifications}
            />
          </View>

          {hasEmail && (
            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row gap-2 items-center">
                <Mail size={20} color="#4b5563" />
                <Text className="text-base text-gray-800 font-medium">Email Notifications</Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: "#5ae060" }}
                thumbColor={notificationSettings.emailNotifications ? "#388E3C" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => handleToggle('emailNotifications')}
                value={notificationSettings.emailNotifications}
              />
            </View>
          )}
        </View>

        <View className="bg-white mx-2 p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
          <Text className="text-xs uppercase text-gray-500 font-bold mb-4 tracking-wide">Specific Alerts</Text>

          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row gap-2 items-center">
              <ShoppingBag size={20} color="#4b5563" />
              <Text className="text-base text-gray-800 font-medium">Order Updates</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#5ae060" }}
              thumbColor={notificationSettings.orderUpdates ? "#388E3C" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => handleToggle('orderUpdates')}
              value={notificationSettings.orderUpdates}
            />
          </View>

          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row gap-2 items-center">
              <Gift size={20} color="#4b5563" />
              <Text className="text-base text-gray-800 font-medium">Promotions & Offers</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#5ae060" }}
              thumbColor={notificationSettings.promotionsOffers ? "#388E3C" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => handleToggle('promotionsOffers')}
              value={notificationSettings.promotionsOffers}
            />
          </View>

          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row gap-2 items-center">
              <Settings size={20} color="#4b5563" />
              <Text className="text-base text-gray-800 font-medium">App Updates</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#5ae060" }}
              thumbColor={notificationSettings.appUpdates ? "#388E3C" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => handleToggle('appUpdates')}
              value={notificationSettings.appUpdates}
            />
          </View>

          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row gap-2 items-center">
              <Info size={20} color="#4b5563" />
              <Text className="text-base text-gray-800 font-medium">Security Alerts</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#5ae060" }}
              thumbColor={notificationSettings.securityAlerts ? "#388E3C" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => handleToggle('securityAlerts')}
              value={notificationSettings.securityAlerts}
            />
          </View>
        </View>
      </ScrollView>
      {dirty && (
        <View className="absolute left-0 right-0 bottom-0 p-4 mb-4 bg-white border-t border-gray-200">
          <TouchableOpacity
            onPress={saveAll}
            disabled={saving}
            className={`py-4 rounded-full items-center ${saving ? 'bg-green-400' : 'bg-green-600'}`}
          >
            <Text className="text-white font-semibold text-base">{saving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Notifications;