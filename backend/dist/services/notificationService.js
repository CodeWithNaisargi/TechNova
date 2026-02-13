"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
exports.getUserNotifications = getUserNotifications;
exports.getUnreadCount = getUnreadCount;
exports.markAsRead = markAsRead;
exports.markAllAsRead = markAllAsRead;
const prisma_1 = __importDefault(require("../config/prisma"));
const socket_1 = require("../config/socket");
/**
 * Create a notification and optionally emit real-time event
 * This service is ISOLATED - does not import business logic from other services
 */
async function createNotification({ userId, title, message, type, link }) {
    try {
        const notification = await prisma_1.default.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                // Link field is optional - only include if database supports it
                ...(link && { link })
            }
        });
        // Emit real-time notification if socket is available
        try {
            const io = (0, socket_1.getSocketInstance)();
            if (io) {
                io.to(`user:${userId}`).emit('notification:new', notification);
            }
        }
        catch (socketError) {
            // Socket not available - notification still persisted
            console.log('Real-time notification skipped (socket unavailable)');
        }
        return notification;
    }
    catch (error) {
        // Log error but don't throw - notification failure should not block core logic
        console.error('Failed to create notification:', error);
        return null;
    }
}
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
