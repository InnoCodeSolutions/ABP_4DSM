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
import CustomMapView from "../components/MapView";
import { Derivador } from "../service/deviceService";

// Usar 'any' temporariamente para evitar conflitos de tipagem
const Icon: any = MaterialCommunityIcons;

const { width, height } = Dimensions.get("window");

interface DeviceHistoryPopupProps {
  visible: boolean;
  onClose: () => void;
  history?: Derivador[]; // opcional para manter compatibilidade
  customList: Derivador[]; // novo
  deviceId: string;
  selectedLocation: { latitude: number; longitude: number } | null;
  onSelectLocation: (location: { latitude: number; longitude: number }) => void;
  onDeviceSelect: (device: Derivador) => void; // novo
}

const DeviceHistoryPopup: React.FC<DeviceHistoryPopupProps> = ({
  visible,
  onClose,
  history,
  customList,
  deviceId,
  selectedLocation,
  onSelectLocation,
  onDeviceSelect,
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
            <Text style={styles.headerText}>Dispositivos</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Lista de dispositivos recebida via customList */}
          <ScrollView
            style={[
              styles.scrollContainer,
              isMapMaximized && styles.scrollContainerMaximized,
            ]}
          >
            {customList && customList.length > 0 ? (
              customList.map((device, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.historyEntry}
                  onPress={() => onDeviceSelect(device)}
                >
                  <Text style={styles.entryText}>ID: {device.device_id}</Text>
                  <Text style={styles.entryText}>
                    Última Latitude: {device.latitude?.toFixed(6) || "N/A"}
                  </Text>
                  <Text style={styles.entryText}>
                    Última Longitude: {device.longitude?.toFixed(6) || "N/A"}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.entryText}>
                Nenhum dispositivo disponível.
              </Text>
            )}
          </ScrollView>

          {/* Mapa */}
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
                onPress={
                  isMapMaximized ? closeFullScreenMap : openFullScreenMap
                }
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

      {/* Fullscreen map */}
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