import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    id: string;
    role: string;
}

export const initializeSocket = (httpServer: HTTPServer) => {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5174',
            credentials: true,
            methods: ['GET', 'POST']
        }
    });

    // Authentication middleware for Socket.io
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
            socket.data.userId = decoded.id;
            socket.data.role = decoded.role;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        console.log(`✅ User connected: ${userId}`);

        // Join user-specific room
        socket.join(`user:${userId}`);

        // Handle course-specific rooms
        socket.on('join:course', (courseId: string) => {
            socket.join(`course:${courseId}`);
            console.log(`User ${userId} joined course ${courseId}`);
        });

        socket.on('leave:course', (courseId: string) => {
            socket.leave(`course:${courseId}`);
            console.log(`User ${userId} left course ${courseId}`);
        });

        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${userId}`);
        });
    });

    return io;
};

// Export socket instance for use in controllers
export let io: SocketIOServer;

export const setSocketInstance = (socketInstance: SocketIOServer) => {
    io = socketInstance;
};
