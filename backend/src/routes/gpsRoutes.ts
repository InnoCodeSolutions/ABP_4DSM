import express, { RequestHandler } from 'express';
import { fetchGPSData, saveGPSData, modifyGPSData, removeGPSData, getDeviceList, getDeviceHistoryList, getDeviceQuantities, getDeviceHistoryForReport, getDeviceRoutes, getActivitySummary } from '../service/gpsService';
import { GPSData } from '../types/GPSData';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

// POST - cria novo dado
router.post('/gps', async (req: any, res: any) => {
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

// GET - lista dispositivos únicos
router.get('/devices', async (req, res) => {
  try {
    const devices = await getDeviceList();
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dispositivos' });
  }
});

// GET - histórico de um dispositivo
router.get('/devices/:deviceId/history', async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const history = await getDeviceHistoryList(deviceId);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar histórico do dispositivo' });
  }
});


// PUT - atualiza dado por ID
router.put('/gps/:id', authenticateToken, async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  const data = req.body as Partial<GPSData>;

  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  await modifyGPSData(id, data);
  res.status(200).json({ message: 'Atualizado com sucesso' });
});

// DELETE - remove por ID
router.delete('/gps/:id', authenticateToken, async (req: any, res: any) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  await removeGPSData(id);
  res.status(200).json({ message: 'Removido com sucesso' });
});

// New Report Endpoints

// GET - Quantities of Devices
router.get('/reports/device-quantities', async (req, res) => {
  try {
    const quantities = await getDeviceQuantities();
    res.status(200).json({ totalDevices: quantities });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar quantidade de dispositivos' });
  }
});

// GET - Device History for Report
router.get('/reports/device-history/:deviceId', async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const timeRange = req.query.timeRange as string; // e.g., "last7days" or ISO date range
    const history = await getDeviceHistoryForReport(deviceId, timeRange);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar histórico para relatório' });
  }
});

// GET - Device Routes for Report
router.get('/reports/device-routes/:deviceId', async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const timeRange = req.query.timeRange as string;
    const routes = await getDeviceRoutes(deviceId, timeRange);
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar rotas para relatório' });
  }
});

// GET - Activity Summary Report
router.get('/reports/activity-summary/:deviceId', async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const timeRange = req.query.timeRange as string;
    const summary = await getActivitySummary(deviceId, timeRange);
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar resumo de atividades' });
  }
});

export default router;