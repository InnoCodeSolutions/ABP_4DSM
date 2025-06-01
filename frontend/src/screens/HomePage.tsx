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
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MapView from "../components/MapView";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchDerivadores } from "../service/deviceService";
import NavBar from "../components/Navbar";
import axios from "axios";
import config from "../config/config.json";

// Função para decodificar o token JWT manualmente
const decodeToken = (token: string): { id: number; email: string } | null => {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    return {
      id: decodedPayload.id,
      email: decodedPayload.email,
    };
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
};

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  About: undefined;
  ViewDevice: { device: { id: string; name: string } };
  Map: undefined;
  Dashboard: undefined;
  NotFound: undefined;
  Reports: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

interface Marker {
  latitude: number;
  longitude: number;
  title: string;
}

interface UserProfile {
  id: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string;
  criado_em: string;
}

const Icon: any = MaterialCommunityIcons;

const HomePage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [derivadores, setDerivadores] = useState<Marker[]>([]);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const loadDerivadores = async () => {
      try {
        const devices = await fetchDerivadores();
        const markers = devices.map((device) => ({
          latitude: device.latitude || 0,
          longitude: device.longitude || 0,
          title: device.device_id,
        }));
        setDerivadores(markers);
      } catch (error: any) {
        console.error("Erro ao carregar derivadores:", error);
        Alert.alert("Erro", "Falha ao carregar dispositivos do banco de dados");
      }
    };

    const loadUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Nenhum token de autenticação encontrado");

        const decoded = decodeToken(token);
        if (!decoded || !decoded.id)
          throw new Error("Não foi possível decodificar o token");

        const API_URL = `http://${config.backend.host}:${config.backend.port}`;
        const response = await axios.get(`${API_URL}/users/${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData: UserProfile = response.data;
        setUserName(userData.name || "Usuário");
      } catch (error: any) {
        console.error("Erro ao carregar perfil do usuário:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        setUserName("Usuário");
      }
    };

    loadDerivadores();
    loadUserProfile();
  }, []);

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirm = window.confirm("Deseja realmente sair?");
      if (confirm) {
        AsyncStorage.removeItem("authToken").then(() => {
          console.log("Token removido (web)");
          navigation.navigate("Login");
        });
      }
    } else {
      Alert.alert(
        "Confirmar Logout",
        "Deseja realmente sair?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Sair",
            style: "destructive",
            onPress: async () => {
              await AsyncStorage.removeItem("authToken");
              console.log("Token removido (mobile)");
              navigation.navigate("Login");
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <Icon name="logout" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("About")}
          style={styles.aboutButton}
        >
          <Text style={styles.aboutText}>Sobre</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.greeting}>Olá, {userName}</Text>

      <View style={styles.mapContainer}>
        <MapView markers={derivadores} scrollEnabled={false} />
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
          <Image
            source={require("../assets/relatorios.png")}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Relatórios</Text>
        </TouchableOpacity>
      </View>

      <NavBar
        onPressHome={() => navigation.navigate("Home")}
        onPressDashboard={() => navigation.navigate("Dashboard")}
        onPressProfile={() => navigation.navigate("Profile")}
        selected="home"
      />
    </ScrollView>
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
    width: "100%",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: Platform.OS === "web" ? 20 : 50,
    paddingBottom: barHeight,
    minHeight: Dimensions.get("window").height,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    paddingVertical: 10,
  },
  greeting: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: "5%",
    marginTop: 10,
  },
  mapContainer: {
    width: "90%",
    height: 250,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    gap: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 12,
    elevation: 3,
    flexDirection: "row",
    gap: 12,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  aboutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  aboutText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
  },
});

export default HomePage;