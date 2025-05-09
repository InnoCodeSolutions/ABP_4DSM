import React from 'react';
import { View, Text, Modal, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomMapView from '../components/MapView'; // Corrigindo a importação
import { Derivador } from '../service/deviceService';
const { width, height } = Dimensions.get('window');

interface DeviceHistoryPopupProps {
  visible: boolean;
  onClose: () => void;
  history: Derivador[];
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
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.popup}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Histórico de {deviceId}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollContainer}>
            {history.map((entry, index) => (
              <View key={index} style={styles.historyEntry}>
                <Text style={styles.entryText}>Data: {new Date(entry.timestamp || '').toLocaleString()}</Text>
                <Text style={styles.entryText}>Latitude: {entry.latitude?.toFixed(6) || 'N/A'}</Text>
                <Text style={styles.entryText}>Longitude: {entry.longitude?.toFixed(6) || 'N/A'}</Text>
                <Text style={styles.entryText}>Altitude: {entry.altitude ?? 'N/A'}</Text>
                <Text style={styles.entryText}>Velocidade: {entry.speed ?? 'N/A'}</Text>
                <Text style={styles.entryText}>Curso: {entry.course ?? 'N/A'}</Text>
                <Text style={styles.entryText}>Satélites: {entry.satellites ?? 'N/A'}</Text>
                <Text style={styles.entryText}>HDOP: {entry.hdop ?? 'N/A'}</Text>
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={() => onSelectLocation({ latitude: entry.latitude || 0, longitude: entry.longitude || 0 })}
                >
                  <Text style={styles.mapButtonText}>Ver no Mapa</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          {selectedLocation && (
            <View style={styles.mapContainer}>
              <CustomMapView
                initialRegion={{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                markers={[{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                  title: deviceId,
                }]}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 5,
  },
  scrollContainer: {
    maxHeight: height * 0.4,
  },
  historyEntry: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  entryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  mapButton: {
    backgroundColor: '#041635',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  mapContainer: {
    height: 200,
    marginTop: 10,
  },
});

export default DeviceHistoryPopup;
