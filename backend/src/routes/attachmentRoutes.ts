import express from 'express';
import { addAttachment, deleteAttachment, uploadFile } from '../controllers/attachmentController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roles';
import { Role } from '@prisma/client';
import { uploadAttachment } from '../middleware/upload';

const router = express.Router();

router.use(protect);
// Allow students to upload files for assignment submissions
router.use(authorize(Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN));

router.post('/', uploadAttachment, addAttachment);
router.post('/upload', uploadAttachment, uploadFile); // Simple upload for students
router.delete('/:id', deleteAttachment);

export default router;

