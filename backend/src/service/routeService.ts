import { getDeviceHistory } from '../models/gpsDao';
import { GPSData } from '../types/GPSData';

export class RouteService {
  // Fórmula de Haversine para calcular distância entre dois pontos (em km)
  private static haversineDistance(coord1: [number, number], coord2: [number, number]): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Raio da Terra em km
    const dLat = toRad(coord2[1] - coord1[1]);
    const dLon = toRad(coord2[0] - coord1[0]);
    const lat1 = toRad(coord1[1]);
    const lat2 = toRad(coord2[1]);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c;
  }

  public static async getRoute(deviceId: string, timeRange?: string, isMaritime: boolean = false): Promise<any> {
    // Fetch GPS points from gpsDao
    const gpsData = await getDeviceHistory(deviceId, timeRange);
    if (!gpsData || gpsData.length < 2) {
      throw new Error('At least two GPS points are required for a route');
    }

    // Extract coordinates in [longitude, latitude] format
    const coordinates: [number, number][] = gpsData.map((data: GPSData) => [
      data.longitude,
      data.latitude,
    ]);

    // Calculate total distance
    let totalDistance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      totalDistance += this.haversineDistance(coordinates[i], coordinates[i + 1]);
    }

    // Estimate duration (60 km/h for terrestrial, 37 km/h for maritime)
    const averageSpeedKmh = isMaritime ? 37 : 60;
    const durationHours = totalDistance / averageSpeedKmh;
    const durationSeconds = durationHours * 3600;

    // Create GeoJSON
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates,
          },
          properties: {
            deviceId,
            distance: totalDistance, // in km
            duration: durationSeconds, // in seconds
            mode: isMaritime ? 'maritime' : 'terrestrial',
          },
        },
      ],
    };
  }

  public static async getMaritimeRoute(deviceId: string, timeRange?: string): Promise<any> {
    return await this.getRoute(deviceId, timeRange, true);
  }
}