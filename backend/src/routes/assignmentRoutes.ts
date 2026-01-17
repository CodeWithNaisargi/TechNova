import express from 'express';
import {
    getCourseAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentProgress,
    updateAssignmentProgress,
} from '../controllers/assignmentController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roles';
import { Role } from '@prisma/client';

const router = express.Router();

// Public routes
router.get('/courses/:courseId/assignments', getCourseAssignments);
router.get('/:id', getAssignmentById);

// Student routes
router.get('/:assignmentId/progress', protect, getAssignmentProgress);
router.put('/:assignmentId/progress', protect, updateAssignmentProgress);

// Admin/Instructor routes
router.post('/', protect, authorize(Role.ADMIN, Role.INSTRUCTOR), createAssignment);
router.put('/:id', protect, authorize(Role.ADMIN, Role.INSTRUCTOR), updateAssignment);
router.delete('/:id', protect, authorize(Role.ADMIN, Role.INSTRUCTOR), deleteAssignment);

export default router;
