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

type DashboardRouteProp = {
  params: { device?: Derivador } | undefined;
};

type Props = {
  route: DashboardRouteProp;
};

const DashboardScreen: React.FC<Props> = ({ route }) => {
  const [derivadores, setDerivadores] = useState<Derivador[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Derivador | null>(
    route.params?.device || null
  );
  const [deviceHistory, setDeviceHistory] = useState<Derivador[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [deviceListVisible, setDeviceListVisible] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  // Carrega a lista de dispositivos
  useEffect(() => {
    const loadDerivadores = async () => {
      try {
        const data = await fetchDerivadores();
        setDerivadores(data.length > 0 ? data : []);
      } catch (error) {
        console.error("Erro ao buscar derivadores:", error);
      }
    };
    loadDerivadores();
  }, []);

  // Carrega o histórico do dispositivo selecionado
  const loadDeviceHistory = async (deviceId: string) => {
    try {
      setIsLoadingHistory(true);
      const history = await fetchDeviceHistory(deviceId);
      setDeviceHistory(Array.isArray(history) ? history : []);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      setDeviceHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Lógica para selecionar um dispositivo
  const handleDeviceSelect = (device: Derivador) => {
    setSelectedDevice(device);
    loadDeviceHistory(device.device_id);
    setDeviceListVisible(false);
  };

  // Abre o modal de histórico
  const openHistoryPopup = () => {
    if (selectedDevice) {
      loadDeviceHistory(selectedDevice.device_id);
      setPopupVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon name="home" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Informações do dispositivo selecionado */}
      {selectedDevice ? (
        <View style={styles.deviceInfoContainer}>
          <Text style={styles.deviceInfoText}>Dispositivo: {selectedDevice.device_id}</Text>
          <Text style={styles.deviceInfoText}>
            Última atualização: {new Date(selectedDevice.timestamp || '').toLocaleString()}
          </Text>
        </View>
      ) : (
        <Text style={styles.noDeviceText}>Nenhum dispositivo selecionado</Text>
      )}

      {/* Gráfico somente se um dispositivo estiver selecionado */}
      {selectedDevice && (
        <View style={styles.chartContainer}>
          //<Text style={styles.chartTitle}>MOVIMENTAÇÕES / DIA</Text>
          <MovementChart deviceId={selectedDevice.device_id} />
        </View>
      )}

      {/* Botões */}
      <View style={styles.buttonGrid}>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setDeviceListVisible(true)}
        >
          <Text style={styles.buttonValue}>{derivadores.length}</Text>
          <Text style={styles.buttonLabel}>Qtd dispositivos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.infoButton}
          onPress={openHistoryPopup}
          disabled={!selectedDevice}
        >
          <Text style={styles.buttonValue}>
            {selectedDevice ? deviceHistory.length : 0}
          </Text>
          <Text style={styles.buttonLabel}>Movimentações</Text>
        </TouchableOpacity>

        <View style={styles.infoButton}>
          <Text style={styles.buttonValue}>0</Text>
          <Text style={styles.buttonLabel}>Emergências</Text>
        </View>

        <View style={styles.infoButton} />
      </View>

      {/* Modal para lista de dispositivos */}
      <Modal
        animationType="slide"
        transparent={true}
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
                derivadores.map((device, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.deviceItem}
                    onPress={() => handleDeviceSelect(device)}
                  >
                    <Text style={styles.deviceItemText}>{device.device_id}</Text>
                    <Text style={styles.deviceItemSubText}>
                      Última atualização: {new Date(device.timestamp || '').toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noDeviceText}>Nenhum dispositivo disponível</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Popup de histórico */}
      <DeviceHistoryPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        history={deviceHistory}
        deviceId={selectedDevice?.device_id || ""}
        selectedLocation={selectedLocation}
        onSelectLocation={(location) => setSelectedLocation(location)}
      />
      <NavBar
        onPressHome={() => navigation.navigate("Home")}
        onPressDashboard={() => navigation.navigate("Dashboard")}
        onPressProfile={() => navigation.navigate("Profile")}
        selected="dashboard"
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
    paddingTop: Platform.select({ ios: 50, android: 40, default: 30 }),
    alignItems: "center",
    paddingBottom: barHeight,
  },
  header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  deviceInfoContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  deviceInfoText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 5,
  },
  noDeviceText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "90%",
    padding: 10,
    marginBottom: 20,
  },
  chartTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    width: "90%",
  },
  infoButton: {
    width: "45%",
    backgroundColor: "#eee",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  buttonLabel: {
    fontSize: 12,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  deviceList: {
    maxHeight: Platform.select({ web: 500, native: Dimensions.get("window").height * 0.6 }),
  },
  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  deviceItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  deviceItemSubText: {
    fontSize: 12,
    color: "#666",
  },
});

export default DashboardScreen;