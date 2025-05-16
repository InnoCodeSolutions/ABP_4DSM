import { Pool } from 'pg';
import config from '../models/config';
import { GPSData } from '../types/GPSData';

const pool = new Pool(config.database);

export const insertGPSData = async (data: GPSData): Promise<void> => {
  const {
    device_id, latitude, longitude, altitude, speed, course, satellites, hdop
  } = data;
  await pool.query(`
    INSERT INTO login.gps_data (
      device_id, latitude, longitude, altitude, speed, course, satellites, hdop
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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

// Nova função para buscar o histórico de um dispositivo
export const getDeviceHistory = async (deviceId: string): Promise<GPSData[]> => {
  const result = await pool.query(`
    SELECT * FROM login.gps_data
    WHERE device_id = $1
    ORDER BY timestamp DESC
  `, [deviceId]);
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