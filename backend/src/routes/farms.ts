import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Alle Farmen abrufen (temporarily without authentication)
router.get('/', async (req: Request, res: Response) => {
  try {
    const farms = await prisma.farm.findMany({
      include: { crops: true }
    });
    res.json(farms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farms' });
  }
});

// Farm erstellen (temporarily without authentication)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, location, latitude, longitude } = req.body;
    // Create a temporary user for testing
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'hashedpassword',
          name: 'Test User'
        }
      });
    }
    
    const farm = await prisma.farm.create({
      data: {
        name,
        location,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        userId: user.id
      }
    });
    res.status(201).json(farm);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create farm' });
  }
});

// Pflanze zu Farm hinzufügen (temporarily without authentication)
router.post('/:farmId/crops', async (req: Request, res: Response) => {
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
