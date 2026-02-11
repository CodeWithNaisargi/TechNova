import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import api from '@/services/api';
import { useSocket } from '@/hooks/useSocket';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'ENROLLMENT' | 'PATH' | 'COMPLETION' | 'CERTIFICATE' | 'SYSTEM' | 'ASSIGNMENT';
    link?: string;
    isRead: boolean;
    createdAt: string;
}

export const useNotifications = () => {
    const queryClient = useQueryClient();
    const { socket, isConnected } = useSocket();

    // Fetch Notifications
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await api.get('/notifications');
            return res.data.data as Notification[];
        },
    });

    // Fetch Unread Count
    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['notifications-count'],
        queryFn: async () => {
            const res = await api.get('/notifications/unread-count');
            return res.data.data.count as number;
        },
    });

    // Mark as Read Mutation
    const markAsRead = useMutation({
        mutationFn: async (id: string) => {
            await api.patch(`/notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
        },
    });

    // Mark All as Read Mutation
    const markAllAsRead = useMutation({
        mutationFn: async () => {
            await api.patch('/notifications/read-all');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
        },
    });

    // Listen for real-time notifications
    useEffect(() => {
        if (socket && isConnected) {
            const handleNewNotification = (notification: Notification) => {
                // Update notifications list optimistically or just invalidate
                queryClient.setQueryData(['notifications'], (old: Notification[] = []) => [notification, ...old]);
                queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
            };

            const handleCountUpdate = ({ count }: { count: number }) => {
                queryClient.setQueryData(['notifications-count'], count);
            };

            socket.on('new-notification', handleNewNotification);
            socket.on('notification:count', handleCountUpdate);

            return () => {
                socket.off('new-notification', handleNewNotification);
                socket.off('notification:count', handleCountUpdate);
            };
        }
    }, [socket, isConnected, queryClient]);

    return {
        notifications,
        unreadCount,
        isLoading,
        markAsRead: markAsRead.mutate,
        markAllAsRead: markAllAsRead.mutate,
    };
};
