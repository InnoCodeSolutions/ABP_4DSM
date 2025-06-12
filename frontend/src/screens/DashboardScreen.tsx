import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Derivador, fetchDerivadores, fetchDeviceHistory } from "../service/deviceService";
import MovementChart from "../components/MovementChart";
import DeviceHistoryPopup from "../components/DeviceHistoryPopup";
import NavBar from "../components/Navbar";

const Icon: any = MaterialCommunityIcons;
const { width } = Dimensions.get("window");

type RootStackParamList = {
  Home: undefined;
  Dashboard: { device?: Derivador };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DashboardRouteProp = { params: { device?: Derivador } | undefined };
type Props = { route: DashboardRouteProp };

// Função para calcular distância Haversine (em metros)
const haversineDistance = (
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371000; // raio da Terra em metros
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const DashboardScreen: React.FC<Props> = ({ route }) => {
  const [derivadores, setDerivadores] = useState<Derivador[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Derivador | null>(
    route.params?.device || null
  );
  const [rawDeviceHistory, setRawDeviceHistory] = useState<Derivador[]>([]);
  const [formattedDeviceHistory, setFormattedDeviceHistory] = useState<
    { date: string; count: number }[]
  >([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [deviceListVisible, setDeviceListVisible] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [totalMovements, setTotalMovements] = useState<number>(0);
  const navigation = useNavigation<NavigationProp>();
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get("window"));

  // Atualiza dimensões ao rotacionar/trocar tamanho
  useEffect(() => {
    const updateDimensions = () => setWindowDimensions(Dimensions.get("window"));
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  // Carrega lista de dispositivos
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchDerivadores();
        setDerivadores(data || []);
      } catch (error) {
        console.error("Erro ao buscar derivadores:", error);
      }
    })();
  }, []);

  // Calcula total de eventos (número de pontos no histórico) para todos os dispositivos
  useEffect(() => {
    (async () => {
      try {
        let total = 0;
        for (const device of derivadores) {
          const history = await fetchDeviceHistory(device.device_id);
          total += Array.isArray(history) ? history.length : 0;
        }
        setTotalMovements(total);
      } catch (error) {
        console.error("Erro ao calcular total de movimentações:", error);
      }
    })();
  }, [derivadores]);

  // Carrega e formata histórico de um dispositivo (distâncias entre pontos)
  const loadDeviceHistory = async (deviceId: string) => {
    setIsLoadingHistory(true);
    try {
      const history = await fetchDeviceHistory(deviceId);
      const raw = Array.isArray(history) ? history : [];
      setRawDeviceHistory(raw);

      // Filtra só itens válidos e ordena por timestamp
      const clean = raw
        .filter(item =>
          typeof item.timestamp === "string" &&
          !isNaN(Date.parse(item.timestamp)) &&
          typeof item.latitude === "number" &&
          typeof item.longitude === "number"
        )
        .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime());

      // Calcula distâncias sucessivas
      const formatted = [];
      for (let i = 1; i < clean.length; i++) {
        const prev = clean[i - 1];
        const curr = clean[i];
        const dist = haversineDistance(
          prev.latitude!, prev.longitude!,
          curr.latitude!, curr.longitude!
        );
        formatted.push({
          date: new Date(curr.timestamp!).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }),
          count: parseFloat(dist.toFixed(2)), // metros com duas casas
        });
      }

      setFormattedDeviceHistory(formatted);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      setRawDeviceHistory([]);
      setFormattedDeviceHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleDeviceSelect = (device: Derivador) => {
    setSelectedDevice(device);
    loadDeviceHistory(device.device_id);
    setDeviceListVisible(false);
  };

  const openHistoryPopup = () => {
    if (selectedDevice) {
      loadDeviceHistory(selectedDevice.device_id);
      setPopupVisible(true);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { minHeight: windowDimensions.height },
      ]}
      showsVerticalScrollIndicator
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {selectedDevice
            ? `Dispositivo: ${selectedDevice.device_id}`
            : "Nenhum selecionado"}
        </Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setDeviceListVisible(true)}
        >
          <Text style={styles.selectButtonText}>Selecionar dispositivo</Text>
        </TouchableOpacity>
      </View>

      {selectedDevice && (
        <View style={styles.deviceInfoContainer}>
          <Text style={styles.deviceInfoText}>
            Última atualização:{" "}
            {new Date(selectedDevice.timestamp || "").toLocaleString()}
          </Text>
        </View>
      )}

      {selectedDevice && (
        <View style={styles.chartContainer}>
          {isLoadingHistory ? (
            <Text>Carregando gráfico...</Text>
          ) : formattedDeviceHistory.length === 0 ? (
            <Text>Nenhum dado para exibir</Text>
          ) : (
            <MovementChart
              velocityData={formattedDeviceHistory}
              history={rawDeviceHistory}
              deviceId={selectedDevice.device_id}
            />
          )}
        </View>
      )}

      <View style={styles.buttonGrid}>
        <View style={styles.infoButton}>
          <Text style={styles.buttonValue}>{derivadores.length}</Text>
          <Text style={styles.buttonLabel}>Qtd dispositivos</Text>
        </View>
        <View style={styles.infoButton}>
          <Text style={styles.buttonValue}>{totalMovements}</Text>
          <Text style={styles.buttonLabel}>Movimentações</Text>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={deviceListVisible}
        onRequestClose={() => setDeviceListVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.deviceListPopup}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Selecionar Dispositivo</Text>
              <TouchableOpacity onPress={() => setDeviceListVisible(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.deviceList}>
              {derivadores.length > 0 ? (
                derivadores.map((device, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.deviceItem}
                    onPress={() => handleDeviceSelect(device)}
                  >
                    <Text style={styles.deviceItemText}>{device.device_id}</Text>
                    <Text style={styles.deviceItemSubText}>
                      Última atualização:{" "}
                      {new Date(device.timestamp || "").toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noDeviceText}>
                  Nenhum dispositivo disponível
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <DeviceHistoryPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        history={rawDeviceHistory}
        deviceId={selectedDevice?.device_id || ""}
        selectedLocation={selectedLocation}
        onSelectLocation={loc => setSelectedLocation(loc)}
      />

      <NavBar
        onPressHome={() => navigation.navigate("Home")}
        onPressDashboard={() => navigation.navigate("Dashboard")}
        onPressProfile={() => navigation.navigate("Profile")}
        selected="dashboard"
      />
    </ScrollView>
  );
};

const barHeight = Platform.select({ ios: 54, android: 54, web: 60, default: 54 });
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
  },
  header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: { fontSize: 16, color: "#fff" },
  selectButton: {
  paddingVertical: 6,
  paddingHorizontal: 8, // Reduz o padding horizontal para evitar overflow
  backgroundColor: "#fff",
  borderRadius: 8,
  alignItems: "center",
  maxWidth: "40%", // Limita a largura máxima para caber na tela
  flexShrink: 1, // Permite que o botão encolha se necessário
},
  selectButtonText: { fontSize: 14, color: "#041635", fontWeight: "500" },
  deviceInfoContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    // sombra
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 2 },
      android: { elevation: 2 },
    }),
  },
  deviceInfoText: { fontSize: 14, color: "#000" },
  noDeviceText: { color: "#fff", fontSize: 16, marginBottom: 20 },
  chartContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 2 },
      android: { elevation: 2 },
    }),
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    width: "90%",
  },
  infoButton: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    minWidth: "45%",
  },
  buttonValue: { fontSize: 22, fontWeight: "bold", color: "#000" },
  buttonLabel: { fontSize: 12, color: "#333" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  deviceListPopup: {
    width: Platform.select({ web: Math.min(width * 0.9, 800), native: width * 0.95 }),
    maxHeight: Platform.select({ web: 600, native: Dimensions.get("window").height * 0.8 }),
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalHeaderText: { fontSize: 18, fontWeight: "bold", color: "#000" },
  deviceList: { maxHeight: Dimensions.get("window").height * 0.6 },
  deviceItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  deviceItemText: { fontSize: 16, fontWeight: "bold", color: "#000" },
  deviceItemSubText: { fontSize: 12, color: "#666" },
});

export default DashboardScreen;
