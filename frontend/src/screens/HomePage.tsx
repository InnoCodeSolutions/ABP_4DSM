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
import { getProfile } from "../service/authService";
import NavBar from "../components/Navbar";
import { BACKEND_HOST } from "@env";

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

const Icon: any = MaterialCommunityIcons;

const HomePage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [derivadores, setDerivadores] = useState<Marker[]>([]);
  const [userName, setUserName] = useState<string>("Usuário");

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
        console.error("Home - Erro ao carregar derivadores:", JSON.stringify(error, null, 2));
        Alert.alert("Erro", "Falha ao carregar dispositivos do banco de dados");
      }
    };

    const loadUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          setUserName("Usuário");
          return;
        }

        // Aqui a gente chama getProfile e pega diretamente o objeto de dados do usuário
        const profile = await getProfile(token);
        // Desestrutura o campo `name`
        const { name } = profile;
        // Atualiza o estado com esse nome (ou "Usuário" caso não exista)
        setUserName(name || "Usuário");
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        setUserName("Usuário");
      }
    };;

    loadDerivadores();
    loadUserProfile();
  }, []);

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirm = window.confirm("Deseja realmente sair?");
      if (confirm) {
        AsyncStorage.removeItem("authToken").then(() => {
          console.log("Home - Token removido (web)");
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
              console.log("Home - Token removido (mobile)");
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
      nestedScrollEnabled={true}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("About")}
          style={styles.aboutButton}
        >
          <Text style={styles.aboutText}>Sobre</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <Icon name="logout" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.greeting}>Olá, {userName}</Text>

      <View style={styles.mapContainer}>
        <MapView
          markers={derivadores}
          scrollEnabled={true}
          style={styles.map}
        />
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
  map: {
    width: "100%",
    height: "100%",
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
  iconButton: {
    padding: 6,
    borderRadius: 20,
  },
});

export default HomePage;