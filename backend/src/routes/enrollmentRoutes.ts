import express from 'express';
import { enrollCourse, getMyEnrollments, checkEnrollment } from '../controllers/enrollmentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, enrollCourse);
router.get('/my', protect, getMyEnrollments);
router.get('/check/:courseId', protect, checkEnrollment);

export default router;
