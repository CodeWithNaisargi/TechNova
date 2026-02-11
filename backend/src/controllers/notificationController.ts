import { Request, Response } from 'express';
import {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
} from '../services/notificationService';

// Get user's notifications
export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const limit = parseInt(req.query.limit as string) || 20;
        const notifications = await getUserNotifications(userId, limit);

        res.json({
            success: true,
            data: notifications
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch notifications'
        });
    }
};

// Get unread notification count
export const getNotificationCount = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const count = await getUnreadCount(userId);

        res.json({
            success: true,
            data: { count }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch notification count'
        });
    }
};

// Mark single notification as read
export const markNotificationRead = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        await markAsRead(id, userId);

        res.json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to mark notification as read'
        });
    }
};

// Mark all notifications as read
export const markAllNotificationsRead = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        await markAllAsRead(userId);

        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to mark notifications as read'
        });
    }
};
