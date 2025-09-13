import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import authRoutes from './routes/auth';

const app = express();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink';
mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// CORS configuration: set CORS_ORIGIN in .env to restrict, default '*' for development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];
const corsOrigin = process.env.CORS_ORIGIN || allowedOrigins;
const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || corsOrigin === '*' || (Array.isArray(corsOrigin) && corsOrigin.includes(origin)) || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Express Server!');
});

export default app;
