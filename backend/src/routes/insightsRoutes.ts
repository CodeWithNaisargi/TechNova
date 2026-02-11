import express from 'express';
import { getStudentInsights, getInsightsUnlockStatus } from '../controllers/insightsController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/insights - Get full insights (includes unlock status)
router.get('/', getStudentInsights);

// GET /api/insights/unlock-status - Get unlock status only
router.get('/unlock-status', getInsightsUnlockStatus);

export default router;
