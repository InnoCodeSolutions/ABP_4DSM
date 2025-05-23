import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigation";
import "leaflet/dist/leaflet.css";
import { Platform } from "react-native";

if (Platform.OS === "web") {
  // Importa o CSS do Leaflet para uso no navegador
  require("leaflet/dist/leaflet.css");
}

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
  
}
