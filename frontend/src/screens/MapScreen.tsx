import React from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomMapView from "../components/MapView";
import NavBar from "../components/Navbar";

// Defina o tipo das rotas conforme seu projeto
type RootStackParamList = {
  Home: undefined;
  Dashboard: undefined;
  Profile: undefined;
  Map: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { height } = Dimensions.get("window");

const MapScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const markers = [
    { latitude: -22.9068, longitude: -43.1729, title: "Rio de Janeiro" },
    // ...outros markers
  ];

  return (
    <View style={styles.container}>
      <CustomMapView
        markers={markers}
        style={styles.map}
      />
      <NavBar
        onPressHome={() => navigation.navigate("Home")}
        onPressDashboard={() => navigation.navigate("Dashboard")}
        onPressProfile={() => navigation.navigate("Profile")}
        selected="" // ou "map" se quiser destacar
      />
    </View>
  );
};

const barHeight = Platform.select({
  ios: 54,
  android: 54,
  web: 60,
  default: 54,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#041635",
    paddingBottom: barHeight,
  },
  map: {
    flex: 1,
    borderRadius: 0,
  },
});

export default MapScreen;