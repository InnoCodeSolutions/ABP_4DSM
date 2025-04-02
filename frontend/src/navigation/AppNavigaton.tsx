import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
// Placeholder imports for future screens
// import HomeScreen from '../screens/HomeScreen';
// import ViewDeviceScreen from '../screens/ViewDeviceScreen';
// import MapScreen from '../screens/MapScreen';
// import DashboardScreen from '../screens/DashboardScreen';

// Definindo os tipos para os parâmetros de navegação
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  ViewDevice: { device: { id: string; name: string } };
  Map: undefined;
  Dashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Hide header for a clean look
        />
        {/* Register Screen */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerShown: false, // Hide header to match the LoginScreen's design
          }}
        />
        {/* Placeholder screens for future implementation 
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="ViewDevice"
          component={ViewDeviceScreen}
          options={{ title: 'View Device' }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ title: 'Map' }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Dashboard' }}
        />*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;