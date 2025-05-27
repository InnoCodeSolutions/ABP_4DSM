import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import config from '@config/config.json';

// Import the ReportsScreen component
import ReportsScreen from '../screens/ReportsScreen';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomePage from '../screens/HomePage';
import NotFoundScreen from '../screens/NotFoundScreen';
import ViewDevice from '../screens/ViewDevice';
import DashboardScreen from '../screens/DashboardScreen';
import MapScreen from '@/screens/MapScreen';
import Profile from '@/screens/Profile';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  ViewDevice: { device: { id: string; name: string } };
  Map: undefined;
  Dashboard: undefined;
  NotFound: undefined;
  Reports: undefined; // Add this line
};

const Stack = createStackNavigator<RootStackParamList>();
const BASE_URL = `http://${config.backend.host}:${config.backend.port}`;

// Tela de carregamento
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#3B82F6" />
  </View>
);

const AppNavigation: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        console.log("Token recuperado ao iniciar:", token || "Nenhum token encontrado");
        if (token) {
          console.log("Verificando token com:", `${BASE_URL}/auth/verify-token`);
          const response = await axios.get(`${BASE_URL}/auth/verify-token`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Resposta do servidor:", response.data);
          console.log("Token válido, navegando para Home");
          setInitialRoute('Home');
        } else {
          console.log("Nenhum token encontrado, navegando para Login");
          setInitialRoute('Login');
        }
      } catch (error: any) {
        console.error("Erro ao verificar token:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: `${BASE_URL}/auth/verify-token`,
          token: await AsyncStorage.getItem('authToken') || "Nenhum token",
        });
        await AsyncStorage.removeItem('authToken');
        console.log("Token removido devido a erro, navegando para Login");
        setInitialRoute('Login');
      }
    };

    checkSession();
  }, []);

  if (!initialRoute) {
    console.log("Aguardando definição da rota inicial...");
    return <LoadingScreen />;
  }

  console.log("Rota inicial definida:", initialRoute);
  return (
    <Stack.Navigator initialRouteName={initialRoute as any}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewDevice"
        component={ViewDevice}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Mapa' }}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
  },
});

export default AppNavigation;