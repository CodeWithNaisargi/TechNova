import prisma from '../../config/prisma';
import { getSocketInstance } from '../../config/socket';
import { NotificationType } from '@prisma/client';

interface CreateNotificationParams {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
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

/**
 * Create a notification and optionally emit real-time event
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
                link
            }
        });

        // Emit real-time notification
        try {
            const io = getSocketInstance();
            if (io) {
                // Emit to specific user room
                io.to(`user:${userId}`).emit('new-notification', notification);

                // Also emit specific unread count update for UI badge
                const unreadCount = await getUnreadCount(userId);
                io.to(`user:${userId}`).emit('notification:count', { count: unreadCount });
            }
        } catch (socketError) {
            console.error('Socket emission failed:', socketError);
        }

        return notification;
    } catch (error) {
        console.error('Failed to create notification:', error);
        return null;
    }
}
