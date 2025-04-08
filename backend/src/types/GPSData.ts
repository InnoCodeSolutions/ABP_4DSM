// src/types/GPSData.ts

export interface GPSData {
    device_id: string;
    latitude: number;
    longitude: number;
    altitude?: number;
    speed?: number;
    course?: number;
    satellites?: number;
    hdop?: number;
  }
  