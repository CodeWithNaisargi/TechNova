import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@/services/socket';

export const useSocket = (event?: string, handler?: (data: any) => void) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = getSocket();
        setSocket(socketInstance);

        if (socketInstance) {
            setIsConnected(socketInstance.connected);

            socketInstance.on('connect', () => setIsConnected(true));
            socketInstance.on('disconnect', () => setIsConnected(false));

            if (event && handler) {
                socketInstance.on(event, handler);
            }

            return () => {
                if (event && handler) {
                    socketInstance.off(event, handler);
                }
                socketInstance.off('connect');
                socketInstance.off('disconnect');
            };
        }
    }, [event, handler]);

    const emit = (eventName: string, data: any) => {
        if (socket) {
            socket.emit(eventName, data);
        }
    };

    return { socket, isConnected, emit };
};
