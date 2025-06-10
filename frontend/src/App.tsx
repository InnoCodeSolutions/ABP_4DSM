import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Dimensions, ScrollView } from 'react-native';
import AppNavigation from './navigation/AppNavigation';

if (Platform.OS === 'web') {
  require('leaflet/dist/leaflet.css');
  import('smoothscroll-polyfill').then((smoothscroll) => {
    smoothscroll.polyfill();
  });
}

const App = () => {
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        console.log("No token found, redirecting to login:", !token);
      } catch (error) {
        console.error("Error checking auth token:", error);
      }
    };

    initializeAuth();

    if (Platform.OS === 'web') {
      document.documentElement.style.scrollBehavior = 'smooth';

      const handleWheel = (event: WheelEvent) => {
        // Skip custom scroll handling if the target is within a ScrollView or modal
        const target = event.target as HTMLElement;
        const isInScrollView = target.closest('.react-native-scrollview, [data-scrollview], .modal-container');
        if (isInScrollView || event.ctrlKey) {
          return; // Let the default scroll behavior handle it
        }

        event.preventDefault();
        window.scrollBy({
          top: event.deltaY * 2,
          behavior: 'smooth',
        });
      };

      window.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        window.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const handleRotation = () => {
        setTimeout(() => {
          window?.scrollTo?.(0, 1);
        }, 100);
      };

      const subscription = Dimensions.addEventListener('change', handleRotation);
      return () => subscription?.remove?.();
    }
  }, []);

  return (
    <NavigationContainer>
      <AppNavigation />
    </NavigationContainer>
  );
};

if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      scroll-behavior: smooth;
      overscroll-behavior: contain;
      touch-action: manipulation;
    }
    .map-container {
      overflow: auto;
      touch-action: pan-x pan-y;
    }
    .react-native-scrollview, [data-scrollview], .modal-container {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
  `;
  document.head.appendChild(style);
}

export default App;
