import express from 'express';
import {
    getInstructorCourses,
    getInstructorStats,
    getInstructorSubmissions,
    updateSubmissionStatus,
    getInstructorAssignments,
} from '../controllers/instructorController';
import { toggleCoursePublish } from '../controllers/adminController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roles';
import { Role } from '@prisma/client';

const router = express.Router();

// All routes require instructor or admin role
router.use(protect);
router.use(authorize(Role.INSTRUCTOR, Role.ADMIN));

// Dashboard stats
router.get('/stats', getInstructorStats);

// Courses
router.get('/courses', getInstructorCourses);
router.patch('/courses/:id/publish', toggleCoursePublish);

// Assignments
router.get('/assignments', getInstructorAssignments);

// Submissions
router.get('/submissions', getInstructorSubmissions);
router.patch('/submissions/:id', updateSubmissionStatus);

export default router;
