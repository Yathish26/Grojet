import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native'; // or your icon library

const SearchBar = ({ 
  searchtext, 
  setSearchText, 
  placeholder = 'Search', 
  onPress,
  navigation,
  editable = false 
}) => {
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (navigation) {
      navigation.navigate('Search');
    }
  };

  if (editable) {
    // Return the original TextInput version when editable
    return (
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.input}
            value={searchtext}
            onChangeText={setSearchText}
            placeholder={placeholder}
            placeholderTextColor="#999"
            underlineColorAndroid="transparent"
            autoCorrect={false}
            clearButtonMode='never'
          />
        </View>
      </View>
    );
  }

  // Return touchable version for navigation
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.inputWrapper} onPress={handlePress} activeOpacity={0.7}>
        <Search size={20} color="#666" />
        <Text style={styles.placeholderText}>{placeholder}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    // Android shadow
    elevation: 4,
  },
  input: {
    flex: 1,
    color: '#222',
    fontSize: 16,
    paddingLeft: 12,
    paddingVertical: Platform.OS === 'ios' ? 4 : 0,
    // Removes extra line-height on iOS
    height: Platform.OS === 'ios' ? 28 : 40,
  },
  placeholderText: {
    flex: 1,
    color: '#999',
    fontSize: 16,
    paddingLeft: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 12,
  },
});

export default SearchBar;