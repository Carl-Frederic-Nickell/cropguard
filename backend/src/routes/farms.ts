import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Alle Farmen eines Users abrufen
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const farms = await prisma.farm.findMany({
      where: { userId: req.userId },
      include: { crops: true }
    });
    res.json(farms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farms' });
  }
});

// Farm erstellen
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, location, latitude, longitude } = req.body;
    const farm = await prisma.farm.create({
      data: {
        name,
        location,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        userId: req.userId!
      }
    });
    res.status(201).json(farm);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create farm' });
  }
});

// Pflanze zu Farm hinzufügen
router.post('/:farmId/crops', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { farmId } = req.params;
    const { name, type, plantedDate } = req.body;
    
    const crop = await prisma.crop.create({
      data: {
        name,
        type,
        plantedDate: new Date(plantedDate),
        farmId
      }
    });
    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add crop' });
  }
});

export default router;
