"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const socket_1 = require("./config/socket");
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const enrollmentRoutes_1 = __importDefault(require("./routes/enrollmentRoutes"));
const progressRoutes_1 = __importDefault(require("./routes/progressRoutes"));
const instructorRoutes_1 = __importDefault(require("./routes/instructorRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/student/dashboardRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const attachmentRoutes_1 = __importDefault(require("./routes/attachmentRoutes"));
const assignmentRoutes_1 = __importDefault(require("./routes/assignmentRoutes"));
const submissionRoutes_1 = __importDefault(require("./routes/submissionRoutes"));
const certificateRoutes_1 = __importDefault(require("./routes/certificateRoutes"));
const assignmentProgressRoutes_1 = __importDefault(require("./routes/assignmentProgressRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const careerPathRoutes_1 = __importDefault(require("./routes/careerPathRoutes"));
const educationRoutes_1 = __importDefault(require("./routes/educationRoutes"));
const recommendationRoutes_1 = __importDefault(require("./routes/recommendationRoutes"));
const notification_routes_1 = __importDefault(require("./modules/notification/notification.routes"));
const insightsRoutes_1 = __importDefault(require("./routes/insightsRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Create HTTP server for Socket.io
const httpServer = http_1.default.createServer(app);
// Initialize Socket.io
const io = (0, socket_1.initializeSocket)(httpServer);
exports.io = io;
(0, socket_1.setSocketInstance)(io);
// -----------------------------------
// CORS (MUST come before body parsers)
// -----------------------------------
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// -----------------------------------
// HELMET (security)
// -----------------------------------
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
}));
// -----------------------------------
// Body parsers
// -----------------------------------
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Cookies
app.use((0, cookie_parser_1.default)());
// Logger
app.use((0, morgan_1.default)("dev"));
// -----------------------------------
// STATIC FILES (IMPORTANT ORDER)
// Must be BEFORE routes
// -----------------------------------
app.use("/uploads", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5174");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
// -----------------------------------
// API Routes
// -----------------------------------
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/users", settingsRoutes_1.default); // User settings routes
app.use("/api/courses", courseRoutes_1.default);
app.use("/api/enrollments", enrollmentRoutes_1.default);
app.use("/api/progress", progressRoutes_1.default);
app.use("/api/instructor", instructorRoutes_1.default);
app.use("/api/student", studentRoutes_1.default);
app.use("/api/student", dashboardRoutes_1.default); // Student dashboard endpoint
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/reviews", reviewRoutes_1.default);
app.use("/api/attachments", attachmentRoutes_1.default);
app.use("/api/assignments", assignmentRoutes_1.default);
app.use("/api/assignments", assignmentProgressRoutes_1.default); // Assignment progress tracking
app.use("/api/submissions", submissionRoutes_1.default);
app.use("/api/certificates", certificateRoutes_1.default);
app.use("/api/career-paths", careerPathRoutes_1.default);
app.use("/api/education", educationRoutes_1.default);
app.use("/api/recommendations", recommendationRoutes_1.default);
app.use("/api/notifications", notification_routes_1.default);
app.use("/api/insights", insightsRoutes_1.default);
// -----------------------------------
// Root route
// -----------------------------------
app.get("/", (_req, res) => {
    res.send("LMS API is running with Socket.io...");
});
// -----------------------------------
// Global Error Handler
// -----------------------------------
app.use((err, req, res, next) => {
    // Multer file upload errors
    if (err.message?.includes("MulterError")) {
        return res.status(400).json({
            success: false,
            message: "File upload error: " + err.message,
        });
    }
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});
// -----------------------------------
// Start Server with Socket.io
// -----------------------------------
httpServer.listen(PORT, () => {
    console.log(`🚀 LMS Server running on http://localhost:${PORT}`);
    console.log(`🔌 Socket.io server initialized`);
});
