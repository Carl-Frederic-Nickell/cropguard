import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CropGuard API running' });
});

// Routes
import authRoutes from './routes/auth';
import farmsRoutes from './routes/farms';
import weatherRoutes from './routes/weather';

app.use('/api/auth', authRoutes);
app.use('/api/farms', farmsRoutes);
app.use('/api/weather', weatherRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { prisma };
