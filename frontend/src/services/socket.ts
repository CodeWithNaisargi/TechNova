import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token?: string) => {
    if (socket) {
        return socket;
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

    // Configure socket connection
    // Cookies (including accessToken) are sent automatically with withCredentials
    const socketConfig: any = {
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        withCredentials: true, // Send cookies automatically
    };

    // Only add auth token if provided (for cases where token is passed explicitly)
    if (token) {
        socketConfig.auth = { token };
    }

    socket = io(SOCKET_URL, socketConfig);

    socket.on('connect', () => {
        if (import.meta.env.DEV) {
            console.log('✅ Socket.io connected');
        }
    });

    socket.on('disconnect', () => {
        if (import.meta.env.DEV) {
            console.log('❌ Socket.io disconnected');
        }
    });

    socket.on('connect_error', (error) => {
        // Only log connection errors in development
        if (import.meta.env.DEV) {
            console.error('Socket.io connection error:', error);
        }
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
