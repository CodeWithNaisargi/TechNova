import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string) => {
    if (socket) {
        return socket;
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

    socket = io(SOCKET_URL, {
        auth: {
            token
        },
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
    });

    socket.on('connect', () => {
        console.log('✅ Socket.io connected');
    });

    socket.on('disconnect', () => {
        console.log('❌ Socket.io disconnected');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket.io connection error:', error);
    });

    return socket;
};

export const getSocket = () => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export default {
    initialize: initializeSocket,
    get: getSocket,
    disconnect: disconnectSocket
};
