import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomePage from "../screens/HomePage";
import NotFoundScreen from "../screens/NotFoundScreen";
import ViewDevice from "../screens/ViewDevice";
import DashboardScreen from "../screens/DashboardScreen";
import MapView from "../components/MapView";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  ViewDevice: { device: { id: string; name: string } };
  Map: undefined;
  Dashboard: undefined;
  NotFound: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
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
        component={MapView}
        options={{ title: "Mapa" }}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Dashboard" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigation;
