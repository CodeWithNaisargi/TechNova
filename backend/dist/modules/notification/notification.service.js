"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserNotifications = getUserNotifications;
exports.getUnreadCount = getUnreadCount;
exports.markAsRead = markAsRead;
exports.markAllAsRead = markAllAsRead;
exports.createNotification = createNotification;
const prisma_1 = __importDefault(require("../../config/prisma"));
const socket_1 = require("../../config/socket");
/**
 * Get notifications for a user
 */
async function getUserNotifications(userId, limit = 20) {
    return prisma_1.default.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit
    });
}
/**
 * Get unread notification count
 */
async function getUnreadCount(userId) {
    return prisma_1.default.notification.count({
        where: { userId, isRead: false }
    });
}
/**
 * Mark notification as read
 */
async function markAsRead(notificationId, userId) {
    return prisma_1.default.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true }
    });
}
/**
 * Mark all notifications as read for a user
 */
async function markAllAsRead(userId) {
    return prisma_1.default.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
    });
}
/**
 * Create a notification and optionally emit real-time event
 */
async function createNotification({ userId, title, message, type, link }) {
    try {
        const notification = await prisma_1.default.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                link
            }
        });
        // Emit real-time notification
        try {
            const io = (0, socket_1.getSocketInstance)();
            if (io) {
                // Emit to specific user room
                io.to(`user:${userId}`).emit('new-notification', notification);
                // Also emit specific unread count update for UI badge
                const unreadCount = await getUnreadCount(userId);
                io.to(`user:${userId}`).emit('notification:count', { count: unreadCount });
            }
        }
        catch (socketError) {
            console.error('Socket emission failed:', socketError);
        }
        return notification;
    }
    catch (error) {
        console.error('Failed to create notification:', error);
        return null;
    }
}
