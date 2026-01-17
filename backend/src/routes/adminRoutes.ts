import express from "express";
import {
    getAllCourses,
    updateCoursePrice,
    toggleCoursePublish,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getPlatformStats,
    getAllAssignments,
    deleteAssignment,
} from "../controllers/adminController";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/roles";
import { Role } from "@prisma/client";

const router = express.Router();

// Protect all admin routes + role check
router.use(protect);
router.use(authorize(Role.ADMIN));

// Platform statistics
router.get("/stats", getPlatformStats);

// Course management
router.get("/courses", getAllCourses);
router.patch("/courses/:id/price", updateCoursePrice);
router.patch("/courses/:id/publish", toggleCoursePublish);

// User management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Assignment management
router.get("/assignments", getAllAssignments);
router.delete("/assignments/:id", deleteAssignment);

export default router;
