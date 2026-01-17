"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./types/express.d.ts" />
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const enrollmentRoutes_1 = __importDefault(require("./routes/enrollmentRoutes"));
const progressRoutes_1 = __importDefault(require("./routes/progressRoutes"));
const instructorRoutes_1 = __importDefault(require("./routes/instructorRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const attachmentRoutes_1 = __importDefault(require("./routes/attachmentRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
}));
// STRICT CORS CONFIGURATION
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Serve static files (uploads)
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/courses', courseRoutes_1.default);
app.use('/api/enrollments', enrollmentRoutes_1.default);
app.use('/api/progress', progressRoutes_1.default);
app.use('/api/instructor', instructorRoutes_1.default);
app.use('/api/student', studentRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/attachments', attachmentRoutes_1.default);
app.get('/', (req, res) => {
    res.send('LMS API is running...');
});
// Error Handling Middleware
app.use((err, req, res, next) => {
    // Handle multer errors
    if (err instanceof Error && err.message.includes('MulterError')) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'File upload error: ' + err.message,
        });
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error(err);
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
