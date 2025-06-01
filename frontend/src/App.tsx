/*import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import AppNavigation from './navigation/AppNavigation';

// Import Leaflet CSS for web
if (Platform.OS === 'web') {
  require('leaflet/dist/leaflet.css');
  // Initialize smoothscroll-polyfill
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
      // Apply smooth scrolling behavior
      document.documentElement.style.scrollBehavior = 'smooth';

      // Handle wheel events for smooth scrolling
      const handleWheel = (event: WheelEvent) => {
        // Allow browser zoom when Ctrl is pressed
        if (event.ctrlKey) {
          return; // Não impede o comportamento padrão (permite zoom)
        }
        // Prevent default scrolling and apply smooth scroll
        event.preventDefault();
        window.scrollBy({
          top: event.deltaY * 2, // Adjust scroll speed
          behavior: 'smooth',
        });
      };

      window.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        window.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  return (
    <NavigationContainer>
      <AppNavigation />
    </NavigationContainer>
  );
};

// Apply global CSS for smooth scrolling on web
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
  `;
  document.head.appendChild(style);
}

export default App;*/

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Dimensions, ScrollView } from 'react-native';
import AppNavigation from './navigation/AppNavigation';

// Import Leaflet CSS for web
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
      // Apply smooth scrolling behavior
      document.documentElement.style.scrollBehavior = 'smooth';

      const handleWheel = (event: WheelEvent) => {
        if (event.ctrlKey) return;
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

  // Lógica de scroll para mobile: ao rotacionar a tela
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const handleRotation = () => {
        // Força um pequeno scroll para garantir o comportamento de scroll ao rotacionar
        setTimeout(() => {
          // Isso força o layout a se ajustar em certas telas
          window?.scrollTo?.(0, 1);
        }, 100);
      };

      const subscription = Dimensions.addEventListener('change', handleRotation);

      return () => subscription?.remove?.();
    }
  }, []);

  return (
    <NavigationContainer>
      {/* Para garantir que o scroll funcione em mobile, encapsular as telas com ScrollView onde necessário */}
      <AppNavigation />
    </NavigationContainer>
  );
};

// CSS global para web
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
  `;
  document.head.appendChild(style);
}

export default App;
