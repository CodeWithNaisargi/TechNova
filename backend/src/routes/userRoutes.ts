import express from 'express';
import { getUsers, getUserById, updateProfile, updateUserRole, toggleBlockUser } from '../controllers/userController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roles';
import { Role } from '@prisma/client';

const router = express.Router();

router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/', protect, authorize(Role.ADMIN), getUsers);
router.get('/:id', protect, authorize(Role.ADMIN), getUserById);
router.put('/:id/role', protect, authorize(Role.ADMIN), updateUserRole);
router.put('/:id/block', protect, authorize(Role.ADMIN), toggleBlockUser);

export default router;
