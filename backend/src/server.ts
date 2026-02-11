import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";
import { initializeSocket, setSocketInstance } from "./config/socket";

// Routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import courseRoutes from "./routes/courseRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";
import progressRoutes from "./routes/progressRoutes";
import instructorRoutes from "./routes/instructorRoutes";
import studentRoutes from "./routes/studentRoutes";
import studentDashboardRoutes from "./routes/student/dashboardRoutes";
import adminRoutes from "./routes/adminRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import attachmentRoutes from "./routes/attachmentRoutes";
import assignmentRoutes from "./routes/assignmentRoutes";
import submissionRoutes from "./routes/submissionRoutes";
import certificateRoutes from "./routes/certificateRoutes";
import assignmentProgressRoutes from "./routes/assignmentProgressRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import careerPathRoutes from "./routes/careerPathRoutes";
import educationRoutes from "./routes/educationRoutes";
import recommendationRoutes from "./routes/recommendationRoutes";
import notificationRoutes from "./modules/notification/notification.routes";
import insightsRoutes from "./routes/insightsRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Create HTTP server for Socket.io
const httpServer = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(httpServer);
setSocketInstance(io);

// -----------------------------------
// CORS (MUST come before body parsers)
// -----------------------------------
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// -----------------------------------
// HELMET (security)
// -----------------------------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

// -----------------------------------
// Body parsers
// -----------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Logger
app.use(morgan("dev"));

// -----------------------------------
// STATIC FILES (IMPORTANT ORDER)
// Must be BEFORE routes
// -----------------------------------
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5174");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


// -----------------------------------
// API Routes
// -----------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", settingsRoutes); // User settings routes
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/student", studentDashboardRoutes); // Student dashboard endpoint
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/assignments", assignmentProgressRoutes); // Assignment progress tracking
app.use("/api/submissions", submissionRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/career-paths", careerPathRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/insights", insightsRoutes);

// -----------------------------------
// Root route
// -----------------------------------
app.get("/", (_req: Request, res: Response) => {
  res.send("LMS API is running with Socket.io...");
});

// -----------------------------------
// Global Error Handler
// -----------------------------------
app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
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
  }
);

// -----------------------------------
// Start Server with Socket.io
// -----------------------------------
httpServer.listen(PORT, () => {
  console.log(`🚀 LMS Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.io server initialized`);
});

// Export io for use in controllers
export { io };
