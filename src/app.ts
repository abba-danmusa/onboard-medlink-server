import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

const app = express();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink';
mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// CORS configuration: set CORS_ORIGIN in .env to restrict in production
// Default to allowing all origins during development for convenience.
const allowedOrigin = process.env.CORS_ORIGIN || '*';
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigin === '*' ? true : (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigin === '*' || origin === allowedOrigin) {
      return callback(null, true);
    }
    console.warn(`Blocked CORS request from origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicit preflight handler to ensure proper Access-Control headers are always returned.
app.options('*', (req, res) => {
  const origin = req.header('Origin') || '*';
  console.log(`Preflight request from origin: ${origin} to ${req.originalUrl}`);
  res.header('Access-Control-Allow-Origin', allowedOrigin === '*' ? '*' : origin);
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  return res.sendStatus(204);
});
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Express Server!');
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: Function) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      message: 'CORS error: Origin not allowed',
      origin: req.headers.origin
    });
  }
  
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

export default app;
