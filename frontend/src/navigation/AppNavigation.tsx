import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ActivityIndicator, View, StyleSheet, Alert, Platform, Text } from 'react-native'; // Explicitly import Text
import config from '../config/config.json';
import { RootStackParamList } from '../types/types';

// Import screens
import ReportsScreen from '../screens/ReportsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomePage from '../screens/HomePage';
import NotFoundScreen from '../screens/NotFoundScreen';
import ViewDevice from '../screens/ViewDevice';
import DashboardScreen from '../screens/DashboardScreen';
import MapScreen from '../screens/MapScreen';
import Profile from '@/screens/Profile';
import AboutScreen from '../screens/AboutScreen';

const Stack = createStackNavigator<RootStackParamList>();
const BASE_URL = `http://${config.backend.host}:${config.backend.port}`;

// Enhanced LoadingScreen with explicit Text import
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#3B82F6" />
    <Text style={styles.loadingText}>Carregando...</Text>
  </View>
);

const AppNavigation: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

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
          setInitialRoute('Home');
        } else {
          setInitialRoute('Login');
        }
      } catch (error: any) {
        console.error("Erro ao verificar token:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: `${BASE_URL}/auth/verify-token`,
        });
        await AsyncStorage.removeItem('authToken');
        setInitialRoute('Login');
        // Show user feedback
        if (Platform.OS !== 'web') {
          Alert.alert('Erro', 'Sessão inválida. Por favor, faça login novamente.');
        } else {
          window.alert('Sessão inválida. Por favor, faça login novamente.');
        }
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
    <Stack.Navigator initialRouteName={initialRoute}>
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
        name="About"
        component={AboutScreen}
        options={{ title: 'Sobre a Aplicação' }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewDevice"
        component={ViewDevice}
        options={{ title: 'Dispositivos' }}
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
        options={{ title: 'Relatórios' }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: 'Perfil' }}
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
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
});

export default AppNavigation;