import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackParamList } from "../types/types";
import {
  Derivador,
  fetchDerivadores,
  fetchDeviceMovement,
} from "../service/deviceService";
import DeviceHistoryPopup from "../components/DeviceHistoryPopup";
import NavBar from "../components/Navbar";
import { IconProps } from "react-native-vector-icons/Icon";
import { ComponentType } from "react";

const Icon: ComponentType<IconProps> = MaterialCommunityIcons as any;

type ViewDeviceNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ViewDevice"
>;

const barHeight = Platform.select({
  ios: 54,
  android: 54,
  web: 60,
  default: 54,
});

const ViewDevice: React.FC = () => {
  const navigation = useNavigation<ViewDeviceNavigationProp>();
  const [derivadores, setDerivadores] = useState<Derivador[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState(
    Dimensions.get("window")
  );

  // Handle orientation changes
  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions(Dimensions.get("window"));
    };

    const subscription = Dimensions.addEventListener(
      "change",
      updateDimensions
    );
    return () => subscription?.remove();
  }, []);

  const loadDerivadores = async () => {
    try {
      const data = await fetchDerivadores();
      setDerivadores(data.length > 0 ? data : []);
    } catch (error) {
      console.error("Erro ao buscar derivadores:", error);
    }
  };

  const loadDeviceHistory = async (deviceId: string) => {
    try {
      setIsLoadingHistory(true);
      console.log("Fetching movement for deviceId:", deviceId);
      const { movement } = await fetchDeviceMovement(deviceId);
      console.log("Device Movement Response:", movement);
      setSelectedDevice(deviceId);
    } catch (error) {
      console.error("Erro ao buscar movimento:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadDerivadores();
    const interval = setInterval(loadDerivadores, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { minHeight: windowDimensions.height },
      ]}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.deviceContainer}>
        {derivadores.map((derivador, index) => (
          <TouchableOpacity
            key={index}
            style={styles.deviceButton}
            onPress={() => loadDeviceHistory(derivador.device_id)}
          >
            <View style={styles.deviceRow}>
              <Image
                source={require("../assets/derivador-1.png")}
                style={styles.deviceIcon}
                resizeMode="contain"
              />
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceTitle}>{derivador.device_id}</Text>
                <Text style={styles.deviceLocation}>
                  Lat: {derivador.latitude?.toFixed(6) || "N/A"}
                </Text>
                <Text style={styles.deviceLocation}>
                  Long: {derivador.longitude?.toFixed(6) || "N/A"}
                </Text>
                <Text
                  style={styles.deviceStatus}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Última atualização:{" "}
                  {new Date(derivador.timestamp || "").toLocaleString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <DeviceHistoryPopup
        visible={!!selectedDevice}
        onClose={() => {
          setSelectedDevice(null);
          setSelectedLocation(null);
        }}
        deviceId={selectedDevice || ""}
        selectedLocation={selectedLocation}
        onSelectLocation={(location) => setSelectedLocation(location)}
        isLoading={isLoadingHistory}
        history={[]}
      />

      <NavBar
        onPressHome={() => navigation.navigate("Home")}
        onPressDashboard={() => navigation.navigate("Dashboard")}
        onPressProfile={() => navigation.navigate("Profile")}
        selected=""
      />
    </ScrollView>
  );
};

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
  deviceContainer: {
    width: "90%",
    maxWidth: 800,
    marginTop: 20,
    gap: 10,
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
});

export default ViewDevice;
