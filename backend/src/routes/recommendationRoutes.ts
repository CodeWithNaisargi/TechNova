import express from 'express';
import {
    getCourseRecommendations,
    getNextSkillSuggestion,
    getStudentProfile,
} from '../controllers/recommendationController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roles';
import { Role } from '@prisma/client';

const router = express.Router();

// All routes require authentication and STUDENT role
router.use(protect);
router.use(authorize(Role.STUDENT));

// Get personalized course recommendations
router.get('/', getCourseRecommendations);

// Get next focus skill suggestion
router.get('/next-skill', getNextSkillSuggestion);

// Get student feature vector (for transparency/debugging)
router.get('/profile', getStudentProfile);

export default router;
