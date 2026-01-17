import express from 'express';
import {
    submitAssignment,
    getMySubmissions,
    getSubmissionById,
    getAssignmentSubmissions,
    updateSubmissionStatus,
    getAllSubmissions,
} from '../controllers/submissionController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roles';
import { Role } from '@prisma/client';

const router = express.Router();

// Student routes
router.post('/', protect, authorize(Role.STUDENT), submitAssignment);
router.get('/my-submissions', protect, authorize(Role.STUDENT), getMySubmissions);

// Admin/Instructor routes
router.get('/', protect, authorize(Role.ADMIN, Role.INSTRUCTOR), getAllSubmissions);
router.get('/assignment/:assignmentId', protect, authorize(Role.ADMIN, Role.INSTRUCTOR), getAssignmentSubmissions);
router.get('/:id', protect, getSubmissionById);
router.patch('/:id/status', protect, authorize(Role.ADMIN, Role.INSTRUCTOR), updateSubmissionStatus);

export default router;
