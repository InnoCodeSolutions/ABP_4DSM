import axios from 'axios';
import config from '../config/config.json';
import { GPSData } from '../types/GPSData';

export class RouteService {
  private static orsApiKey = config.openRouteService.apiKey;
  private static orsBaseUrl = 'https://api.openrouteservice.org/v2/directions';

  public static async getRoute(coordinates: [number, number][]): Promise<any> {
    if (coordinates.length < 2) {
      throw new Error('At least two coordinates are required for a route');
    }

    try {
      const response = await axios.post(
        `${this.orsBaseUrl}/driving-car/geojson`,
        {
          coordinates,
          instructions: false,
          geometry: true,
        },
        {
          headers: {
            Authorization: `Bearer ${this.orsApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching route from ORS:', error);
      throw new Error('Failed to calculate route');
    }
  }

  public static async getMaritimeRoute(coordinates: [number, number][]): Promise<any> {
    if (coordinates.length < 2) {
      throw new Error('At least two coordinates are required for a route');
    }

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates,
          },
          properties: {},
        },
      ],
    };
  }
}