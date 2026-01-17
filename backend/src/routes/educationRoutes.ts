import express from 'express';
import { getEducationLevel, updateEducationLevel, getAllEducationLevels } from '../controllers/educationController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roles';
import { Role } from '@prisma/client';

const router = express.Router();

// Public route - Get all education level options
router.get('/levels', getAllEducationLevels);

// Protected routes - Student only
router.get('/student/education-level', protect, authorize(Role.STUDENT), getEducationLevel);
router.put('/student/education-level', protect, authorize(Role.STUDENT), updateEducationLevel);

export default router;
