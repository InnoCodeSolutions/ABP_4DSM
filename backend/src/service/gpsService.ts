import {deleteGPSData, getAllGPSData, getDevices, getDeviceHistory, insertGPSData, updateGPSData,
  // novo import para o movement
  getDeviceMovementData,
  MovementPointRow
} from '../models/gpsDao';
import { GPSData } from '../types/GPSData';

export const saveGPSData = async (data: GPSData) => {
  await insertGPSData(data);
};

export const fetchGPSData = async () => {
  return await getAllGPSData();
};

export const modifyGPSData = async (id: number, data: Partial<GPSData>) => {
  await updateGPSData(id, data);
};

export const removeGPSData = async (id: number) => {
  await deleteGPSData(id);
};

export const getDeviceList = async () => {
  return await getDevices();
};

export const getDeviceHistoryList = async (deviceId: string) => {
  return await getDeviceHistory(deviceId);
};

// Quantities of Devices
export const getDeviceQuantities = async (): Promise<number> => {
  const devices = await getDevices();
  return devices.length;
};

// Device History for Report
export const getDeviceHistoryForReport = async (
  deviceId: string,
  timeRange?: string
): Promise<GPSData[]> => {
  const history = await getDeviceHistory(deviceId, timeRange);
  return history.map((item: GPSData) => ({
    device_id: item.device_id,
    latitude: item.latitude,
    longitude: item.longitude,
    altitude: item.altitude,
    speed: item.speed,
    course: item.course,
    satellites: item.satellites,
    hdop: item.hdop,
    timestamp: item.timestamp,
  }));
};

// Device Routes for Report
export const getDeviceRoutes = async (
  deviceId: string,
  timeRange?: string
): Promise<{ latitude: number; longitude: number; timestamp: string }[]> => {
  const history = await getDeviceHistory(deviceId, timeRange);
  return history.map((item: GPSData) => ({
    latitude: item.latitude,
    longitude: item.longitude,
    timestamp: item.timestamp.toISOString(),
  }));
};

// Activity Summary
export const getActivitySummary = async (
  deviceId: string,
  timeRange?: string
) => {
  const history = await getDeviceHistory(deviceId, timeRange);

  if (!history.length) {
    return { totalDistance: 0, averageSpeed: 0, activeHours: 0, movementData: [] };
  }

  // Calculate total distance using Haversine formula
  let totalDistance = 0;
  for (let i = 1; i < history.length; i++) {
    const prev = history[i - 1];
    const curr = history[i];
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (prev.latitude * Math.PI) / 180;
    const φ2 = (curr.latitude * Math.PI) / 180;
    const Δφ = ((curr.latitude - prev.latitude) * Math.PI) / 180;
    const Δλ = ((curr.longitude - prev.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // meters
    totalDistance += distance;
  }

  // Calculate average speed (non-zero speeds only)
  const speeds = history.map(item => item.speed || 0).filter(speed => speed > 0);
  const averageSpeed = speeds.length
    ? speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length
    : 0;

  // Calculate active hours (speed > 0)
  let activeSeconds = 0;
  for (let i = 1; i < history.length; i++) {
    const prev = history[i - 1];
    const curr = history[i];
    if (curr.speed && curr.speed > 0) {
      const dt = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000;
      activeSeconds += dt;
    }
  }
  const activeHours = activeSeconds / 3600;

  // Movement data for chart (e.g., speed over time)
  const movementData = history.map(item => ({
    timestamp: item.timestamp.toISOString(),
    speed: item.speed || 0,
  }));

  return {
    totalDistance: Number(totalDistance.toFixed(2)),   // meters
    averageSpeed: Number(averageSpeed.toFixed(2)),     // m/s
    activeHours: Number(activeHours.toFixed(2)),       // hours
    movementData,                                       // for chart
  };
};

/**
 * Movement: enrich each point with distance from previous and speed calculated.
 */
export type MovementPoint = {
  latitude: number;
  longitude: number;
  timestamp: string;
  distanceM: number;   // meters since previous
  speedKmh: number;    // km/h
};

export const getDeviceMovement = async (
  deviceId: string,
  timeRange?: string
): Promise<MovementPoint[]> => {
  // traz lat/lon/timestamp em ASC
  const history: MovementPointRow[] = await getDeviceMovementData(deviceId, timeRange);

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const haversineM = (p1: MovementPointRow, p2: MovementPointRow): number => {
    const R = 6371e3;
    const φ1 = toRad(p1.latitude);
    const φ2 = toRad(p2.latitude);
    const Δφ = toRad(p2.latitude - p1.latitude);
    const Δλ = toRad(p2.longitude - p1.longitude);
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return history.map((curr, i) => {
    if (i === 0) {
      return {
        latitude: curr.latitude,
        longitude: curr.longitude,
        timestamp: curr.timestamp.toISOString(),
        distanceM: 0,
        speedKmh: 0,
      };
    }
    const prev = history[i - 1];
    const dist = haversineM(prev, curr);                    // meters
    const dtSec = (curr.timestamp.getTime() - prev.timestamp.getTime()) / 1000;
    const speedMs = dtSec > 0 ? dist / dtSec : 0;           // m/s
    const speedKmh = speedMs * 3.6;                         // km/h

    return {
      latitude: curr.latitude,
      longitude: curr.longitude,
      timestamp: curr.timestamp.toISOString(),
      distanceM: Number(dist.toFixed(1)),
      speedKmh: Number(speedKmh.toFixed(2)),
    };
  });
};