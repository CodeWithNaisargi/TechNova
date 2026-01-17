import express from 'express';
import {
    createReview,
    updateReview,
    deleteReview,
    getCourseReviews
} from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/course/:courseId', getCourseReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;

