import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ViewStyle,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CustomMapView from "./MapView";
import { GeoJSONRoute, Derivador, fetchDeviceMovement } from "../service/deviceService";
import { IconProps } from "react-native-vector-icons/Icon";
import { ComponentType } from "react";

const Icon: ComponentType<IconProps> = MaterialCommunityIcons as any;

const { width, height } = Dimensions.get("window");

interface DeviceHistoryPopupProps {
  visible: boolean;
  onClose: () => void;
  route?: GeoJSONRoute | null;
  deviceId: string;
  selectedLocation: { latitude: number; longitude: number } | null;
  onSelectLocation: (location: { latitude: number; longitude: number }) => void;
  isLoading?: boolean;
}

const DeviceHistoryPopup: React.FC<DeviceHistoryPopupProps> = ({
  visible,
  onClose,
  route,
  deviceId,
  selectedLocation,
  onSelectLocation,
  isLoading = false,
}) => {
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  const [isFullScreenMap, setIsFullScreenMap] = useState(false);
  const [history, setHistory] = useState<Derivador[]>([]);
  const [averageSpeed, setAverageSpeed] = useState<number | null>(null);

  const toggleMapSize = () => {
    if (!isFullScreenMap) {
      setIsMapMaximized((prev) => !prev);
    }
  };

  const openFullScreenMap = () => {
    setIsFullScreenMap(true);
  };

  const closeFullScreenMap = () => {
    setIsFullScreenMap(false);
    setIsMapMaximized(false);
  };

  const mapHeight: ViewStyle = {
    height: isMapMaximized
      ? Platform.select({ web: 600, native: height * 0.95 })
      : Platform.select({ web: 300, native: 200 }),
  };

  // Fetch movement data when deviceId changes
  useEffect(() => {
    if (deviceId && visible) {
      const loadMovementData = async () => {
        try {
          const data = await fetchDeviceMovement(deviceId);
          setHistory(data.movement || []);
          setAverageSpeed(data.averageSpeedKmh || null);
        } catch (error) {
          console.error("Error loading movement data:", error);
          setHistory([]);
          setAverageSpeed(null);
        }
      };
      loadMovementData();
    }
  }, [deviceId, visible]);

  // Calculate total distance
  const totalDistance = history
    .reduce((sum, entry) => sum + (entry.distance || 0), 0)
    .toFixed(2);

  const routeCoordinates =
    route &&
    Array.isArray(route.features) &&
    route.features[0]?.geometry.coordinates
      ? route.features[0].geometry.coordinates.map(([lng, lat], index) => ({
          latitude: lat,
          longitude: lng,
          timestamp: route.features[0].properties?.timestamps?.[index]
            ? new Date(
                route.features[0].properties.timestamps[index]
              ).toLocaleString("pt-BR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })
            : "N/A",
        }))
      : [];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.popup, isMapMaximized && styles.popupMaximized]}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {history.length > 0
                ? `Histórico de ${deviceId}`
                : `Rota de ${deviceId}`}
            </Text>
            <Text style={styles.headerText}>
              Distância Total: {totalDistance ? `${totalDistance} m` : "N/A"}
            </Text>
            <Text style={styles.headerText}>
              Velocidade Média: {averageSpeed != null ? `${averageSpeed.toFixed(2)} km/h` : "N/A"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={[
              styles.scrollContainer,
              isMapMaximized && styles.scrollContainerMaximized,
            ]}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            {...(Platform.OS === "web" ? { dataSet: { scrollview: "true" } } : {})}
          >
            {isLoading ? (
              <Text style={styles.entryText}>Carregando...</Text>
            ) : history.length > 0 ? (
              history.map((entry, index) => (
                <View key={index} style={styles.historyEntry}>
                  <Text style={styles.entryText}>
                    Data:{" "}
                    {entry.timestamp
                      ? new Date(entry.timestamp).toLocaleString("pt-BR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })
                      : "N/A"}
                  </Text>
                  <Text style={styles.entryText}>
                    Latitude: {entry.latitude?.toFixed(6) || "N/A"}
                  </Text>
                  <Text style={styles.entryText}>
                    Longitude: {entry.longitude?.toFixed(6) || "N/A"}
                  </Text>
                  <Text style={styles.entryText}>
                    Distância: {entry.distance != null ? entry.distance.toFixed(2) : "N/A"} m
                  </Text>
                  <Text style={styles.entryText}>
                    Velocidade: {entry.speed != null ? entry.speed.toFixed(2) : "N/A"} km/h
                  </Text>
                  <Text style={styles.entryText}>
                    Altitude: {entry.altitude != null ? entry.altitude : "N/A"}
                  </Text>
                  <Text style={styles.entryText}>
                    Curso: {entry.course != null ? entry.course : "N/A"}
                  </Text>
                  <Text style={styles.entryText}>
                    Satélites: {entry.satellites != null ? entry.satellites : "N/A"}
                  </Text>
                  <Text style={styles.entryText}>
                    HDOP: {entry.hdop != null ? entry.hdop : "N/A"}
                  </Text>
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() =>
                      entry.latitude != null && entry.longitude != null
                        ? onSelectLocation({
                            latitude: entry.latitude,
                            longitude: entry.longitude,
                          })
                        : null
                    }
                    disabled={entry.latitude == null || entry.longitude == null}
                  >
                    <Text style={styles.mapButtonText}>Ver no Mapa</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : routeCoordinates.length > 0 ? (
              routeCoordinates.map((coord, index) => (
                <View key={index} style={styles.historyEntry}>
                  <Text style={styles.entryText}>
                    Data: {coord.timestamp || "N/A"}
                  </Text>
                  <Text style={styles.entryText}>
                    Latitude: {coord.latitude.toFixed(6) || "N/A"}
                  </Text>
                  <Text style={styles.entryText}>
                    Longitude: {coord.longitude.toFixed(6) || "N/A"}
                  </Text>
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() =>
                      onSelectLocation({
                        latitude: coord.latitude,
                        longitude: coord.longitude,
                      })
                    }
                  >
                    <Text style={styles.mapButtonText}>Ver no Mapa</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.entryText}>
                {history
                  ? "Nenhum histórico disponível."
                  : "Nenhuma rota disponível."}
              </Text>
            )}
          </ScrollView>

          {selectedLocation && (
            <View style={[styles.mapContainer, mapHeight]}>
              <CustomMapView
                initialRegion={{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                markers={[
                  {
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                    title: deviceId,
                  },
                ]}
                route={route}
                style={styles.map}
              />
              <TouchableOpacity
                style={styles.maximizeButton}
                onPress={isMapMaximized ? closeFullScreenMap : openFullScreenMap}
              >
                <Icon
                  name={isMapMaximized ? "fullscreen-exit" : "fullscreen"}
                  size={32}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={false}
        visible={isFullScreenMap}
        onRequestClose={closeFullScreenMap}
      >
        <View style={styles.fullScreenContainer}>
          <CustomMapView
            initialRegion={{
              latitude: selectedLocation?.latitude || 0,
              longitude: selectedLocation?.longitude || 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            markers={
              selectedLocation
                ? [
                    {
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                      title: deviceId,
                    },
                  ]
                : []
            }
            route={route}
            style={styles.fullScreenMap}
          />
          <TouchableOpacity
            style={styles.fullScreenCloseButton}
            onPress={closeFullScreenMap}
          >
            <Icon name="close" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    width: Platform.select({
      web: Math.min(width * 0.9, 800),
      native: width * 0.95,
    }),
    maxHeight: Platform.select({
      web: height * 0.8,
      native: height * 0.9,
    }),
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: Platform.select({ web: 10, native: 5 }),
  },
  popupMaximized: {
    width: Platform.select({
      web: Math.min(width * 0.9, 800),
      native: width * 0.98,
    }),
    maxHeight: Platform.select({
      web: height * 0.98,
      native: height * 0.98,
    }),
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: Platform.select({ web: 10, native: 5 }),
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: Platform.select({ web: 18, native: 14 }),
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  closeButton: {
    padding: Platform.select({ web: 5, native: 2 }),
    position: "absolute",
    top: 5,
    right: 5,
  },
  scrollContainer: {
    maxHeight: Platform.select({
      web: height * 0.4,
      native: height * 0.5,
    }),
    ...(Platform.OS === "web" ? { overflowY: "auto", WebkitOverflowScrolling: "touch" } : {}),
  },
  scrollContainerMaximized: {
    maxHeight: Platform.select({
      web: height * 0.2,
      native: height * 0.3,
    }),
  },
  scrollContent: {
    paddingBottom: Platform.select({ web: 10, native: 5 }),
  },
  historyEntry: {
    padding: Platform.select({ web: 10, native: 5 }),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  entryText: {
    fontSize: Platform.select({ web: 14, native: 12 }),
    color: "#333",
    marginBottom: Platform.select({ web: 5, native: 2 }),
  },
  mapButton: {
    backgroundColor: "#041635",
    padding: Platform.select({ web: 8, native: 4 }),
    borderRadius: 5,
    alignItems: "center",
    marginTop: Platform.select({ web: 5, native: 2 }),
  },
  mapButtonText: {
    color: "#fff",
    fontSize: Platform.select({ web: 14, native: 12 }),
  },
  mapContainer: {
    marginTop: Platform.select({ web: 10, native: 5 }),
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  maximizeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: 20,
    padding: 12,
    zIndex: 1000,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullScreenMap: {
    flex: 1,
  },
  fullScreenCloseButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 20,
    padding: 10,
    zIndex: 1000,
  },
});

export default DeviceHistoryPopup;