"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportReport = exports.getAdminAnalytics = exports.cancelEnrollment = exports.forceEnroll = exports.getAllEnrollments = exports.toggleApproveCourse = exports.getAllCourses = exports.toggleBlockUser = exports.updateUserRole = exports.getAllUsers = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
// Get all users
const getAllUsers = async (req, res, next) => {
    try {
        const { role, search, page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (role)
            where.role = role;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    avatar: true,
                    isBlocked: true,
                    createdAt: true,
                    _count: {
                        select: {
                            courses: true,
                            enrollments: true
                        }
                    }
                },
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma_1.default.user.count({ where })
        ]);
        res.json({
            success: true,
            data: users,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
// Update user role
const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        const user = await prisma_1.default.user.findUnique({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const updated = await prisma_1.default.user.update({
            where: { id: req.params.id },
            data: { role: role }
        });
        // Log admin action
        await prisma_1.default.adminLog.create({
            data: {
                adminId: req.user.id,
                action: 'UPDATE_USER_ROLE',
                details: `Changed user ${user.email} role to ${role}`
            }
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserRole = updateUserRole;
// Block/Unblock user
const toggleBlockUser = async (req, res, next) => {
    try {
        const user = await prisma_1.default.user.findUnique({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const updated = await prisma_1.default.user.update({
            where: { id: req.params.id },
            data: { isBlocked: !user.isBlocked }
        });
        await prisma_1.default.adminLog.create({
            data: {
                adminId: req.user.id,
                action: user.isBlocked ? 'UNBLOCK_USER' : 'BLOCK_USER',
                details: `${user.isBlocked ? 'Unblocked' : 'Blocked'} user ${user.email}`
            }
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.toggleBlockUser = toggleBlockUser;
// Get all courses (admin view)
const getAllCourses = async (req, res, next) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (status === 'published')
            where.isPublished = true;
        if (status === 'unpublished')
            where.isPublished = false;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        const [courses, total] = await Promise.all([
            prisma_1.default.course.findMany({
                where,
                include: {
                    instructor: { select: { name: true, email: true } },
                    _count: {
                        select: {
                            enrollments: true,
                            reviews: true
                        }
                    }
                },
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma_1.default.course.count({ where })
        ]);
        res.json({
            success: true,
            data: courses,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllCourses = getAllCourses;
// Approve/Unapprove course
const toggleApproveCourse = async (req, res, next) => {
    try {
        const course = await prisma_1.default.course.findUnique({ where: { id: req.params.id } });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        const updated = await prisma_1.default.course.update({
            where: { id: req.params.id },
            data: { isPublished: !course.isPublished }
        });
        await prisma_1.default.adminLog.create({
            data: {
                adminId: req.user.id,
                action: course.isPublished ? 'UNAPPROVE_COURSE' : 'APPROVE_COURSE',
                details: `${course.isPublished ? 'Unapproved' : 'Approved'} course: ${course.title}`
            }
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.toggleApproveCourse = toggleApproveCourse;
// Get all enrollments
const getAllEnrollments = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const [enrollments, total] = await Promise.all([
            prisma_1.default.enrollment.findMany({
                include: {
                    user: { select: { name: true, email: true } },
                    course: { select: { title: true, price: true } }
                },
                skip,
                take: Number(limit),
                orderBy: { enrolledAt: 'desc' }
            }),
            prisma_1.default.enrollment.count()
        ]);
        res.json({
            success: true,
            data: enrollments,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllEnrollments = getAllEnrollments;
// Force enroll user
const forceEnroll = async (req, res, next) => {
    try {
        const { userId, courseId } = req.body;
        const existing = await prisma_1.default.enrollment.findUnique({
            where: {
                userId_courseId: { userId, courseId }
            }
        });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Already enrolled' });
        }
        const enrollment = await prisma_1.default.enrollment.create({
            data: { userId, courseId },
            include: {
                user: { select: { name: true, email: true } },
                course: { select: { title: true } }
            }
        });
        await prisma_1.default.adminLog.create({
            data: {
                adminId: req.user.id,
                action: 'FORCE_ENROLL',
                details: `Enrolled user ${enrollment.user.email} in course ${enrollment.course.title}`
            }
        });
        res.status(201).json({ success: true, data: enrollment });
    }
    catch (error) {
        next(error);
    }
};
exports.forceEnroll = forceEnroll;
// Cancel enrollment
const cancelEnrollment = async (req, res, next) => {
    try {
        const enrollment = await prisma_1.default.enrollment.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { email: true } },
                course: { select: { title: true } }
            }
        });
        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Enrollment not found' });
        }
        await prisma_1.default.enrollment.delete({ where: { id: req.params.id } });
        await prisma_1.default.adminLog.create({
            data: {
                adminId: req.user.id,
                action: 'CANCEL_ENROLLMENT',
                details: `Cancelled enrollment for user ${enrollment.user.email} in course ${enrollment.course.title}`
            }
        });
        res.json({ success: true, message: 'Enrollment cancelled' });
    }
    catch (error) {
        next(error);
    }
};
exports.cancelEnrollment = cancelEnrollment;
// Get admin dashboard analytics
const getAdminAnalytics = async (req, res, next) => {
    try {
        const { period = 'month' } = req.query; // day, week, month
        const now = new Date();
        let startDate;
        switch (period) {
            case 'day':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            default:
                startDate = new Date(now.setMonth(now.getMonth() - 1));
        }
        const [totalUsers, totalInstructors, totalStudents, totalCourses, totalEnrollments, recentEnrollments, recentUsers] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.user.count({ where: { role: client_1.Role.INSTRUCTOR } }),
            prisma_1.default.user.count({ where: { role: client_1.Role.STUDENT } }),
            prisma_1.default.course.count(),
            prisma_1.default.enrollment.count(),
            prisma_1.default.enrollment.findMany({
                where: { enrolledAt: { gte: startDate } },
                include: {
                    course: { select: { title: true, price: true } },
                    user: { select: { name: true } }
                },
                orderBy: { enrolledAt: 'desc' },
                take: 10
            }),
            prisma_1.default.user.findMany({
                where: { createdAt: { gte: startDate } },
                orderBy: { createdAt: 'desc' },
                take: 10
            })
        ]);
        // Calculate revenue from enrollments
        const enrollmentsWithPrice = await prisma_1.default.enrollment.findMany({
            include: { course: { select: { price: true } } }
        });
        const calculatedRevenue = enrollmentsWithPrice.reduce((sum, e) => sum + e.course.price, 0);
        // Enrollment trends (last 7 days)
        const enrollmentTrends = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            const count = await prisma_1.default.enrollment.count({
                where: {
                    enrolledAt: {
                        gte: date,
                        lt: nextDate
                    }
                }
            });
            enrollmentTrends.push({
                date: date.toISOString().split('T')[0],
                count
            });
        }
        res.json({
            success: true,
            data: {
                totalUsers,
                totalInstructors,
                totalStudents,
                totalCourses,
                totalEnrollments,
                totalRevenue: calculatedRevenue,
                enrollmentTrends,
                recentEnrollments,
                recentUsers
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminAnalytics = getAdminAnalytics;
// Export reports
const exportReport = async (req, res, next) => {
    try {
        const { type } = req.params; // users, courses, enrollments, revenue
        let data = [];
        let filename = '';
        switch (type) {
            case 'users':
                data = await prisma_1.default.user.findMany({
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true
                    }
                });
                filename = 'users.csv';
                break;
            case 'courses':
                data = await prisma_1.default.course.findMany({
                    include: {
                        instructor: { select: { name: true, email: true } }
                    }
                });
                filename = 'courses.csv';
                break;
            case 'enrollments':
                data = await prisma_1.default.enrollment.findMany({
                    include: {
                        user: { select: { name: true, email: true } },
                        course: { select: { title: true, price: true } }
                    }
                });
                filename = 'enrollments.csv';
                break;
            case 'revenue':
                const enrollments = await prisma_1.default.enrollment.findMany({
                    include: {
                        course: { select: { title: true, price: true } },
                        user: { select: { name: true, email: true } }
                    }
                });
                data = enrollments.map(e => ({
                    enrollmentId: e.id,
                    studentName: e.user.name,
                    studentEmail: e.user.email,
                    courseTitle: e.course.title,
                    amount: e.course.price,
                    enrolledAt: e.enrolledAt
                }));
                filename = 'revenue.csv';
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid report type' });
        }
        // Convert to CSV
        if (data.length === 0) {
            return res.status(404).json({ success: false, message: 'No data to export' });
        }
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const value = row[header];
                if (value === null || value === undefined)
                    return '';
                if (typeof value === 'object') {
                    return JSON.stringify(value).replace(/"/g, '""');
                }
                return String(value).replace(/"/g, '""');
            }).join(','))
        ];
        const csv = csvRows.join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    }
    catch (error) {
        next(error);
    }
};
exports.exportReport = exportReport;
