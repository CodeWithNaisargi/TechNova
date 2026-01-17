import express from 'express';
import {
    getMyEnrollments,
    enrollCourse,
    getCourseLearning,
    getStudentStats
} from '../controllers/studentController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roles';
import { Role } from '@prisma/client';

const router = express.Router();

// All routes require authentication and student role
router.use(protect);
router.use(authorize(Role.STUDENT, Role.ADMIN));

router.get('/enrollments', getMyEnrollments);
router.post('/enroll', enrollCourse);
router.get('/learning/:courseId', getCourseLearning);
router.get('/dashboard/stats', getStudentStats);

export default router;

