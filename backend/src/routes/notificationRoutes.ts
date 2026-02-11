import express from 'express';
import {
    getNotifications,
    getNotificationCount,
    markNotificationRead,
    markAllNotificationsRead
} from '../controllers/notificationController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/notifications - Fetch user's notifications
router.get('/', getNotifications);

// GET /api/notifications/unread-count - Get unread count for badge
router.get('/unread-count', getNotificationCount);

// PUT /api/notifications/read-all - Mark all as read
router.put('/read-all', markAllNotificationsRead);

// PUT /api/notifications/:id/read - Mark single as read
router.put('/:id/read', markNotificationRead);

export default router;
