// src/types/GPSData.ts

export interface GPSData {
    timestamp: any;
    device_id: string;
    latitude: number;
    longitude: number;
    altitude?: number;
    speed?: number;
    course?: number;
    satellites?: number;
    hdop?: number;
    
  }
  