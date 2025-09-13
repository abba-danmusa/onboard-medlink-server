import { Router } from 'express';
import { getDashboard } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Protected route - requires authentication
router.get('/dashboard', requireAuth, getDashboard);

export default router;