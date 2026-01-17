"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseProgress = exports.reorderSections = exports.togglePublish = exports.deleteLesson = exports.updateLesson = exports.deleteSection = exports.updateSection = exports.getDashboardStats = exports.getMyCourses = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
// Get instructor's courses
const getMyCourses = async (req, res, next) => {
    try {
        const courses = await prisma_1.default.course.findMany({
            where: { instructorId: req.user.id },
            include: {
                sections: {
                    include: { lessons: true },
                    orderBy: { order: 'asc' }
                },
                enrollments: true,
                reviews: true,
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: courses });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyCourses = getMyCourses;
// Get instructor dashboard stats
const getDashboardStats = async (req, res, next) => {
    try {
        const courses = await prisma_1.default.course.findMany({
            where: { instructorId: req.user.id },
            include: {
                enrollments: true,
                reviews: true,
            }
        });
        const totalStudents = new Set(courses.flatMap(c => c.enrollments.map(e => e.userId))).size;
        const totalRevenue = courses.reduce((sum, course) => {
            return sum + (course.price * course.enrollments.length);
        }, 0);
        const totalCourses = courses.length;
        const publishedCourses = courses.filter(c => c.isPublished).length;
        const averageRating = courses.length > 0
            ? courses.reduce((sum, course) => {
                const avg = course.reviews.length > 0
                    ? course.reviews.reduce((s, r) => s + r.rating, 0) / course.reviews.length
                    : 0;
                return sum + avg;
            }, 0) / courses.length
            : 0;
        res.json({
            success: true,
            data: {
                totalStudents,
                totalRevenue,
                totalCourses,
                publishedCourses,
                averageRating: Math.round(averageRating * 10) / 10,
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
// Update section
const updateSection = async (req, res, next) => {
    try {
        const { title, order } = req.body;
        const section = await prisma_1.default.section.findUnique({
            where: { id: req.params.id },
            include: { course: true }
        });
        if (!section) {
            return res.status(404).json({ success: false, message: 'Section not found' });
        }
        if (section.course.instructorId !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const updated = await prisma_1.default.section.update({
            where: { id: req.params.id },
            data: { title, order }
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSection = updateSection;
// Delete section
const deleteSection = async (req, res, next) => {
    try {
        const section = await prisma_1.default.section.findUnique({
            where: { id: req.params.id },
            include: { course: true }
        });
        if (!section) {
            return res.status(404).json({ success: false, message: 'Section not found' });
        }
        if (section.course.instructorId !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        await prisma_1.default.section.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Section deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSection = deleteSection;
// Update lesson
const updateLesson = async (req, res, next) => {
    try {
        const { title, description, videoUrl, isFree, order } = req.body;
        const lesson = await prisma_1.default.lesson.findUnique({
            where: { id: req.params.id },
            include: { section: { include: { course: true } } }
        });
        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }
        if (lesson.section.course.instructorId !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const updated = await prisma_1.default.lesson.update({
            where: { id: req.params.id },
            data: { title, description, videoUrl, isFree, order }
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.updateLesson = updateLesson;
// Delete lesson
const deleteLesson = async (req, res, next) => {
    try {
        const lesson = await prisma_1.default.lesson.findUnique({
            where: { id: req.params.id },
            include: { section: { include: { course: true } } }
        });
        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }
        if (lesson.section.course.instructorId !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        await prisma_1.default.lesson.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Lesson deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteLesson = deleteLesson;
// Publish/Unpublish course
const togglePublish = async (req, res, next) => {
    try {
        const course = await prisma_1.default.course.findUnique({ where: { id: req.params.id } });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        if (course.instructorId !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const updated = await prisma_1.default.course.update({
            where: { id: req.params.id },
            data: { isPublished: !course.isPublished }
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.togglePublish = togglePublish;
// Reorder sections
const reorderSections = async (req, res, next) => {
    try {
        const { sectionIds } = req.body; // Array of section IDs in new order
        const course = await prisma_1.default.course.findUnique({ where: { id: req.params.id } });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        if (course.instructorId !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        // Update order for each section
        await Promise.all(sectionIds.map((sectionId, index) => prisma_1.default.section.update({
            where: { id: sectionId },
            data: { order: index + 1 }
        })));
        res.json({ success: true, message: 'Sections reordered' });
    }
    catch (error) {
        next(error);
    }
};
exports.reorderSections = reorderSections;
// Get student progress for a course
const getCourseProgress = async (req, res, next) => {
    try {
        const course = await prisma_1.default.course.findUnique({
            where: { id: req.params.id },
            include: {
                enrollments: {
                    include: {
                        user: { select: { id: true, name: true, email: true, avatar: true } },
                    }
                },
                sections: {
                    include: {
                        lessons: {
                            include: {
                                progress: {
                                    where: { userId: { in: [] } } // Will be populated
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        if (course.instructorId !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        // Get progress for all enrolled students
        const enrollments = course.enrollments;
        const studentProgress = await Promise.all(enrollments.map(async (enrollment) => {
            const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons.length, 0);
            const completedLessons = await prisma_1.default.progress.count({
                where: {
                    userId: enrollment.userId,
                    lessonId: { in: course.sections.flatMap(s => s.lessons.map(l => l.id)) },
                    isCompleted: true
                }
            });
            return {
                student: enrollment.user,
                enrolledAt: enrollment.enrolledAt,
                progress: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
                completedLessons,
                totalLessons
            };
        }));
        res.json({ success: true, data: studentProgress });
    }
    catch (error) {
        next(error);
    }
};
exports.getCourseProgress = getCourseProgress;
