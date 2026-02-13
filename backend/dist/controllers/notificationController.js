"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllNotificationsRead = exports.markNotificationRead = exports.getNotificationCount = exports.getNotifications = void 0;
const notificationService_1 = require("../services/notificationService");
// Get user's notifications
const getNotifications = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const limit = parseInt(req.query.limit) || 20;
        const notifications = await (0, notificationService_1.getUserNotifications)(userId, limit);
        res.json({
            success: true,
            data: notifications
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch notifications'
        });
    }
};
exports.getNotifications = getNotifications;
// Get unread notification count
const getNotificationCount = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const count = await (0, notificationService_1.getUnreadCount)(userId);
        res.json({
            success: true,
            data: { count }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch notification count'
        });
    }
};
exports.getNotificationCount = getNotificationCount;
// Mark single notification as read
const markNotificationRead = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        await (0, notificationService_1.markAsRead)(id, userId);
        res.json({
            success: true,
            message: 'Notification marked as read'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to mark notification as read'
        });
    }
};
exports.markNotificationRead = markNotificationRead;
// Mark all notifications as read
const markAllNotificationsRead = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        await (0, notificationService_1.markAllAsRead)(userId);
        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to mark notifications as read'
        });
    }
};
exports.markAllNotificationsRead = markAllNotificationsRead;
