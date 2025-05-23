import axios from "axios";
import config from "../config/config.json";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Base URL for API calls
const BASE_URL = `http://${config.backend.host}:${config.backend.port}`;

// Define the Derivador interface for type safety
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

// Interface for Device Routes response
export interface DeviceRoute {
  latitude: number;
  longitude: number;
  timestamp: string;
}

// Interface for Device Quantities response
export interface DeviceQuantities {
  totalDevices: number;
}

// Interface for Activity Summary response
export interface ActivitySummary {
  totalDistance: number;
  averageSpeed: number;
  activeHours: number;
  movementData: { timestamp: string; speed: number }[];
}

// Interface for GeoJSON Route response
export interface GeoJSONRoute {
  type: 'FeatureCollection';
  features: {
    type: 'Feature';
    geometry: {
      type: 'LineString';
      coordinates: [number, number][];
    };
    properties: Record<string, any>;
  }[];
}

// Function to retrieve the authentication token based on platform
const getToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('token');
  }
  return await AsyncStorage.getItem('token');
};

// Fetch list of devices (Derivadores)
export const fetchDerivadores = async (): Promise<Derivador[]> => {
  try {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/devices`, {
      headers: { Authorization: `Bearer ${token}` },
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

// Fetch device history
export const fetchDeviceHistory = async (deviceId: string): Promise<Derivador[]> => {
  try {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/devices/${deviceId}/history`, {
      headers: { Authorization: `Bearer ${token}` },
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

// Fetch total number of devices for Quantities report
export const fetchDeviceQuantities = async (): Promise<DeviceQuantities> => {
  try {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/reports/device-quantities`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch device history for report (with optional time range)
export const fetchDeviceHistoryForReport = async (deviceId: string, timeRange?: string): Promise<Derivador[]> => {
  try {
    const token = await getToken();
    const url = `${BASE_URL}/reports/device-history/${deviceId}${timeRange ? `?timeRange=${timeRange}` : ''}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch device routes for report (with optional time range)
export const fetchDeviceRoutes = async (deviceId: string, timeRange?: string): Promise<DeviceRoute[]> => {
  try {
    const token = await getToken();
    const url = `${BASE_URL}/reports/device-routes/${deviceId}${timeRange ? `?timeRange=${timeRange}` : ''}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch activity summary for report (with optional time range)
export const fetchActivitySummary = async (deviceId: string, timeRange?: string): Promise<ActivitySummary> => {
  try {
    const token = await getToken();
    const url = `${BASE_URL}/reports/activity-summary/${deviceId}${timeRange ? `?timeRange=${timeRange}` : ''}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch device route as GeoJSON (with optional time range and maritime flag)
export const fetchDeviceRoute = async (deviceId: string, timeRange?: string, isMaritime?: boolean): Promise<GeoJSONRoute> => {
  try {
    const token = await getToken();
    const url = `${BASE_URL}/api/routes/device/${deviceId}/route${timeRange || isMaritime ? '?' : ''}${timeRange ? `timeRange=${timeRange}` : ''}${timeRange && isMaritime ? '&' : ''}${isMaritime ? `isMaritime=${isMaritime}` : ''}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};