import axios from "axios";
import config from "@config/config.json";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const BASE_URL = `http://${config.backend.host}:${config.backend.port}`;

export interface Derivador {
  device_id: string;
  latitude?: number;
  longitude?: number;
  timestamp?: string;
  altitude?: number;
  speed?: number;
  course?: number;
  satellites?: number;
  hdop?: number;
}

// Função para obter o token dependendo da plataforma
const getToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('token');
  } else {
    return await AsyncStorage.getItem('token');
  }
};

export const fetchDerivadores = async (): Promise<Derivador[]> => {
  try {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/devices`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;

    return data.map((item: any) => ({
      device_id: item.device_id,
      latitude: item.latitude || 0,
      longitude: item.longitude || 0,
      timestamp: item.timestamp || new Date().toISOString(),
    }));
  } catch (error) {
    throw error;
  }
};
export const fetchDeviceHistory = async (deviceId: string): Promise<Derivador[]> => {
  try {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/devices/${deviceId}/history`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;

    return data.map((item: any) => ({
      device_id: item.device_id,
      latitude: item.latitude || 0,
      longitude: item.longitude || 0,
      timestamp: item.timestamp || new Date().toISOString(),
      altitude: item.altitude,
      speed: item.speed,
      course: item.course,
      satellites: item.satellites,
      hdop: item.hdop,
    }));
  } catch (error) {
    throw error;
  }
};