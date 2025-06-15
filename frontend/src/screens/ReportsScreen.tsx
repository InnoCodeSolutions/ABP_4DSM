import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Dimensions,
  ScrollView,
  
} from 'react-native';
import Modal from 'react-native-modal';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  fetchDerivadores,
  fetchDeviceMovement,
  Derivador,
} from '../service/deviceService';
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

interface MovementRecord {
  device_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed: number;    // km/h
  distance: number; // m
}

const ReportsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [devices, setDevices] = useState<Derivador[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));

  // 1) Carrega lista de dispositivos (com lat, lon, timestamp)
  useEffect(() => {
    (async () => {
      try {
        const derivadores = await fetchDerivadores();
        setDevices(derivadores);
      } catch (error: any) {
        console.error('Erro ao carregar dispositivos:', error);
        Alert.alert('Erro', 'Falha ao carregar dispositivos');
      }
    })();
  }, []);

  // 2) Ajuste de dimensões ao rotacionar/trocar tamanho
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions(window);
    });
    return () => sub?.remove();
  }, []);

  const openExportModal = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setModalVisible(true);
  };

  const generateReport = async (deviceId: string, format: 'csv' | 'pdf') => {
    try {
      const { movement } = await fetchDeviceMovement(deviceId);
      const validMovement: MovementRecord[] = movement
        .filter((item): item is Derivador & { speed: number; distance: number } => 
          item.speed != null && item.distance != null
        )
        .map(item => ({
          device_id: item.device_id,
          latitude: item.latitude,
          longitude: item.longitude,
          timestamp: item.timestamp,
          speed: item.speed,
          distance: item.distance,
        }));
      if (format === 'csv') {
        await generateCSV(validMovement, deviceId);
      } else {
        await generatePDF(validMovement, deviceId);
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Falha ao gerar relatório: ' + error.message);
    }
  };

  // 3) Gera CSV incluindo speed e distance
  const generateCSV = async (data: MovementRecord[], deviceId: string) => {
    const csv = Papa.unparse(
      data.map(item => ({
        device_id: item.device_id,
        latitude: item.latitude,
        longitude: item.longitude,
        timestamp: item.timestamp,
        speed: item.speed.toFixed(2),
        distance: item.distance.toFixed(2),
      }))
    );
    const fileName = `relatorio-${deviceId}-${new Date().toISOString()}.csv`;

    if (Platform.OS === 'web') {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } else {
      const uri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(uri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'text/csv',
          dialogTitle: 'Compartilhar CSV',
        });
      } else {
        Alert.alert('Sucesso', `CSV salvo em: ${uri}`);
      }
    }
  };

  // 4) Gera PDF em A4 paisagem e centraliza a tabela
  const generatePDF = async (data: MovementRecord[], deviceId: string) => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // 4.1) Título centralizado
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFontSize(18);
      doc.setTextColor(0, 102, 204);
      doc.text(
        `Relatório do Dispositivo ${deviceId}`,
        pageWidth / 2,
        15,
        { align: 'center' }
      );

      // 4.2) Define cabeçalho e linhas
      const headers = [[
        'Dispositivo',
        'Latitude',
        'Longitude',
        'Data/Hora',
        'Velocidade (km/h)',
        'Distância (m)',
      ]];
      const rows = data.map(item => [
        item.device_id,
        item.latitude.toFixed(4),
        item.longitude.toFixed(4),
        new Date(item.timestamp).toLocaleString(),
        item.speed.toFixed(2),
        item.distance.toFixed(2),
      ]);

      // 4.3) Soma das larguras de coluna (em mm)
      const columnWidths = [30, 30, 30, 50, 30, 30];
      const tableWidth = columnWidths.reduce((sum, w) => sum + w, 0);
      const marginLeft = (pageWidth - tableWidth) / 2;

      // 4.4) Configurações do autoTable
      const opts: UserOptions = {
        startY: 25,
        head: headers,
        body: rows,
        theme: 'grid',
        margin: { left: marginLeft, top: 20 },
        styles: {
          fontSize: 8,
          overflow: 'linebreak',
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [0, 102, 204],
          textColor: [255, 255, 255],
          fontSize: 9,
        },
        columnStyles: {
          0: { cellWidth: columnWidths[0] },
          1: { cellWidth: columnWidths[1] },
          2: { cellWidth: columnWidths[2] },
          3: { cellWidth: columnWidths[3] },
          4: { cellWidth: columnWidths[4] },
          5: { cellWidth: columnWidths[5] },
        },
        tableWidth,
        pageBreak: 'auto',
      };

      autoTable(doc, opts);

      // 4.5) Download / compartilhamento
      if (Platform.OS === 'web') {
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `relatorio-${deviceId}-${new Date().toISOString()}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const base64 = doc.output('datauristring').split(',')[1];
        const fileName = `relatorio-${deviceId}-${new Date().toISOString()}.pdf`;
        const uri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(uri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Compartilhar PDF',
          });
        } else {
          Alert.alert('Sucesso', `PDF salvo em: ${uri}`);
        }
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Falha ao gerar PDF: ' + error.message);
    }
  };

  const renderDeviceItem = (device: Derivador) => (
    <TouchableOpacity
      key={device.device_id}
      style={styles.deviceCard}
      onPress={() => openExportModal(device.device_id)}
    >
      <Text style={styles.deviceId}>{device.device_id}</Text>
      <Text style={styles.dataText}>Latitude: {device.latitude.toFixed(4)}</Text>
      <Text style={styles.dataText}>Longitude: {device.longitude.toFixed(4)}</Text>
      <Text style={styles.dataText}>
        Última Atualização: {new Date(device.timestamp).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { minHeight: windowDimensions.height },
      ]}
      showsVerticalScrollIndicator
    >
      <View style={styles.deviceList}>
        {devices.length > 0 ? (
          devices.map(renderDeviceItem)
        ) : (
          <Text style={styles.emptyText}>Nenhum dispositivo encontrado</Text>
        )}
      </View>

      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
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
    </ScrollView>
  );
};

const barHeight = Platform.select({ ios: 54, android: 54, web: 60, default: 54 });
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#041635', width: '100%' },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: barHeight,
  },
  deviceList: { width: '90%', marginVertical: 20 },
  deviceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    width: Platform.select({ web: 400, native: Dimensions.get('window').width * 0.9 }),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    alignSelf: 'center',
  },
  deviceId: { fontSize: 18, fontWeight: 'bold', color: '#041635' },
  dataText: { fontSize: 14, color: '#041635', marginTop: 4 },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: Platform.select({ web: 300, native: Dimensions.get('window').width * 0.8 }),
    alignSelf: 'center',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#041635', marginBottom: 20 },
  modalButton: {
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
    width: '100%',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { color: '#fff', fontSize: 16, textAlign: 'center', marginTop: 20 },
});

export default ReportsScreen;