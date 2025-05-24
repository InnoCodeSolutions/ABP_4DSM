import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigation from './navigation/AppNavigation'; // Adjust path

const App = () => {
  useEffect(() => {
    const initializeAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        // Navigate to login if no token (implement navigation logic)
        console.log("No token found, redirecting to login");
      }
    };
    initializeAuth();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigation />
    </NavigationContainer>
  );
};

export default App;