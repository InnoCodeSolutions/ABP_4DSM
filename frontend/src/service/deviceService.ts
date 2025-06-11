import axios from "axios";
import { BACKEND_HOST } from '@env';
import { getToken } from './getToken';

// Base URL da API
const BASE_URL = `https://${BACKEND_HOST}`;

// Interfaces
export interface Derivador {
  device_id: string;
  latitude?: number;
  longitude?: number;
  timestamp?: string;
  altitude?: number;
  speed?: number; // Speed in km/h
  course?: number;
  satellites?: number;
  hdop?: number;
  distance?: number; // Distance in meters
}

export interface DeviceRoute {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface DeviceQuantities {
  totalDevices: number;
}

export interface ActivitySummary {
  totalDistance: number;
  averageSpeed: number;
  activeHours: number;
  movementData: { timestamp: string; speed: number }[];
}

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

// Requisição GET com token
const authorizedGet = async (url: string) => {
  const token = await getToken();
  if (!token) throw new Error("Token não encontrado");

  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// Obtem lista de derivadores
export const fetchDerivadores = async (): Promise<Derivador[]> => {
  try {
    const data = await authorizedGet(`${BASE_URL}/devices`);
    return data.map((item: any) => ({
      device_id: item.device_id,
      latitude: item.latitude ?? 0,
      longitude: item.longitude ?? 0,
      timestamp: item.timestamp ?? new Date().toISOString(),
    }));
  } catch (error) {
    throw new Error("Erro ao buscar derivadores");
  }
};

// Histórico do dispositivo
export const fetchDeviceHistory = async (deviceId: string): Promise<Derivador[]> => {
  try {
    const data = await authorizedGet(`${BASE_URL}/devices/${deviceId}/history`);
    return data.map((item: any) => ({
      device_id: item.device_id,
      latitude: item.latitude ?? 0,
      longitude: item.longitude ?? 0,
      timestamp: item.timestamp ?? new Date().toISOString(),
      altitude: item.altitude,
      speed: item.speed,
      course: item.course,
      satellites: item.satellites,
      hdop: item.hdop,
      distance: item.distance,
    }));
  } catch (error) {
    throw new Error("Erro ao buscar histórico do dispositivo");
  }
};

// Movimento do dispositivo
export const fetchDeviceMovement = async (deviceId: string): Promise<{ movement: Derivador[], averageSpeedKmh: number }> => {
  try {
    const url = `https://innocodesutionsbackend.up.railway.app/devices/${deviceId}/movement`;
    const data = await authorizedGet(url);
    console.log(`fetchDeviceMovement response for ${deviceId}:`, JSON.stringify(data, null, 2));
    
    const movementArray = Array.isArray(data.movement) ? data.movement : [];
    const averageSpeedKmh = data.averageSpeedKmh || 0;

    return {
      movement: movementArray.map((item: any) => ({
        device_id: data.device_id,
        latitude: item.latitude ?? 0,
        longitude: item.longitude ?? 0,
        timestamp: item.timestamp ?? new Date().toISOString(),
        altitude: item.altitude,
        speed: item.speedKmh,
        course: item.course,
        satellites: item.satellites,
        hdop: item.hdop,
        distance: item.distanceM,
      })),
      averageSpeedKmh,
    };
  } catch (error) {
    console.error(`Error fetching movement for ${deviceId}:`, error);
    return { movement: [], averageSpeedKmh: 0 };
  }
};

// Quantidade total de dispositivos
export const fetchDeviceQuantities = async (): Promise<DeviceQuantities> => {
  try {
    return await authorizedGet(`${BASE_URL}/reports/device-quantities`);
  } catch (error) {
    throw new Error("Erro ao buscar quantidade de dispositivos");
  }
};

// Histórico com faixa de tempo
export const fetchDeviceHistoryForReport = async (deviceId: string, timeRange?: string): Promise<Derivador[]> => {
  try {
    const url = `${BASE_URL}/reports/device-history/${deviceId}${timeRange ? `?timeRange=${timeRange}` : ''}`;
    return await authorizedGet(url);
  } catch (error) {
    throw new Error("Erro ao buscar histórico para relatório");
  }
};

// Rotas do dispositivo
export const fetchDeviceRoutes = async (deviceId: string, timeRange?: string): Promise<DeviceRoute[]> => {
  try {
    const url = `${BASE_URL}/reports/device-routes/${deviceId}${timeRange ? `?timeRange=${timeRange}` : ''}`;
    return await authorizedGet(url);
  } catch (error) {
    throw new Error("Erro ao buscar rotas do dispositivo");
  }
};

// Resumo de atividades
export const fetchActivitySummary = async (deviceId: string, timeRange?: string): Promise<ActivitySummary> => {
  try {
    const url = `${BASE_URL}/reports/activity-summary/${deviceId}${timeRange ? `?timeRange=${timeRange}` : ''}`;
    return await authorizedGet(url);
  } catch (error) {
    throw new Error("Erro ao buscar resumo de atividades");
  }
};

// Rota GeoJSON
export const fetchDeviceRoute = async (
  deviceId: string,
  timeRange?: string,
  isMaritime?: boolean
): Promise<GeoJSONRoute> => {
  try {
    const query = new URLSearchParams();
    if (timeRange) query.append('timeRange', timeRange);
    if (isMaritime) query.append('isMaritime', isMaritime.toString());

    const url = `${BASE_URL}/api/routes/device/${deviceId}/route${query.toString() ? '?' + query.toString() : ''}`;
    return await authorizedGet(url);
  } catch (error) {
    throw new Error("Erro ao buscar rota GeoJSON");
  }
};