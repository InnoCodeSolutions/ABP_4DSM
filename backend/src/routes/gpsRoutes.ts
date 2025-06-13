import express from 'express';
import {
  fetchGPSData,
  saveGPSData,
  modifyGPSData,
  removeGPSData,
  getDeviceList,
  getDeviceHistoryList,
  getDeviceQuantities,
  getDeviceHistoryForReport,
  getDeviceRoutes,
  getActivitySummary,
  // import da nova função
  getDeviceMovement
} from '../service/gpsService';
import { GPSData } from '../types/GPSData';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

// POST - cria novo dado
router.post('/gps', async (req:any, res:any) => {
  const data = req.body as GPSData;
  if (!data.device_id || data.latitude === undefined || data.longitude === undefined) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }
  await saveGPSData(data);
  res.status(201).json({ message: 'Dados GPS salvos com sucesso!' });
});

// GET - lista todos
router.get('/gps', async (req, res) => {
  const rows = await fetchGPSData();
  res.status(200).json(rows);
});

// PUT - atualiza dado por ID
router.put('/gps/:id', authenticateToken, async (req:any, res:any) => {
  const id = parseInt(req.params.id);
  const data = req.body as Partial<GPSData>;
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  await modifyGPSData(id, data);
  res.status(200).json({ message: 'Atualizado com sucesso' });
});

// DELETE - remove por ID
router.delete('/gps/:id', authenticateToken, async (req:any, res:any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  await removeGPSData(id);
  res.status(200).json({ message: 'Removido com sucesso' });
});

// GET - lista dispositivos únicos
router.get('/devices', async (req, res) => {
  try {
    const devices = await getDeviceList();
    res.status(200).json(devices);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar dispositivos' });
  }
});

// GET - histórico bruto de um dispositivo
router.get('/devices/:deviceId/history', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const history = await getDeviceHistoryList(deviceId);
    res.status(200).json(history);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar histórico do dispositivo' });
  }
});

// ───────── NOVAS ROTAS DE RELATÓRIO ─────────

// Quantidade de dispositivos
router.get('/reports/device-quantities', async (req, res) => {
  try {
    const quantities = await getDeviceQuantities();
    res.status(200).json({ totalDevices: quantities });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar quantidade de dispositivos' });
  }
});

// Histórico para relatório
router.get('/reports/device-history/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const timeRange = req.query.timeRange as string;
    const history = await getDeviceHistoryForReport(deviceId, timeRange);
    res.status(200).json(history);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar histórico para relatório' });
  }
});

// Rotas para relatório
router.get('/reports/device-routes/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const timeRange = req.query.timeRange as string;
    const routes = await getDeviceRoutes(deviceId, timeRange);
    res.status(200).json(routes);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar rotas para relatório' });
  }
});

// Activity summary para relatório
router.get('/reports/activity-summary/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const timeRange = req.query.timeRange as string;
    const summary = await getActivitySummary(deviceId, timeRange);
    res.status(200).json(summary);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar resumo de atividades' });
  }
});

// ───────── NOVA ROTA DE MOVIMENTO ─────────

/**
 * GET /devices/:deviceId/movement
 * query: ?timeRange=YYYY-MM-DD... or last7days/last30days
 *
 * Retorna lista de pontos com:
 *  - latitude, longitude, timestamp
 *  - distanceM: metros do ponto anterior
 *  - speedKmh: km/h calculada entre os dois pontos
 */
router.get('/devices/:deviceId/movement', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const timeRange = req.query.timeRange as string | undefined;
    const movement = await getDeviceMovement(deviceId, timeRange);
    res.status(200).json({ device_id: deviceId, movement });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar dados de movimento' });
  }
});

export default router;
