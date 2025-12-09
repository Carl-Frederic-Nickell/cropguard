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

// Farm löschen (temporarily without authentication)
router.delete('/:farmId', async (req: Request, res: Response) => {
  try {
    const { farmId } = req.params;
    
    // Erst alle Crops der Farm löschen
    await prisma.crop.deleteMany({
      where: { farmId }
    });
    
    // Dann die Farm selbst löschen
    await prisma.farm.delete({
      where: { id: farmId }
    });
    
    res.json({ success: true, message: 'Farm successfully deleted' });
  } catch (error) {
    console.error('Error deleting farm:', error);
    res.status(500).json({ error: 'Failed to delete farm' });
  }
});

// Farm abrufen (temporarily without authentication)
router.get('/:farmId', async (req: Request, res: Response) => {
  try {
    const { farmId } = req.params;
    const farm = await prisma.farm.findUnique({
      where: { id: farmId },
      include: { crops: true }
    });
    
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    
    res.json(farm);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farm' });
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
