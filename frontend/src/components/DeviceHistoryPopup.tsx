import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CustomMapView from "./MapView";
import { Derivador } from "../service/deviceService";

// Tipagem explícita para MaterialCommunityIcons
import { IconProps } from "react-native-vector-icons/Icon";
import { ComponentType } from "react";

const Icon: ComponentType<IconProps> = MaterialCommunityIcons as any; // Contorna erro de tipagem

const { width, height } = Dimensions.get("window");

interface DeviceHistoryPopupProps {
  visible: boolean;
  onClose: () => void;
  history: Derivador[] | undefined;
  deviceId: string;
  selectedLocation: { latitude: number; longitude: number } | null;
  onSelectLocation: (location: { latitude: number; longitude: number }) => void;
}

const DeviceHistoryPopup: React.FC<DeviceHistoryPopupProps> = ({
  visible,
  onClose,
  history,
  deviceId,
  selectedLocation,
  onSelectLocation,
}) => {
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  const [isFullScreenMap, setIsFullScreenMap] = useState(false);

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

  const mapHeight = isMapMaximized
    ? Platform.select({ web: 600, native: height * 0.95 })
    : Platform.select({ web: 300, native: 200 });

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
            <Text style={styles.headerText}>Histórico de {deviceId}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={[
              styles.scrollContainer,
              isMapMaximized && styles.scrollContainerMaximized,
            ]}
          >
            {history && history.length > 0 ? (
              history.map((entry, index) => (
                <View key={index} style={styles.historyEntry}>
                  <Text style={styles.entryText}>
                    Data: {new Date(entry.timestamp || '').toLocaleString()}
                  </Text>
                  <Text style={styles.entryText}>
                    Latitude: {entry.latitude?.toFixed(6) || 'N/A'}
                  </Text>
                  <Text style={styles.entryText}>
                    Longitude: {entry.longitude?.toFixed(6) || 'N/A'}
                  </Text>
                  <Text style={styles.entryText}>
                    Altitude: {entry.altitude ?? 'N/A'}
                  </Text>
                  <Text style={styles.entryText}>
                    Velocidade: {entry.speed ?? 'N/A'}
                  </Text>
                  <Text style={styles.entryText}>
                    Curso: {entry.course ?? 'N/A'}
                  </Text>
                  <Text style={styles.entryText}>
                    Satélites: {entry.satellites ?? 'N/A'}
                  </Text>
                  <Text style={styles.entryText}>
                    HDOP: {entry.hdop ?? 'N/A'}
                  </Text>
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() =>
                      onSelectLocation({
                        latitude: entry.latitude || 0,
                        longitude: entry.longitude || 0,
                      })
                    }
                  >
                    <Text style={styles.mapButtonText}>Ver no Mapa</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.entryText}>Nenhum histórico disponível.</Text>
            )}
          </ScrollView>

          {selectedLocation && (
            <View style={[styles.mapContainer, { height: mapHeight }]}>
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
    maxHeight: height * 0.8,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  popupMaximized: {
    width: Platform.select({
      web: Math.min(width * 0.9, 800),
      native: width * 0.98,
    }),
    maxHeight: height * 0.98,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    padding: 5,
  },
  scrollContainer: {
    maxHeight: height * 0.4,
  },
  scrollContainerMaximized: {
    maxHeight: height * 0.2,
  },
  historyEntry: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  entryText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  mapButton: {
    backgroundColor: "#041635",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  mapContainer: {
    marginTop: 10,
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