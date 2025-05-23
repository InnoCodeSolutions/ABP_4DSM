import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MapView from "../components/MapView";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchDerivadores } from '../service/deviceService';
import NavBar from "../components/Navbar";

// Define navigation types
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  ViewDevice: { device: { id: string; name: string } };
  Map: undefined;
  Dashboard: undefined;
  NotFound: undefined;
  Reports: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Define marker type
interface Marker {
  latitude: number;
  longitude: number;
  title: string;
}

// Usar 'any' para evitar conflitos de tipagem com Icon
const Icon: any = MaterialCommunityIcons;

const { width, height } = Dimensions.get("window");

const HomePage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [derivadores, setDerivadores] = useState<Marker[]>([]);

  // Fetch derivadores from the database
  useEffect(() => {
    const loadDerivadores = async () => {
      try {
        const devices = await fetchDerivadores();
        const markers = devices.map(device => ({
          latitude: device.latitude || 0,
          longitude: device.longitude || 0,
          title: device.device_id,
        }));
        setDerivadores(markers);
      } catch (error: any) {
        console.error('Erro ao carregar derivadores:', error);
        Alert.alert('Erro', 'Falha ao carregar dispositivos do banco de dados');
      }
    };
    loadDerivadores();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    console.log("Token removido ao fazer logout");
    if (Platform.OS === "web") {
      window.alert("Você foi desconectado com sucesso!");
      navigation.navigate("Login");
    } else {
      Alert.alert("Sair", "Você foi desconectado com sucesso!", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    }
  };

  const handleAbout = () => {
    if (Platform.OS === "web") {
      window.alert(
        "Este aplicativo permite monitorar dispositivos, visualizar gráficos, acessar o mapa e tirar dúvidas sobre seu funcionamento."
      );
    } else {
      Alert.alert(
        "Sobre o App",
        "Este aplicativo permite monitorar dispositivos, visualizar gráficos, acessar o mapa e tirar dúvidas sobre seu funcionamento."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <Icon name="logout" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAbout}>
          <Text style={styles.headerText}>Sobre</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.greeting}>Olá, Usuário</Text>

      <View style={styles.mapContainer}>
        <MapView markers={derivadores} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ViewDevice")}
        >
          <Image
            source={require("../assets/dispositivo.png")}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Dispositivos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Image
            source={require("../assets/grafico.png")}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Map")}
        >
          <Image source={require("../assets/mapa.png")} style={styles.icon} />
          <Text style={styles.buttonText}>Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Reports")}
        >
          <Image source={require("../assets/relatorios.png")} style={styles.icon} />
          <Text style={styles.buttonText}>Relatórios</Text>
        </TouchableOpacity>
      </View>
      <NavBar
        onPressHome={() => navigation.navigate("Home")}
        onPressDashboard={() => navigation.navigate("Dashboard")}
        onPressProfile={() => navigation.navigate("Profile")}
        selected="home"
      />
    </View>
  );
};

const scale = (size: number, max: number) => Math.min(size, max);

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
    alignItems: "center",
    paddingTop: Platform.select({
      web: scale(height * 0.02, 30),
      native: 50,
    }),
    width: "100%",
    minHeight: height,
    maxWidth: Platform.select({
      web: 1000,
      native: width,
    }),
    alignSelf: "center",
    paddingBottom: barHeight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: Platform.select({
      web: scale(width * 0.8, 800),
      native: width * 0.9,
    }),
    paddingHorizontal: Platform.select({
      web: scale(width * 0.05, 20),
      native: 20,
    }),
    paddingVertical: Platform.select({
      web: scale(height * 0.01, 10),
      native: 2,
    }),
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: Platform.select({
      web: scale(width * 0.03, 20),
      native: 20,
    }),
    fontWeight: "bold",
  },
  greeting: {
    fontSize: Platform.select({
      web: scale(width * 0.05, 26),
      native: 26,
    }),
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: Platform.select({
      web: scale(width * 0.1, 100),
      native: width * 0.05,
    }),
    marginBottom: Platform.select({
      web: scale(height * 0.01, 5),
      native: 5,
    }),
    paddingTop: Platform.select({
      web: scale(height * 0.03, 30),
      native: 40,
    }),
  },
  mapContainer: {
    width: Platform.select({
      web: scale(width * 0.8, 800),
      native: width * 0.9,
    }),
    height: Platform.select({
      web: 300,
      native: 200,
    }),
    marginBottom: Platform.select({
      web: scale(height * 0.02, 20),
      native: 20,
    }),
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: Platform.select({
      web: scale(width * 0.8, 800),
      native: width * 0.9,
    }),
    marginTop: Platform.select({
      web: scale(height * 0.02, 20),
      native: 20,
    }),
    gap: Platform.select({
      web: 10,
      native: 10,
    }),
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: Platform.select({
      web: 160,
      native: width * 0.42,
    }),
    height: Platform.select({
      web: 160,
      native: width * 0.42,
    }),
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  icon: {
    width: Platform.select({
      web: scale(width * 0.05, 50),
      native: 50,
    }),
    height: Platform.select({
      web: scale(width * 0.05, 50),
      native: 50,
    }),
    marginBottom: 5,
  },
  buttonText: {
    fontSize: Platform.select({
      web: scale(width * 0.03, 14),
      native: 14,
    }),
    color: "#000",
    fontWeight: "bold",
  },
});

export default HomePage;