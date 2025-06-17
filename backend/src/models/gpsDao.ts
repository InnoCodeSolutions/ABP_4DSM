// src/models/gpsDao.ts
import { Pool } from 'pg';
import { dbConfig } from './config';
import { GPSData } from '../types/GPSData';

const pool = new Pool(dbConfig);

// Inserção de novo ponto GPS
export async function insertGPSData(data: GPSData): Promise<void> {
  const {
    device_id,
    latitude,
    longitude,
    altitude,
    speed,
    course,
    satellites,
    hdop,
  } = data;

  await pool.query(
    `INSERT INTO login.gps_data 
      (device_id, latitude, longitude, altitude, speed, course, satellites, hdop)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [device_id, latitude, longitude, altitude, speed, course, satellites, hdop]
  );
}

// Retorna todos os pontos, do mais novo para o mais velho
export async function getAllGPSData(): Promise<GPSData[]> {
  const result = await pool.query(
    `SELECT * FROM login.gps_data ORDER BY timestamp DESC`
  );
  return result.rows;
}

// Lista últimos registros por dispositivo
export async function getDevices(): Promise<
  { device_id: string; latitude: number; longitude: number; timestamp: Date }[]
> {
  const result = await pool.query(
    `SELECT DISTINCT ON (device_id) device_id, latitude, longitude, timestamp
     FROM login.gps_data
     ORDER BY device_id, timestamp DESC`
  );
  return result.rows;
}

// Histórico completo (até 500) de um device, opcional período
export async function getDeviceHistory(
  deviceId: string,
  timeRange?: string
): Promise<GPSData[]> {
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
      // Suporte a separadores ',' ou '/' e remoção de 'T' e 'Z' para horários
      const [start, end] = timeRange.includes(',') ? timeRange.split(',') : timeRange.split('/');
      startDate = new Date(start.replace('T', ' ').replace('Z', ''));
      endDate.setTime(Date.parse(end.replace('T', ' ').replace('Z', '')) || endDate.getTime());
    }
    query += ` AND timestamp BETWEEN $2 AND $3`;
    params.push(startDate, endDate);
  }

  query += ` ORDER BY timestamp DESC LIMIT 500`;
  const result = await pool.query(query, params);
  return result.rows;
}

// Para relatórios: só lat,lon,speed,timestamp em ordem ASC
export async function getActivitySummaryData(
  deviceId: string,
  timeRange?: string
): Promise<
  { latitude: number; longitude: number; speed: number | null; timestamp: Date }[]
> {
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
      // Suporte a separadores ',' ou '/' e remoção de 'T' e 'Z' para horários
      const [start, end] = timeRange.includes(',') ? timeRange.split(',') : timeRange.split('/');
      startDate = new Date(start.replace('T', ' ').replace('Z', ''));
      endDate.setTime(Date.parse(end.replace('T', ' ').replace('Z', '')) || endDate.getTime());
    }
    query += ` AND timestamp BETWEEN $2 AND $3`;
    params.push(startDate, endDate);
  }

  query += ` ORDER BY timestamp ASC`;
  const result = await pool.query(query, params);
  return result.rows;
}

// Insere rota (GeoJSON) calculada
export async function insertRoute(
  deviceId: string,
  routeGeojson: any,
  isMaritime: boolean
): Promise<void> {
  await pool.query(
    `INSERT INTO login.routes (device_id, route_geojson, is_maritime)
     VALUES ($1, $2, $3)`,
    [deviceId, routeGeojson, isMaritime]
  );
}

// Busca rotas já salvas
export async function getRoutes(
  deviceId: string,
  timeRange?: string
): Promise<{ route_geojson: any; is_maritime: boolean; created_at: Date }[]> {
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
      // Suporte a separadores ',' ou '/' e remoção de 'T' e 'Z' para horários
      const [start, end] = timeRange.includes(',') ? timeRange.split(',') : timeRange.split('/');
      startDate = new Date(start.replace('T', ' ').replace('Z', ''));
      endDate.setTime(Date.parse(end.replace('T', ' ').replace('Z', '')) || endDate.getTime());
    }
    query += ` AND created_at BETWEEN $2 AND $3`;
    params.push(startDate, endDate);
  }

  query += ` ORDER BY created_at DESC`;
  const result = await pool.query(query, params);
  return result.rows;
}

// Atualiza um registro pelo ID
export async function updateGPSData(
  id: number,
  data: Partial<GPSData>
): Promise<void> {
  const fields = Object.keys(data);
  const values = Object.values(data);
  if (fields.length === 0) return;

  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
  await pool.query(
    `UPDATE login.gps_data SET ${setClause} WHERE id = $${fields.length + 1}`,
    [...values, id]
  );
}

// Deleta pelo ID
export async function deleteGPSData(id: number): Promise<void> {
  await pool.query(`DELETE FROM login.gps_data WHERE id = $1`, [id]);
}


// —————— NOVO: PARA MOVIMENTO ——————

/**
 * Linha simplificada para cálculo de movimento
 */
export interface MovementPointRow {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

/**
 * Retorna pontos em ASC para calcular distância e velocidade entre pares.
 */
export async function getDeviceMovementData(
  deviceId: string,
  timeRange?: string
): Promise<MovementPointRow[]> {
  let query = `
    SELECT latitude, longitude, timestamp
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
      // Suporte a separadores ',' ou '/' e remoção de 'T' e 'Z' para horários
      const [start, end] = timeRange.includes(',') ? timeRange.split(',') : timeRange.split('/');
      startDate = new Date(start.replace('T', ' ').replace('Z', ''));
      endDate.setTime(Date.parse(end.replace('T', ' ').replace('Z', '')) || endDate.getTime());
    }
    query += ` AND timestamp BETWEEN $2 AND $3`;
    params.push(startDate, endDate);
  }

  query += ` ORDER BY timestamp ASC`;
  const result = await pool.query(query, params);
  return result.rows.map(r => ({
    latitude: r.latitude,
    longitude: r.longitude,
    timestamp: r.timestamp,
  }));
}