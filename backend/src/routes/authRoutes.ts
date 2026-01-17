import express from 'express';
import { register, login, logout, refreshToken, getMe, verifyEmail, resendVerification } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get('/me', protect, getMe);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

export default router;
