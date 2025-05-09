import axios from "axios";
import config from "@config/config.json";

const BASE_URL = `http://${config.backend.host}:${config.backend.port}`;

export interface Derivador {
  device_id: string;
  latitude?: number;
  longitude?: number;
  timestamp?: string;
  altitude?: number; // Adicionado
  speed?: number; // Adicionado
  course?: number; // Adicionado
  satellites?: number; // Adicionado
  hdop?: number; // Adicionado
}

export const fetchDerivadores = async (): Promise<Derivador[]> => {
  try {
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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