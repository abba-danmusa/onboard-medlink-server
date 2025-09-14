import { Router } from 'express';
import { getDashboard, editUser } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Protected routes - require authentication
router.get('/dashboard', requireAuth, getDashboard);
router.put('/edit/:userId', requireAuth, editUser);

export default router;