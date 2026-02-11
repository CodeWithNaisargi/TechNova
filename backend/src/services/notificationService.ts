import prisma from '../config/prisma';
import { getSocketInstance } from '../config/socket';

interface CreateNotificationParams {
    userId: string;
    title: string;
    message: string;
    type: 'ASSIGNMENT' | 'COURSE' | 'CERTIFICATE' | 'SYSTEM' | 'RECOMMENDATION';
    link?: string;
}

/**
 * Create a notification and optionally emit real-time event
 * This service is ISOLATED - does not import business logic from other services
 */
export async function createNotification({
    userId,
    title,
    message,
    type,
    link
}: CreateNotificationParams) {
    try {
        const notification = await prisma.notification.create({
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
            const io = getSocketInstance();
            if (io) {
                io.to(`user:${userId}`).emit('notification:new', notification);
            }
        } catch (socketError) {
            // Socket not available - notification still persisted
            console.log('Real-time notification skipped (socket unavailable)');
        }

        return notification;
    } catch (error) {
        // Log error but don't throw - notification failure should not block core logic
        console.error('Failed to create notification:', error);
        return null;
    }
}

/**
 * Get notifications for a user
 */
export async function getUserNotifications(userId: string, limit: number = 20) {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit
    });
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string) {
    return prisma.notification.count({
        where: { userId, isRead: false }
    });
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true }
    });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
    });
}
