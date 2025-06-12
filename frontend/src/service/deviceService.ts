// src/api.ts

import axios from "axios";
import { BACKEND_HOST } from '@env';
import { getToken } from './getToken';

const api = 'https://innocodesutionsbackend.up.railway.app';

export interface Derivador {
  device_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  altitude?: number;
  speed?: number;    // em km/h
  distance?: number; // em metros
  course?: number;
  satellites?: number;
  hdop?: number;
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

// --- Helper de GET com token
async function authorizedGet<T>(url: string): Promise<T> {
  const token = await getToken();
  if (!token) throw new Error("Token não encontrado");
  const res = await axios.get<T>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// --- 1) Lista de dispositivos (sem speed/distance)
export async function fetchDerivadores(): Promise<Derivador[]> {
  const data = await authorizedGet<{ device_id: string; latitude: number; longitude: number; timestamp: string }[]>(
    `${api}/devices`
  );
  return data.map(item => ({
    device_id: item.device_id,
    latitude: item.latitude,
    longitude: item.longitude,
    timestamp: item.timestamp,
  }));
}

// --- 2) Histórico do dispositivo, já com speed e distance
export async function fetchDeviceHistory(deviceId: string): Promise<Derivador[]> {
  try {
    // a) histórico "bruto"
    const history = await authorizedGet<any[]>(
      `${api}/devices/${deviceId}/history`
    );

    // b) movimento (distanceM & speedKmh)
    const mov = await authorizedGet<{
      device_id: string;
      averageSpeedKmh: number;
      movement: { timestamp: string; distanceM: number; speedKmh: number }[];
    }>(
      `${api}/devices/${deviceId}/movement`
    );

    // c) montar um map para lookup rápido
    const mapMov = new Map<string, { distanceM: number; speedKmh: number }>(
      mov.movement.map(m => [m.timestamp, { distanceM: m.distanceM, speedKmh: m.speedKmh }])
    );

    // d) mesclar os dados
    return history.map(item => {
      const ts = item.timestamp as string;
      const mm = mapMov.get(ts);
      return {
        device_id: item.device_id,
        latitude: item.latitude ?? 0,
        longitude: item.longitude ?? 0,
        timestamp: ts,
        altitude: item.altitude,
        speed: mm ? mm.speedKmh : item.speed ?? 0,
        distance: mm ? mm.distanceM : 0,
        course: item.course,
        satellites: item.satellites,
        hdop: item.hdop,
      };
    });
  } catch (err) {
    console.error("Erro ao montar histórico com speed/distance:", err);
    throw new Error("Erro ao buscar histórico do dispositivo");
  }
}

// --- 3) Movimento puro (points + avg speed)
export async function fetchDeviceMovement(deviceId: string): Promise<{
  movement: Derivador[];
  averageSpeedKmh: number;
}> {
  try {
    const data = await authorizedGet<{
      device_id: string;
      averageSpeedKmh: number;
      movement: {
        latitude: number;
        longitude: number;
        timestamp: string;
        distanceM: number;
        speedKmh: number;
      }[];
    }>(`${api}/devices/${deviceId}/movement`);

    return {
      averageSpeedKmh: data.averageSpeedKmh,
      movement: data.movement.map(pt => ({
        device_id: data.device_id,
        latitude: pt.latitude,
        longitude: pt.longitude,
        timestamp: pt.timestamp,
        speed: pt.speedKmh,
        distance: pt.distanceM,
      })),
    };
  } catch (err) {
    console.error(`Error fetching movement for ${deviceId}:`, err);
    return { movement: [], averageSpeedKmh: 0 };
  }
}

// --- 4) Quantidade total de dispositivos
export async function fetchDeviceQuantities(): Promise<DeviceQuantities> {
  return authorizedGet<DeviceQuantities>(
    `${api}/reports/device-quantities`
  );
}

// --- 5) Histórico para relatório (sem mesclagem)
export async function fetchDeviceHistoryForReport(
  deviceId: string,
  timeRange?: string
): Promise<Derivador[]> {
  const url = `${api}/reports/device-history/${deviceId}${
    timeRange ? `?timeRange=${timeRange}` : ''
  }`;
  return authorizedGet<Derivador[]>(url);
}

// --- 6) Rotas para relatório
export async function fetchDeviceRoutes(
  deviceId: string,
  timeRange?: string
): Promise<DeviceRoute[]> {
  const url = `${api}/reports/device-routes/${deviceId}${
    timeRange ? `?timeRange=${timeRange}` : ''
  }`;
  return authorizedGet<DeviceRoute[]>(url);
}

// --- 7) Resumo de atividades
export async function fetchActivitySummary(
  deviceId: string,
  timeRange?: string
): Promise<ActivitySummary> {
  const url = `${api}/reports/activity-summary/${deviceId}${
    timeRange ? `?timeRange=${timeRange}` : ''
  }`;
  return authorizedGet<ActivitySummary>(url);
}

// --- 8) Rota GeoJSON (opcional: isMaritime)
export async function fetchDeviceRoute(
  deviceId: string,
  timeRange?: string,
  isMaritime?: boolean
): Promise<GeoJSONRoute> {
  const params = new URLSearchParams();
  if (timeRange) params.append('timeRange', timeRange);
  if (isMaritime != null) params.append('isMaritime', String(isMaritime));
  const url = `https://innocodesutionsbackend.up.railway.app/api/routes/device/${deviceId}/route${
    params.toString() ? '?' + params.toString() : ''
  }`;
  return authorizedGet<GeoJSONRoute>(url);
}
