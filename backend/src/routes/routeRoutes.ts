import express, { Request, Response } from 'express';
import { RouteService } from '../service/routeService';
import { insertRoute } from '../models/gpsDao';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/device/:deviceId/route', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { deviceId } = req.params;
    const { timeRange, isMaritime } = req.query;

    // Calculate route (maritime or terrestrial)
    const isMaritimeRoute = isMaritime === 'true';
    const route = await RouteService.getRoute(deviceId, timeRange as string | undefined, isMaritimeRoute);

    // Save route to database
    await insertRoute(deviceId, route, isMaritimeRoute);

    res.status(200).json(route);
  } catch (error: any) {
    console.error('Error in route endpoint:', error.message);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

export default router;