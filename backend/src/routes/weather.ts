import { Router } from 'express';
import { getWeatherData } from '../controllers/weatherController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getWeatherData);

module.exports = router;
