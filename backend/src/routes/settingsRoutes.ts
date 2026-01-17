import express from 'express';
import {
    getUserSettings,
    updateSettings,
    updateProfile,
    changePassword,
    exportUserData,
    deleteAccount
} from '../controllers/settingsController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.get('/settings', protect, getUserSettings);
router.patch('/settings', protect, updateSettings);
router.patch('/profile', protect, updateProfile);
router.patch('/password', protect, changePassword);
router.get('/export', protect, exportUserData);
router.delete('/account', protect, deleteAccount);

export default router;
