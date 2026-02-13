"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstructorAssignments = exports.updateSubmissionStatus = exports.getInstructorSubmissions = exports.getInstructorStats = exports.getInstructorCourses = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
// Get instructor's courses
const getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user?.id;
        const courses = await prisma_1.default.course.findMany({
            where: { instructorId },
            include: {
                _count: {
                    select: {
                        enrollments: true,
                        assignments: true,
                        reviews: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            success: true,
            data: courses,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch courses',
        });
    }
};
exports.getInstructorCourses = getInstructorCourses;
// Get instructor's dashboard stats
const getInstructorStats = async (req, res) => {
    try {
        const instructorId = req.user?.id;
        const [totalCourses, publishedCourses, totalEnrollments, pendingSubmissions,] = await Promise.all([
            prisma_1.default.course.count({ where: { instructorId } }),
            prisma_1.default.course.count({ where: { instructorId, isPublished: true } }),
            prisma_1.default.enrollment.count({
                where: {
                    course: { instructorId }
                }
            }),
            prisma_1.default.submission.count({
                where: {
                    assignment: {
                        course: { instructorId }
                    },
                    status: 'PENDING'
                }
            }),
        ]);
        res.json({
            success: true,
            data: {
                totalCourses,
                publishedCourses,
                totalEnrollments,
                pendingSubmissions,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch statistics',
        });
    }
};
exports.getInstructorStats = getInstructorStats;
// Get instructor's submissions
const getInstructorSubmissions = async (req, res) => {
    try {
        const instructorId = req.user?.id;
        const { status, courseId } = req.query;
        const where = {
            assignment: {
                course: { instructorId }
            }
        };
        if (status) {
            where.status = status;
        }
        if (courseId) {
            where.assignment = {
                ...where.assignment,
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
exports.getInstructorSubmissions = getInstructorSubmissions;
// Update submission status (Instructor)
const updateSubmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, feedback, grade } = req.body;
        const instructorId = req.user?.id;
        // Verify this submission belongs to instructor's course
        const submission = await prisma_1.default.submission.findUnique({
            where: { id },
            include: {
                assignment: {
                    include: {
                        course: true
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
        if (submission.assignment.course.instructorId !== instructorId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to review this submission',
            });
        }
        const updatedSubmission = await prisma_1.default.submission.update({
            where: { id },
            data: {
                status,
                feedback,
                grade: grade ? parseInt(grade) : null,
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
            data: updatedSubmission,
            message: 'Submission updated successfully',
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
// Get instructor's assignments
const getInstructorAssignments = async (req, res) => {
    try {
        const instructorId = req.user?.id;
        const { courseId } = req.query;
        const where = {
            course: { instructorId }
        };
        if (courseId) {
            where.courseId = courseId;
        }
        const assignments = await prisma_1.default.assignment.findMany({
            where,
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
                _count: {
                    select: {
                        submissions: true,
                    }
                }
            },
            orderBy: [
                { courseId: 'asc' },
                { order: 'asc' }
            ]
        });
        res.json({
            success: true,
            data: assignments,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch assignments',
        });
    }
};
exports.getInstructorAssignments = getInstructorAssignments;
