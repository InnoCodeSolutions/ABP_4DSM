import React, { useState, useEffect, Component } from "react";
import { View, StyleSheet, Dimensions, Platform, TouchableOpacity, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomMapView from "../components/MapView";
import NavBar from "../components/Navbar";
import DeviceHistoryPopup from "../components/DeviceHistoryPopup";
import RouteSelectorPopup from "../components/RouteSelectorPopup";
import { Derivador, fetchDerivadores, fetchDeviceRoute, GeoJSONRoute } from "../service/deviceService";
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Define navigation types
type RootStackParamList = {
  Home: undefined;
  Dashboard: undefined;
  Profile: undefined;
  Map: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { height } = Dimensions.get("window");

// Error Boundary Component
class MapScreenErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar o mapa. Tente novamente.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const MapScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [derivadores, setDerivadores] = useState<Derivador[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [deviceRoute, setDeviceRoute] = useState<GeoJSONRoute | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showRouteSelector, setShowRouteSelector] = useState(false);

  // Removido fallbackMarkers para evitar Rio de Janeiro como padrão
  // const fallbackMarkers = [
  //   { latitude: -22.9068, longitude: -43.1729, title: "Rio de Janeiro" },
  // ];

  // Fetch devices and load default route
  useEffect(() => {
    const loadDerivadores = async () => {
      try {
        const data = await fetchDerivadores();
        console.log("MapScreen: Fetched derivadores:", JSON.stringify(data, null, 2));
        const validDerivadores = data.filter(d => d.latitude !== 0 && d.longitude !== 0);
        setDerivadores(validDerivadores.length > 0 ? validDerivadores : []);
        // Load route for the first valid device if no route exists
        if (validDerivadores.length > 0 && !deviceRoute) {
          console.log("MapScreen: Loading default route for device:", validDerivadores[0].device_id);
          loadDeviceRoute(validDerivadores[0].device_id);
        } else if (validDerivadores.length === 0) {
          console.warn("MapScreen: No valid derivadores found, map will use initial region (Jacareí).");
        }
      } catch (error) {
        console.error("MapScreen: Error fetching derivadores:", error);
        setDerivadores([]);
      }
    };
    loadDerivadores();
    const interval = setInterval(loadDerivadores, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, []);

  // Fetch device route with optional time range and maritime flag
  const loadDeviceRoute = async (deviceId: string, timeRange?: string, isMaritime: boolean = false) => {
    try {
      setIsLoadingRoute(true);
      console.log("MapScreen: Fetching route for deviceId:", deviceId, { timeRange, isMaritime });
      const route = await fetchDeviceRoute(deviceId, timeRange, isMaritime);
      console.log("MapScreen: Fetched route coordinates:", route?.features?.[0]?.geometry?.coordinates || "No coordinates");
      setDeviceRoute(route);
      setSelectedDevice(deviceId);
    } catch (error) {
      console.error("MapScreen: Error fetching route:", error);
      setDeviceRoute(null);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Map derivadores to markers, use empty array if no valid devices
  const markers = derivadores.length > 0
    ? derivadores
        .filter(device => device.latitude !== 0 && device.longitude !== 0)
        .map(device => ({
          latitude: device.latitude || 0,
          longitude: device.longitude || 0,
          title: device.device_id,
        }))
    : [];

  console.log("MapScreen: Rendering with deviceRoute:", deviceRoute, "markers:", markers);

  return (
    <MapScreenErrorBoundary>
      <View style={styles.container}>
        <CustomMapView
          markers={markers}
          style={styles.map}
          onMarkerPress={(deviceId: string) => loadDeviceRoute(deviceId)} // Default: no time filter
          route={deviceRoute ?? undefined}
        />
        <TouchableOpacity
          style={styles.routeSelectorButton}
          onPress={() => setShowRouteSelector(true)}
        >
          <MaterialCommunityIcons name="calendar-clock" size={24} color="#fff" />
          <Text style={styles.routeSelectorText}>Selecionar Rota</Text>
        </TouchableOpacity>
        <RouteSelectorPopup
          visible={showRouteSelector}
          onClose={() => setShowRouteSelector(false)}
          devices={derivadores}
          onSelectRoute={(deviceId, timeRange, isMaritime) => {
            console.log("MapScreen: Selected route:", { deviceId, timeRange, isMaritime });
            loadDeviceRoute(deviceId, timeRange, isMaritime);
            setShowRouteSelector(false);
          }}
        />
        <DeviceHistoryPopup
          visible={!!selectedDevice}
          onClose={() => {
            console.log("MapScreen: Closing history popup");
            setSelectedDevice(null);
            setDeviceRoute(null);
            setSelectedLocation(null);
          }}
          route={deviceRoute}
          deviceId={selectedDevice || ''}
          selectedLocation={selectedLocation}
          onSelectLocation={(location) => {
            console.log("MapScreen: Selected location:", location);
            setSelectedLocation(location);
          }}
          isLoading={isLoadingRoute}
        />
        <NavBar
          onPressHome={() => navigation.navigate("Home")}
          onPressDashboard={() => navigation.navigate("Dashboard")}
          onPressProfile={() => navigation.navigate("Profile")}
          selected=""
        />
      </View>
    </MapScreenErrorBoundary>
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
  routeSelectorButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    padding: 10,
    borderRadius: 8,
    zIndex: 1000,
  },
  routeSelectorText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#041635',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default MapScreen;