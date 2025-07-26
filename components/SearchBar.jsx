import React from 'react';
import { View, TextInput, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native'; // or your icon library

const SearchBar = ({ searchtext, setSearchText }) => (
  <View style={styles.container}>
    <View style={styles.inputWrapper}>
      <Search size={20} color="#666" />
      <TextInput
        style={styles.input}
        value={searchtext}
        onChangeText={setSearchText}
        placeholder="Search Fresh Fruits"
        placeholderTextColor="#999"
        underlineColorAndroid="transparent"
        autoCorrect={false}
        clearButtonMode='never'
      />
      {searchtext.length > 0 && (
        <TouchableOpacity onPress={() => setSearchText('')}>
          <X size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

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
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    // Removes extra line-height on iOS
    height: Platform.OS === 'ios' ? 28 : 40,
  },
});

export default SearchBar;