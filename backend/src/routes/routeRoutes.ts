import express, { Request, Response } from 'express';
import { RouteService } from '../service/routeService';
import { getDeviceHistory } from '../models/gpsDao';
import { authenticateToken } from '../middlewares/authMiddleware';
import { GPSData } from '../types/GPSData';

const router = express.Router();

router.get('/device/:deviceId/route', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { deviceId } = req.params;
    const { timeRange, isMaritime } = req.query;

    // Fetch GPS data with optional time range
    const gpsData = await getDeviceHistory(deviceId, timeRange as string | undefined);
    if (!gpsData || gpsData.length < 2) {
      res.status(400).json({ error: 'At least two GPS points are required for a route' });
      return;
    }

    // Extract coordinates in [longitude, latitude] format for ORS
    const coordinates: [number, number][] = gpsData.map((data: GPSData) => [
      data.longitude,
      data.latitude,
    ]);

    // Calculate route (maritime or land)
    const route = isMaritime === 'true'
      ? await RouteService.getMaritimeRoute(coordinates)
      : await RouteService.getRoute(coordinates);

    res.status(200).json(route);
  } catch (error) {
    console.error('Error in route endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

export default router;