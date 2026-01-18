import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    id: string;
    role: string;
}

/**
 * Parse cookies from Socket.io handshake headers
 */
const parseCookies = (cookieHeader: string | undefined): Record<string, string> => {
    if (!cookieHeader) return {};
    // Manual cookie parsing since we're having import issues
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach(cookie => {
        const [name, ...rest] = cookie.split('=');
        if (name && rest) {
            cookies[name.trim()] = decodeURIComponent(rest.join('=').trim());
        }
    });
    return cookies;
};

export const initializeSocket = (httpServer: HTTPServer) => {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: [
                process.env.FRONTEND_URL || 'http://localhost:5174',
                'http://localhost:5175',
                'http://localhost:5176',
            ],
            credentials: true,
            methods: ['GET', 'POST']
        }
    });

    // Authentication middleware for Socket.io
    io.use((socket, next) => {
        // Try to get token from auth object first (explicit token)
        let token = socket.handshake.auth.token;

        // If no token in auth, try to get from cookies
        if (!token) {
            const cookies = parseCookies(socket.handshake.headers.cookie);
            token = cookies.accessToken;
        }

        // If still no token, allow connection without authentication
        // This enables socket connection for unauthenticated users (optional feature)
        if (!token) {
            // For unauthenticated users, we can either:
            // Option 1: Reject connection (strict mode)
            // Option 2: Allow connection but mark as guest (flexible mode)

            // Using flexible mode - allow connection but no user-specific features
            socket.data.userId = null;
            socket.data.role = 'GUEST';
            socket.data.authenticated = false;
            return next();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
            socket.data.userId = decoded.id;
            socket.data.role = decoded.role;
            socket.data.authenticated = true;
            next();
        } catch (err) {
            // Invalid token - still allow connection as guest
            socket.data.userId = null;
            socket.data.role = 'GUEST';
            socket.data.authenticated = false;
            next();
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        const authenticated = socket.data.authenticated;

        if (authenticated && userId) {
            console.log(`✅ User connected: ${userId}`);
            // Join user-specific room only for authenticated users
            socket.join(`user:${userId}`);
        } else {
            console.log(`👤 Guest socket connected`);
        }

        // Handle course-specific rooms (only for authenticated users)
        socket.on('join:course', (courseId: string) => {
            if (socket.data.authenticated) {
                socket.join(`course:${courseId}`);
                console.log(`User ${userId} joined course ${courseId}`);
            }
        });

        socket.on('leave:course', (courseId: string) => {
            if (socket.data.authenticated) {
                socket.leave(`course:${courseId}`);
                console.log(`User ${userId} left course ${courseId}`);
            }
        });

        socket.on('disconnect', () => {
            if (socket.data.authenticated && userId) {
                console.log(`❌ User disconnected: ${userId}`);
            }
        });
    });

    return io;
};

// Export socket instance for use in controllers
export let io: SocketIOServer;

export const setSocketInstance = (socketInstance: SocketIOServer) => {
    io = socketInstance;
};

export const getSocketInstance = () => {
    return io;
};
