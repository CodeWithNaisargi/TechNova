"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSubmissions = exports.updateSubmissionStatus = exports.getAssignmentSubmissions = exports.getSubmissionById = exports.getMySubmissions = exports.submitAssignment = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const notification_service_1 = require("../modules/notification/notification.service");
const client_1 = require("@prisma/client");
// Submit assignment (Student)
const submitAssignment = async (req, res) => {
    try {
        const { assignmentId, fileUrl } = req.body;
        const studentId = req.user?.id;
        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }
        // Check if assignment exists
        const assignment = await prisma_1.default.assignment.findUnique({
            where: { id: assignmentId },
            include: { course: true }
        });
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found',
            });
        }
        // Create or update submission
        const submission = await prisma_1.default.submission.upsert({
            where: {
                assignmentId_studentId: {
                    assignmentId,
                    studentId,
                }
            },
            update: {
                fileUrl,
                status: 'PENDING',
                submittedAt: new Date(),
            },
            create: {
                assignmentId,
                studentId,
                fileUrl,
                status: 'PENDING',
            },
            include: {
                assignment: {
                    select: {
                        title: true,
                        courseId: true,
                    }
                }
            }
        });
        // Update assignment progress to SUBMITTED
        await prisma_1.default.assignmentProgress.upsert({
            where: {
                userId_assignmentId: {
                    userId: studentId,
                    assignmentId,
                }
            },
            update: {
                status: 'SUBMITTED',
                completedAt: new Date(),
            },
            create: {
                userId: studentId,
                assignmentId,
                status: 'SUBMITTED',
                completedAt: new Date(),
            }
        });
        // Trigger notification for student
        await (0, notification_service_1.createNotification)({
            userId: studentId,
            title: 'Assignment Submitted',
            message: `Your submission for ${assignment.title} has been received.`,
            type: client_1.NotificationType.ASSIGNMENT,
            link: `/student/course/${assignment.courseId}/progress`
        });
        // Trigger notification for instructor
        const instructorId = assignment.course.instructorId;
        await (0, notification_service_1.createNotification)({
            userId: instructorId,
            title: 'New Assignment Submission',
            message: `A student has submitted an assignment for ${assignment.course.title}.`,
            type: client_1.NotificationType.ASSIGNMENT,
            link: `/instructor/courses/${assignment.courseId}/submissions`
        });
        // Recalculate course progress
        const courseId = submission.assignment.courseId;
        // Get all lessons for this course
        const lessons = await prisma_1.default.lesson.findMany({
            where: {
                section: {
                    courseId
                }
            }
        });
        // Get completed lessons count
        const completedLessons = await prisma_1.default.progress.count({
            where: {
                userId: studentId,
                lesson: {
                    section: {
                        courseId
                    }
                },
                isCompleted: true
            }
        });
        // Get all assignments for this course
        const assignments = await prisma_1.default.assignment.findMany({
            where: { courseId }
        });
        // Get completed assignments count (SUBMITTED status counts as completed)
        const completedAssignments = await prisma_1.default.assignmentProgress.count({
            where: {
                userId: studentId,
                assignment: {
                    courseId
                },
                status: 'SUBMITTED'
            }
        });
        // Calculate unified progress
        const totalItems = lessons.length + assignments.length;
        const completedItems = completedLessons + completedAssignments;
        const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        // Emit Socket.io event for real-time dashboard update
        const io = req.app.get('io');
        if (io) {
            io.to(`user:${studentId}`).emit('progress:updated', {
                userId: studentId,
                courseId,
                progressPercentage,
                completedLessons,
                totalLessons: lessons.length,
                completedAssignments,
                totalAssignments: assignments.length
            });
        }
        res.status(201).json({
            success: true,
            data: submission,
            message: 'Assignment submitted successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to submit assignment',
        });
    }
};
exports.submitAssignment = submitAssignment;
// Get student's submissions
const getMySubmissions = async (req, res) => {
    try {
        const studentId = req.user?.id;
        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }
        const submissions = await prisma_1.default.submission.findMany({
            where: { studentId },
            include: {
                assignment: {
                    select: {
                        id: true,
                        title: true,
                        courseId: true,
                        course: {
                            select: {
                                title: true,
                                thumbnail: true,
                            }
                        }
                    }
                }
            },
            orderBy: { submittedAt: 'desc' }
        });
        res.json({
            success: true,
            data: submissions,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch submissions',
        });
    }
};
exports.getMySubmissions = getMySubmissions;
// Get submission by ID
const getSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const submission = await prisma_1.default.submission.findUnique({
            where: { id },
            include: {
                assignment: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        courseId: true,
                    }
                },
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found',
            });
        }
        res.json({
            success: true,
            data: submission,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch submission',
        });
    }
};
exports.getSubmissionById = getSubmissionById;
// Get all submissions for an assignment (Admin/Instructor)
const getAssignmentSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const submissions = await prisma_1.default.submission.findMany({
            where: { assignmentId },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: { submittedAt: 'desc' }
        });
        res.json({
            success: true,
            data: submissions,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch submissions',
        });
    }
};
exports.getAssignmentSubmissions = getAssignmentSubmissions;
// Update submission status (Admin/Instructor)
const updateSubmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, feedback, grade } = req.body;
        const submission = await prisma_1.default.submission.update({
            where: { id },
            data: {
                status,
                feedback,
                grade,
            },
            include: {
                student: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                assignment: {
                    select: {
                        title: true,
                    }
                }
            }
        });
        res.json({
            success: true,
            data: submission,
            message: 'Submission status updated successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update submission',
        });
    }
};
exports.updateSubmissionStatus = updateSubmissionStatus;
// Get all submissions (Admin)
const getAllSubmissions = async (req, res) => {
    try {
        const { status, courseId } = req.query;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (courseId) {
            where.assignment = {
                courseId: courseId
            };
        }
        const submissions = await prisma_1.default.submission.findMany({
            where,
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                assignment: {
                    select: {
                        id: true,
                        title: true,
                        courseId: true,
                        course: {
                            select: {
                                title: true,
                            }
                        }
                    }
                }
            },
            orderBy: { submittedAt: 'desc' }
        });
        res.json({
            success: true,
            data: submissions,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch submissions',
        });
    }
};
exports.getAllSubmissions = getAllSubmissions;
