import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Dimensions,
  FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { fetchDerivadores, fetchDeviceHistoryForReport } from '../service/deviceService';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IconProps } from 'react-native-vector-icons/Icon';
import { ComponentType } from 'react';
import NavBar from '../components/Navbar';

type RootStackParamList = {
  Home: undefined;
  Reports: undefined;
  Dashboard: undefined;
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Icon: ComponentType<IconProps> = MaterialCommunityIcons as any;

interface DeviceData {
  device_id: string;
  latitude?: number;
  longitude?: number;
  timestamp?: string;
}

const ReportsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const derivadores = await fetchDerivadores();
        setDevices(derivadores);
      } catch (error: any) {
        console.error('Erro ao carregar dispositivos:', error);
        Alert.alert('Erro', 'Falha ao carregar dispositivos do banco de dados');
      }
    };
    loadDevices();
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  // Custom wheel event listener for web scrolling
  useEffect(() => {
    if (Platform.OS === "web") {
      const handleWheel = (event: WheelEvent) => {
        const flatList = document.querySelector(".reports-flatlist");
        if (flatList && flatList.contains(event.target as Node)) {
          // Allow scrolling within FlatList
        } else {
          event.preventDefault();
        }
      };
      window.addEventListener("wheel", handleWheel, { passive: false });
      return () => window.removeEventListener("wheel", handleWheel);
    }
  }, []);

  const openExportModal = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setModalVisible(true);
  };

  const generateReport = async (deviceId: string, format: 'csv' | 'pdf') => {
    try {
      const data = await fetchDeviceHistoryForReport(deviceId);
      if (format === 'csv') {
        await generateCSV(data, deviceId);
      } else {
        await generatePDF(data, deviceId);
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Falha ao gerar o relatório: ' + error.message);
    }
  };

  const generateCSV = async (data: any[], deviceId: string) => {
    const csv = Papa.unparse(data.map(item => ({
      device_id: item.device_id,
      latitude: item.latitude,
      longitude: item.longitude,
      timestamp: item.timestamp,
    })));
    const fileName = `relatorio-${deviceId}-${new Date().toISOString()}.csv`;

    if (Platform.OS === 'web') {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } else {
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Salvar ou compartilhar relatório CSV',
        });
      } else {
        Alert.alert('Sucesso', `CSV salvo em: ${fileUri}`);
      }
    }
  };

  const generatePDF = async (data: any[], deviceId: string) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Relatório do Dispositivo ${deviceId}`, 10, 10);
      doc.setFontSize(12);
      doc.text('Dispositivo | Latitude | Longitude | Data/Hora', 10, 20);

      let yPosition = 30;
      data.forEach((item, index) => {
        const row = `${item.device_id} | ${item.latitude || 'N/A'} | ${item.longitude || 'N/A'} | ${item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}`;
        doc.text(row, 10, yPosition);
        yPosition += 10;
        if (yPosition > 270 && index < data.length - 1) {
          doc.addPage();
          yPosition = 10;
        }
      });

      if (Platform.OS === 'web') {
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `relatorio-${deviceId}-${new Date().toISOString()}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const pdfBase64 = doc.output('datauristring').split(',')[1];
        const fileName = `relatorio-${deviceId}-${new Date().toISOString()}.pdf`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Salvar ou compartilhar relatório PDF',
          });
        } else {
          Alert.alert('Sucesso', `PDF salvo em: ${fileUri}`);
        }
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Falha ao gerar PDF: ' + error.message);
    }
  };

  const renderDeviceItem = ({ item }: { item: DeviceData }) => (
    <TouchableOpacity
      style={styles.deviceCard}
      onPress={() => openExportModal(item.device_id)}
      key={item.device_id}
    >
      <Text style={styles.deviceId}>{item.device_id}</Text>
      <Text style={styles.dataText}>
        Latitude: {item.latitude !== undefined ? item.latitude.toFixed(4) : 'N/A'}
      </Text>
      <Text style={styles.dataText}>
        Longitude: {item.longitude !== undefined ? item.longitude.toFixed(4) : 'N/A'}
      </Text>
      <Text style={styles.dataText}>
        Última Atualização: {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relatórios</Text>
        <View style={{ width: 28 }} />
      </View>
      <FlatList
        data={devices}
        renderItem={renderDeviceItem}
        keyExtractor={(item) => item.device_id}
        showsVerticalScrollIndicator={true}
        {...(Platform.OS === "web" && {
          nestedScrollEnabled: true,
          className: "reports-flatlist", // For web scrolling detection
        })}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum dispositivo encontrado</Text>}
      />
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Exportar Relatório</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              if (selectedDevice) {
                generateReport(selectedDevice, 'csv');
                setModalVisible(false);
              }
            }}
          >
            <Text style={styles.buttonText}>Exportar CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#1E90FF' }]}
            onPress={() => {
              if (selectedDevice) {
                generateReport(selectedDevice, 'pdf');
                setModalVisible(false);
              }
            }}
          >
            <Text style={styles.buttonText}>Exportar PDF</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <NavBar
        onPressHome={() => navigation.navigate('Home')}
        onPressDashboard={() => navigation.navigate('Dashboard')}
        onPressProfile={() => navigation.navigate('Profile')}
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#041635',
    width: '100%',
    alignItems: 'center',
    paddingBottom: barHeight,
    minHeight: Dimensions.get('window').height,
    ...(Platform.OS === "web" && {
      overflowY: "auto", // Enable vertical scrolling
      WebkitOverflowScrolling: "touch",
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    width: '100%',
  },
  backButton: {
    padding: 4,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  flatList: {
    width: '100%',
    ...(Platform.OS === "web" && {
      overflowY: "auto", // Enable vertical scrolling
      WebkitOverflowScrolling: "touch",
    }),
  },
  flatListContent: {
    paddingBottom: 20, // Ensure content isn’t cut off
    alignItems: 'center', // Center items horizontally
  },
  deviceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: Platform.select({ web: 400, native: Dimensions.get('window').width * 0.9 }),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    alignSelf: 'center', // Center cards within FlatList
  },
  deviceId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#041635',
    marginBottom: 10,
  },
  dataText: {
    fontSize: 14,
    color: '#041635',
    marginBottom: 5,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: Platform.select({ web: 300, native: Dimensions.get('window').width * 0.8 }),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === "web" && {
      overflowY: "auto", // Enable scrolling for modal content
      WebkitOverflowScrolling: "touch",
    }),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#041635',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%', // Ensure buttons stretch to fit modal
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ReportsScreen;