"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../../config/prisma"));
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/student/dashboard
router.get("/dashboard", auth_1.protect, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        // Total enrolled courses
        const totalEnrolledCourses = await prisma_1.default.enrollment.count({
            where: { userId }
        });
        // Completed assignments
        const completedAssignments = await prisma_1.default.submission.count({
            where: {
                studentId: userId,
                status: "APPROVED"
            }
        });
        // Pending assignments
        const pendingAssignments = await prisma_1.default.submission.count({
            where: {
                studentId: userId,
                status: "PENDING"
            }
        });
        // Certificates (courses with all assignments approved)
        const enrollments = await prisma_1.default.enrollment.findMany({
            where: { userId },
            select: { courseId: true }
        });
        let certificates = 0;
        for (const { courseId } of enrollments) {
            const assignments = await prisma_1.default.assignment.findMany({
                where: { courseId },
                select: { id: true }
            });
            if (assignments.length === 0)
                continue;
            const approved = await prisma_1.default.submission.count({
                where: {
                    studentId: userId,
                    assignmentId: { in: assignments.map(a => a.id) },
                    status: "APPROVED"
                }
            });
            if (approved === assignments.length) {
                certificates++;
            }
        }
        return res.json({
            totalEnrolledCourses: totalEnrolledCourses ?? 0,
            completedAssignments: completedAssignments ?? 0,
            pendingAssignments: pendingAssignments ?? 0,
            certificates: certificates ?? 0
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
