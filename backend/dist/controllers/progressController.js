"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseProgress = exports.updateProgress = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
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
// @desc    Get progress for a course
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
        if (!course)
            return res.status(404).json({ success: false, message: 'Course not found' });
        const lessonIds = course.sections.flatMap(s => s.lessons.map(l => l.id));
        const progress = await prisma_1.default.progress.findMany({
            where: {
                userId,
                lessonId: { in: lessonIds },
            },
        });
        const completedCount = progress.filter(p => p.isCompleted).length;
        const totalLessons = lessonIds.length;
        const percentage = totalLessons === 0 ? 0 : (completedCount / totalLessons) * 100;
        res.json({
            success: true,
            data: {
                completedLessons: progress.map(p => p.lessonId),
                percentage,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCourseProgress = getCourseProgress;
