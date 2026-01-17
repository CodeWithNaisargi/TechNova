import express from 'express';
import {
    getCourseAssignments,
    toggleAssignmentCompletion,
    getAssignmentProgress
} from '../controllers/assignmentProgressController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roles';
import { Role } from '@prisma/client';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all assignments for a course with student's progress
router.get('/courses/:courseId/assignments', getCourseAssignments);

// Toggle assignment completion
router.patch('/:assignmentId/progress', authorize(Role.STUDENT), toggleAssignmentCompletion);

// Get student's overall progress
router.get('/progress', authorize(Role.STUDENT), getAssignmentProgress);

export default router;
