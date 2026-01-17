import express from 'express';
import { updateProgress, getCourseProgress, recalculateProgress } from '../controllers/progressController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, updateProgress);
router.get('/:courseId', protect, getCourseProgress);
router.post('/recalculate/:courseId', protect, recalculateProgress);

export default router;
