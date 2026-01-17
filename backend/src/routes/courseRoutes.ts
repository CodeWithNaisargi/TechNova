import express from 'express';
import {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    addSection,
    addLesson,
    getPopularCourses,
    getNewCourses,
    getCategories
} from '../controllers/courseController';

import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roles';
import { Role } from '@prisma/client';
import { uploadThumbnail, uploadAttachment } from '../middleware/upload';

const router = express.Router();

// Public routes - MUST come before /:id route
router.get('/popular', getPopularCourses);
router.get('/new', getNewCourses);
router.get('/categories', getCategories);

router.route('/')
    .get(getCourses)
    .post(protect, authorize(Role.INSTRUCTOR, Role.ADMIN), uploadThumbnail, createCourse);

router.route('/:id')
    .get(getCourseById)
    .put(protect, authorize(Role.INSTRUCTOR, Role.ADMIN), uploadThumbnail, updateCourse)
    .delete(protect, authorize(Role.INSTRUCTOR, Role.ADMIN), deleteCourse);

router.post('/:id/sections', protect, authorize(Role.INSTRUCTOR, Role.ADMIN), addSection);
// Added uploadAttachment middleware to parse FormData with optional file attachment
router.post('/sections/:id/lessons', protect, authorize(Role.INSTRUCTOR, Role.ADMIN), uploadAttachment, addLesson);

export default router;
