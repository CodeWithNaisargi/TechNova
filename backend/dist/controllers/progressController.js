"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recalculateProgress = exports.getCourseProgress = exports.updateProgress = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const recommendationService_1 = require("../services/recommendationService");
const notification_service_1 = require("../modules/notification/notification.service");
const client_1 = require("@prisma/client");
// @desc    Update lesson progress
// @route   POST /api/progress
// @access  Private
const updateProgress = async (req, res, next) => {
    try {
        const { lessonId, isCompleted } = req.body;
        const userId = req.user.id;
        const progress = await prisma_1.default.progress.upsert({
            where: {
                userId_lessonId: { userId, lessonId },
            },
            update: { isCompleted },
            create: { userId, lessonId, isCompleted },
        });
        res.json({ success: true, data: progress });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProgress = updateProgress;
// @desc    Get progress for a course (ENHANCED - includes lessons AND assignments)
// @route   GET /api/progress/:courseId
// @access  Private
const getCourseProgress = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;
        // Get all lessons for the course
        const course = await prisma_1.default.course.findUnique({
            where: { id: courseId },
            include: { sections: { include: { lessons: { select: { id: true } } } } }
        });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        const lessonIds = course.sections.flatMap(s => s.lessons.map(l => l.id));
        // Get lesson progress
        const lessonProgress = await prisma_1.default.progress.findMany({
            where: {
                userId,
                lessonId: { in: lessonIds },
            },
        });
        const completedLessons = lessonProgress.filter(p => p.isCompleted).length;
        const totalLessons = lessonIds.length;
        // Get assignment progress
        const assignmentProgress = await prisma_1.default.assignmentProgress.findMany({
            where: {
                userId,
                assignment: {
                    courseId
                }
            },
            include: {
                assignment: {
                    select: { id: true, title: true }
                }
            }
        });
        const completedAssignments = assignmentProgress.filter(p => p.status === 'COMPLETED' || p.status === 'SUBMITTED').length;
        const totalAssignments = assignmentProgress.length;
        // Calculate unified progress
        const totalItems = totalLessons + totalAssignments;
        const completedItems = completedLessons + completedAssignments;
        const percentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
        res.json({
            success: true,
            data: {
                courseId,
                percentage,
                completedLessons,
                totalLessons,
                completedAssignments,
                totalAssignments,
                completedItems,
                totalItems,
                lessonProgress: lessonProgress.map(p => ({
                    lessonId: p.lessonId,
                    isCompleted: p.isCompleted,
                    completedAt: p.completedAt
                })),
                assignmentProgress: assignmentProgress.map(p => ({
                    assignmentId: p.assignmentId,
                    assignmentTitle: p.assignment.title,
                    status: p.status,
                    completedAt: p.completedAt
                }))
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCourseProgress = getCourseProgress;
// @desc    Recalculate progress for a course (trigger certificate generation if 100%)
// @route   POST /api/progress/recalculate/:courseId
// @access  Private
const recalculateProgress = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;
        // Reuse getCourseProgress logic
        const course = await prisma_1.default.course.findUnique({
            where: { id: courseId },
            include: { sections: { include: { lessons: { select: { id: true } } } } }
        });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        const lessonIds = course.sections.flatMap(s => s.lessons.map(l => l.id));
        const lessonProgress = await prisma_1.default.progress.findMany({
            where: { userId, lessonId: { in: lessonIds } },
        });
        const completedLessons = lessonProgress.filter(p => p.isCompleted).length;
        const totalLessons = lessonIds.length;
        const assignmentProgress = await prisma_1.default.assignmentProgress.findMany({
            where: {
                userId,
                assignment: { courseId }
            }
        });
        const completedAssignments = assignmentProgress.filter(p => p.status === 'COMPLETED' || p.status === 'SUBMITTED').length;
        const totalAssignments = assignmentProgress.length;
        const totalItems = totalLessons + totalAssignments;
        const completedItems = completedLessons + completedAssignments;
        const percentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
        // If 100% complete, trigger certificate generation AND skill inference
        if (percentage === 100) {
            const user = await prisma_1.default.user.findUnique({
                where: { id: userId },
                select: { name: true }
            });
            if (user) {
                const certificateId = `CERT-${new Date().getFullYear()}-${courseId.substring(0, 8).toUpperCase()}-${userId.substring(0, 6).toUpperCase()}`;
                await prisma_1.default.certificate.upsert({
                    where: {
                        userId_courseId: { userId, courseId }
                    },
                    update: {
                        completionPercentage: percentage
                    },
                    create: {
                        userId,
                        courseId,
                        courseName: course.title,
                        studentName: user.name,
                        certificateId,
                        completionPercentage: percentage
                    }
                });
                // Trigger notification
                await (0, notification_service_1.createNotification)({
                    userId,
                    title: 'Course Completed!',
                    message: `Congratulations! You have successfully completed ${course.title}. Your certificate is ready!`,
                    type: client_1.NotificationType.COMPLETION,
                    link: `/certificates`
                });
                // Infer skills from course completion
                await (0, recommendationService_1.inferSkillsFromCourseCompletion)(userId, courseId);
                console.log(`🧠 Skills inferred for user ${userId} from course ${courseId}`);
            }
        }
        res.json({
            success: true,
            data: {
                percentage,
                completedLessons,
                totalLessons,
                completedAssignments,
                totalAssignments,
                certificateGenerated: percentage === 100
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.recalculateProgress = recalculateProgress;
