import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

// Import routes
import authRoutes from './api/auth';
import userRoutes from './api/users';
import courseRoutes from './api/courses';
import assessmentRoutes from './api/assessment';
import aiTutorRoutes from './api/ai-tutor';
import videoRoutes from './api/video';

// Import job queues
import { videoProcessingQueue } from './jobs/videoProcessingQueue';

// Initialize Prisma client
const prisma = new PrismaClient();

// Initialize Express app
const app = express();
const port = process.env.PORT || 4000;

// Configure Bull Board
const serverAdapter = new ExpressAdapter();
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(videoProcessingQueue)],
  serverAdapter,
});

serverAdapter.setBasePath('/admin/queues');

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/ai-tutor', aiTutorRoutes);
app.use('/api/video', videoRoutes);

// Bull Board UI
app.use('/admin/queues', serverAdapter.getRouter());

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Process terminated');
  });
});

export default app; 