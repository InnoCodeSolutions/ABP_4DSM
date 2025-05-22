import { Pool } from 'pg';
import config from '../models/config';
import { GPSData } from '../types/GPSData';

const pool = new Pool(config.database);

export const insertGPSData = async (data: GPSData): Promise<void> => {
  const { device_id, latitude, longitude, altitude, speed, course, satellites, hdop } = data;
  await pool.query(`
    INSERT INTO login.gps_data (device_id, latitude, longitude, altitude, speed, course, satellites, hdop)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [device_id, latitude, longitude, altitude, speed, course, satellites, hdop]);
};

export const getAllGPSData = async () => {
  const result = await pool.query('SELECT * FROM login.gps_data ORDER BY timestamp DESC');
  return result.rows;
};

export const getDevices = async (): Promise<{ device_id: string, latitude: number, longitude: number, timestamp: string }[]> => {
  const result = await pool.query(`
    SELECT DISTINCT ON (device_id) device_id, latitude, longitude, timestamp
    FROM login.gps_data
    ORDER BY device_id, timestamp DESC
  `);
  return result.rows;
};

export const getDeviceHistory = async (deviceId: string, timeRange?: string): Promise<GPSData[]> => {
  let query = `
    SELECT * FROM login.gps_data
    WHERE device_id = $1
  `;
  const params: any[] = [deviceId];

  if (timeRange) {
    let startDate: Date;
    const endDate = new Date();
    if (timeRange === 'last7days') {
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
    } else if (timeRange === 'last30days') {
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
    } else {
      const [start, end] = timeRange.split('/'); // e.g., "2025-05-01/2025-05-20"
      startDate = new Date(start);
      endDate.setTime(Date.parse(end) || endDate.getTime());
    }
    query += ` AND timestamp BETWEEN $2 AND $3`;
    params.push(startDate, endDate);
  }

  query += ` ORDER BY timestamp DESC`;
  const result = await pool.query(query, params);
  let points = result.rows;

  // Sample to at most 500 points for performance
  if (points.length > 500) {
    points = points.slice(0, 500);
  }

  return points;
};

export const getActivitySummaryData = async (deviceId: string, timeRange?: string): Promise<GPSData[]> => {
  let query = `
    SELECT latitude, longitude, speed, timestamp
    FROM login.gps_data
    WHERE device_id = $1
  `;
  const params: any[] = [deviceId];

  if (timeRange) {
    let startDate: Date;
    const endDate = new Date();
    if (timeRange === 'last7days') {
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
    } else if (timeRange === 'last30days') {
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
    } else {
      const [start, end] = timeRange.split('/');
      startDate = new Date(start);
      endDate.setTime(Date.parse(end) || endDate.getTime());
    }
    query += ` AND timestamp BETWEEN $2 AND $3`;
    params.push(startDate, endDate);
  }

  query += ` ORDER BY timestamp ASC`;
  const result = await pool.query(query, params);
  return result.rows;
};

export const insertRoute = async (deviceId: string, routeGeojson: any, isMaritime: boolean): Promise<void> => {
  await pool.query(`
    INSERT INTO login.routes (device_id, route_geojson, is_maritime)
    VALUES ($1, $2, $3)
  `, [deviceId, routeGeojson, isMaritime]);
};

export const getRoutes = async (deviceId: string, timeRange?: string): Promise<any[]> => {
  let query = `
    SELECT route_geojson, is_maritime, created_at
    FROM login.routes
    WHERE device_id = $1
  `;
  const params: any[] = [deviceId];

  if (timeRange) {
    let startDate: Date;
    const endDate = new Date();
    if (timeRange === 'last7days') {
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
    } else if (timeRange === 'last30days') {
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
    } else {
      const [start, end] = timeRange.split('/');
      startDate = new Date(start);
      endDate.setTime(Date.parse(end) || endDate.getTime());
    }
    query += ` AND created_at BETWEEN $2 AND $3`;
    params.push(startDate, endDate);
  }

  query += ` ORDER BY created_at DESC`;
  const result = await pool.query(query, params);
  return result.rows;
};

export const updateGPSData = async (id: number, data: Partial<GPSData>): Promise<void> => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  if (fields.length === 0) return;

  const sets = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');

  await pool.query(
    `UPDATE login.gps_data SET ${sets} WHERE id = $${fields.length + 1}`,
    [...values, id]
  );
};

export const deleteGPSData = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM login.gps_data WHERE id = $1', [id]);
};