import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Derivador, fetchDerivadores } from "../service/deviceService";
import MovementChart from "../components/MovementChart";
import DeviceHistoryPopup from "../components/DeviceHistoryPopup";

// Usar 'any' para evitar conflitos de tipagem com Icon
const Icon: any = MaterialCommunityIcons;

const { width } = Dimensions.get("window");

// Definição do tipo para as rotas
type RootStackParamList = {
  Home: undefined;
  Dashboard: { device?: Derivador };
};

// Tipagem para navigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Definição do tipo para route
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
  const [popupVisible, setPopupVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    fetchDerivadores().then(setDerivadores).catch(console.error);
  }, []);

  const handleDeviceSelect = (device: Derivador) => {
    setSelectedDevice(device);
    setPopupVisible(false);
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

      {/* Gráfico somente se um dispositivo estiver selecionado */}
      {selectedDevice && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>MOVIMENTAÇÕES / DIA</Text>
          <MovementChart deviceId={selectedDevice.device_id} />
        </View>
      )}

      {/* Botões */}
      <View style={styles.buttonGrid}>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setPopupVisible(true)}
        >
          <Text style={styles.buttonValue}>{derivadores.length}</Text>
          <Text style={styles.buttonLabel}>Qtd dispositivos</Text>
        </TouchableOpacity>

        <View style={styles.infoButton}>
          <Text style={styles.buttonValue}>10</Text>
          <Text style={styles.buttonLabel}>Movimentações</Text>
        </View>

        <View style={styles.infoButton}>
          <Text style={styles.buttonValue}>0</Text>
          <Text style={styles.buttonLabel}>Emergências</Text>
        </View>

        <View style={styles.infoButton} />
      </View>

      {/* Popup de dispositivos */}
      <DeviceHistoryPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        history={[]}
        deviceId=""
        selectedLocation={null}
        onSelectLocation={() => {}}
        customList={derivadores}
        onDeviceSelect={handleDeviceSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#041635",
    paddingTop: Platform.select({ ios: 50, android: 40, default: 30 }),
    alignItems: "center",
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
});

export default DashboardScreen;