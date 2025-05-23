import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackParamList } from "../navigation/AppNavigation";
import { Derivador, fetchDerivadores, fetchDeviceHistory } from "../service/deviceService";
import DeviceHistoryPopup from "../components/DeviceHistoryPopup";
import NavBar from "@/components/Navbar";

// Tipagem explícita para MaterialCommunityIcons
import { IconProps } from "react-native-vector-icons/Icon";
import { ComponentType } from "react";

const Icon: ComponentType<IconProps> = MaterialCommunityIcons as any; // Contorna erro de tipagem

const { width, height } = Dimensions.get("window");

// Tipagem da navegação
type ViewDeviceNavigationProp = NativeStackNavigationProp<RootStackParamList, "ViewDevice">;

const ViewDevice: React.FC = () => {
  const navigation = useNavigation<ViewDeviceNavigationProp>();

  // Estado para armazenar os dados dos dispositivos
  const [derivadores, setDerivadores] = useState<Derivador[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [deviceHistory, setDeviceHistory] = useState<Derivador[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Função para buscar os dados da API
  const loadDerivadores = async () => {
    try {
      const data = await fetchDerivadores();
      setDerivadores(data.length > 0 ? data : []);
    } catch (error) {
      console.error("Erro ao buscar derivadores:", error);
    }
  };

  // Função para buscar o histórico de um dispositivo
  const loadDeviceHistory = async (deviceId: string) => {
    try {
      setIsLoadingHistory(true);
      console.log("Fetching history for deviceId:", deviceId); // Debug device ID
      const history = await fetchDeviceHistory(deviceId);
      console.log("Device History Response:", history); // Debug API response
      setDeviceHistory(Array.isArray(history) ? history : []);
      setSelectedDevice(deviceId);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      setDeviceHistory([]); // Fallback to empty array on error
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Busca os dados ao carregar a tela
  useEffect(() => {
    loadDerivadores();
    const interval = setInterval(loadDerivadores, 60000);
    return () => clearInterval(interval);
  }, []);

  // Função para logout
  const handleLogout = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho com título e botão Home */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Meus dispositivos</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.iconButton}
        >
          <Icon name="home" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Lista de dispositivos */}
      <View style={styles.deviceContainer}>
        {derivadores.map((derivador, index) => (
          <TouchableOpacity
            key={index}
            style={styles.deviceButton}
            onPress={() => loadDeviceHistory(derivador.device_id)}
          >
            <View style={styles.deviceRow}>
              {/* Ícone do dispositivo */}
              <Image
                source={require("../assets/derivador-1.png")}
                style={styles.deviceIcon}
                resizeMode="contain"
              />
              {/* Informações do dispositivo */}
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceTitle}>{derivador.device_id}</Text>
                <Text style={styles.deviceLocation}>
                  Lat: {derivador.latitude?.toFixed(6) || 'N/A'}
                </Text>
                <Text style={styles.deviceLocation}>
                  Long: {derivador.longitude?.toFixed(6) || 'N/A'}
                </Text>
                <Text style={styles.deviceStatus} numberOfLines={1} ellipsizeMode="tail">
                  Última atualização: {new Date(derivador.timestamp || '').toLocaleString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Popup com histórico */}
      <DeviceHistoryPopup
        visible={!!selectedDevice}
        onClose={() => {
          setSelectedDevice(null);
          setDeviceHistory([]);
          setSelectedLocation(null);
        }}
        history={deviceHistory}
        deviceId={selectedDevice || ''}
        selectedLocation={selectedLocation}
        onSelectLocation={(location) => setSelectedLocation(location)}
      />

      {/* Botão de saída */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Icon name="logout" size={28} color="#fff" />
      </TouchableOpacity>
      <NavBar
        onPressHome={() => navigation.navigate("Home")}
        onPressDashboard={() => navigation.navigate("Dashboard")}
        onPressProfile={() => navigation.navigate("Profile")}
        selected=""
      />
    </View>
  );
};

const barHeight = Platform.select({
  ios: 54,
  android: 54,
  web: 60,
  default: 54,
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#041635",
    alignItems: "center",
    paddingTop: Platform.select({
      web: 30,
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
      web: 800,
      native: width * 0.9,
    }),
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  deviceContainer: {
    width: Platform.select({
      web: 800,
      native: width * 0.9,
    }),
    marginTop: 20,
    gap: 10,
    alignSelf: "center",
  },
  deviceButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  deviceInfo: {
    flexDirection: "column",
    flexShrink: 1,
  },
  deviceTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 4,
  },
  deviceLocation: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#FF0000",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default ViewDevice;