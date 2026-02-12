import express from 'express';
import {
    generateCertificate,
    getMyCertificates,
    getCertificateById,
    downloadCertificate,
    verifyCertificate
} from '../controllers/certificateController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Protected routes
router.post('/generate/:courseId', protect, generateCertificate);
router.get('/my', protect, getMyCertificates);
router.get('/my-certificates', protect, getMyCertificates);
router.get('/download/:courseId', protect, downloadCertificate);
router.get('/:certificateId', getCertificateById);

// Public route for verification
router.get('/verify/:certificateId', verifyCertificate);

export default router;
