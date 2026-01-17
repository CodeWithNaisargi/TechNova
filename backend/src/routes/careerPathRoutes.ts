import express from 'express';
import { getAllCareerPaths, updateStudentInterest } from '../controllers/careerPathController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roles';
import { Role } from '@prisma/client';

const router = express.Router();

// Public route - Get all career paths
router.get('/', getAllCareerPaths);

// Protected route - Update student's career interest (STUDENT only)
router.put('/student/interest', protect, authorize(Role.STUDENT), updateStudentInterest);

export default router;
