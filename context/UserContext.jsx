import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userCache = useRef(null);
  const lastFetchTime = useRef(null);

  // Cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  // Initialize user data on app start
  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      setIsLoading(true);
      
      // Try to get from memory cache first
      if (userCache.current && lastFetchTime.current) {
        const now = Date.now();
        if (now - lastFetchTime.current < CACHE_DURATION) {
          setUser(userCache.current.user);
          setIsLoggedIn(userCache.current.isLoggedIn);
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }
      }

      // Load from storage
      const [userJson, storedToken] = await Promise.all([
        AsyncStorage.getItem('user'),
        SecureStore.getItemAsync('userToken')
      ]);

      if (userJson && storedToken) {
        const userData = JSON.parse(userJson);
        setUser(userData);
        setIsLoggedIn(true);
        
        // Update cache
        userCache.current = { user: userData, isLoggedIn: true };
        lastFetchTime.current = Date.now();
      } else {
        setUser(null);
        setIsLoggedIn(false);
        userCache.current = { user: null, isLoggedIn: false };
        lastFetchTime.current = Date.now();
        
        // Clean up invalid data
        if (userJson) await AsyncStorage.removeItem('user');
        if (storedToken) await SecureStore.deleteItemAsync('userToken');
      }
    } catch (error) {
      console.error('Failed to initialize user:', error);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  // Fast login function
  const login = async (userData, token) => {
    try {
      setIsLoading(true);
      
      // Store in secure storage
      await Promise.all([
        AsyncStorage.setItem('user', JSON.stringify(userData)),
        SecureStore.setItemAsync('userToken', token)
      ]);

      // Update state immediately (optimistic update)
      setUser(userData);
      setIsLoggedIn(true);
      
      // Update cache
      userCache.current = { user: userData, isLoggedIn: true };
      lastFetchTime.current = Date.now();
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fast logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Clear state immediately (optimistic update)
      setUser(null);
      setIsLoggedIn(false);
      
      // Clear cache
      userCache.current = { user: null, isLoggedIn: false };
      lastFetchTime.current = Date.now();

      // Clear storage in background
      Promise.all([
        SecureStore.deleteItemAsync('userToken').catch(() => {}),
        AsyncStorage.removeItem('user').catch(() => {})
      ]);
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user data
  const updateUser = async (newUserData) => {
    try {
      const updatedUser = { ...user, ...newUserData };
      
      // Update state immediately
      setUser(updatedUser);
      
      // Update cache
      userCache.current = { user: updatedUser, isLoggedIn: true };
      lastFetchTime.current = Date.now();
      
      // Update storage in background
      AsyncStorage.setItem('user', JSON.stringify(updatedUser)).catch(() => {});
      
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    if (!isLoggedIn) return;
    
    try {
      // Force refresh from storage
      lastFetchTime.current = null;
      userCache.current = null;
      await initializeUser();
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value = {
    user,
    isLoggedIn,
    isInitialized,
    isLoading,
    login,
    logout,
    updateUser,
    refreshUser,
    initializeUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
