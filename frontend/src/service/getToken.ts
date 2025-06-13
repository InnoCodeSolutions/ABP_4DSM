import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const getToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return window.localStorage.getItem('authToken');
    } else {
      return await AsyncStorage.getItem('authToken');
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};