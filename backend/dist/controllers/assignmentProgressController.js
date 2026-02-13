"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssignmentProgress = exports.toggleAssignmentCompletion = exports.getCourseAssignments = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
// Get all assignments for a course with student's completion status
const getCourseAssignments = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user?.id;
        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }
        // Get all assignments for the course
        const assignments = await prisma_1.default.assignment.findMany({
            where: { courseId },
            orderBy: { order: 'asc' },
            include: {
                progress: {
                    where: { userId: studentId },
                },
            },
        });
        // Transform to include completion status
        const assignmentsWithProgress = assignments.map((assignment) => ({
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            order: assignment.order,
            content: assignment.content,
            videoUrl: assignment.videoUrl,
            attachmentUrl: assignment.attachmentUrl,
            status: assignment.progress.length > 0 ? assignment.progress[0].status : 'NOT_STARTED',
            isCompleted: assignment.progress.length > 0 ? assignment.progress[0].status === 'COMPLETED' : false,
            completedAt: assignment.progress.length > 0 ? assignment.progress[0].completedAt : null,
        }));
        res.json({
            success: true,
            data: assignmentsWithProgress,
        });
    }
    catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch assignments',
        });
    }
};
exports.getCourseAssignments = getCourseAssignments;
// Toggle assignment completion status
const toggleAssignmentCompletion = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const studentId = req.user?.id;
        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }
        // Check if progress already exists
        const existingProgress = await prisma_1.default.assignmentProgress.findFirst({
            where: {
                assignmentId,
                userId: studentId,
            },
        });
        let progress;
        if (existingProgress) {
            // Toggle completion
            const newStatus = existingProgress.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
            progress = await prisma_1.default.assignmentProgress.update({
                where: { id: existingProgress.id },
                data: {
                    status: newStatus,
                    completedAt: newStatus === 'COMPLETED' ? new Date() : null,
                },
            });
        }
        else {
            // Create new progress entry
            progress = await prisma_1.default.assignmentProgress.create({
                data: {
                    assignmentId,
                    userId: studentId,
                    status: 'COMPLETED',
                    completedAt: new Date(),
                },
            });
        }
        res.json({
            success: true,
            data: progress,
        });
    }
    catch (error) {
        console.error('Error toggling assignment completion:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update assignment progress',
        });
    }
};
exports.toggleAssignmentCompletion = toggleAssignmentCompletion;
// Get student's overall progress across all enrolled courses
const getAssignmentProgress = async (req, res) => {
    try {
        const studentId = req.user?.id;
        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }
        // Get all enrolled courses
        const enrollments = await prisma_1.default.enrollment.findMany({
            where: { userId: studentId },
            include: {
                course: {
                    include: {
                        assignments: {
                            include: {
                                progress: {
                                    where: { userId: studentId },
                                },
                            },
                        },
                    },
                },
            },
        });
        // Calculate progress for each course
        const progressData = enrollments.map((enrollment) => {
            const totalAssignments = enrollment.course.assignments.length;
            const completedAssignments = enrollment.course.assignments.filter((assignment) => assignment.progress.length > 0 && assignment.progress[0].status === 'COMPLETED').length;
            const progressPercentage = totalAssignments > 0
                ? Math.round((completedAssignments / totalAssignments) * 100)
                : 0;
            return {
                courseId: enrollment.course.id,
                courseTitle: enrollment.course.title,
                courseThumbnail: enrollment.course.thumbnail,
                totalAssignments,
                completedAssignments,
                progressPercentage,
            };
        });
        res.json({
            success: true,
            data: progressData,
        });
    }
    catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch progress',
        });
    }
};
exports.getAssignmentProgress = getAssignmentProgress;
