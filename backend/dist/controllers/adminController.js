"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAssignment = exports.getAllAssignments = exports.getPlatformStats = exports.updateUser = exports.createUser = exports.getUserById = exports.deleteUser = exports.getAllUsers = exports.toggleCoursePublish = exports.updateCoursePrice = exports.getAllCourses = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const socket_1 = require("../config/socket");
// Get all courses (Admin)
const getAllCourses = async (req, res) => {
    try {
        const courses = await prisma_1.default.course.findMany({
            include: {
                instructor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
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
exports.getAllCourses = getAllCourses;
// Update course price (Admin)
const updateCoursePrice = async (req, res) => {
    try {
        const { id } = req.params;
        const { price } = req.body;
        const course = await prisma_1.default.course.update({
            where: { id },
            data: { price: parseFloat(price) },
        });
        res.json({
            success: true,
            data: course,
            message: 'Course price updated successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update course price',
        });
    }
};
exports.updateCoursePrice = updateCoursePrice;
// Toggle course publish status (Admin)
const toggleCoursePublish = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await prisma_1.default.course.findUnique({
            where: { id },
        });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }
        const updatedCourse = await prisma_1.default.course.update({
            where: { id },
            data: { isPublished: !course.isPublished },
        });
        res.json({
            success: true,
            data: updatedCourse,
            message: `Course ${updatedCourse.isPublished ? 'published' : 'unpublished'} successfully`,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to toggle course status',
        });
    }
};
exports.toggleCoursePublish = toggleCoursePublish;
// Get all users (Admin)
const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const where = {};
        if (role) {
            where.role = role;
        }
        const users = await prisma_1.default.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                createdAt: true,
                _count: {
                    select: {
                        enrollments: true,
                        courses: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch users',
        });
    }
};
exports.getAllUsers = getAllUsers;
// Delete user (Admin)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Don't allow deleting yourself
        if (id === req.user?.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account',
            });
        }
        await prisma_1.default.user.delete({
            where: { id },
        });
        // Emit real-time event
        const io = (0, socket_1.getSocketInstance)();
        if (io) {
            io.emit('user:deleted', { userId: id });
        }
        res.json({
            success: true,
            message: 'User deleted successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete user',
        });
    }
};
exports.deleteUser = deleteUser;
// Get user by ID (Admin)
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                createdAt: true,
                _count: {
                    select: {
                        enrollments: true,
                        courses: true,
                        submissions: true,
                    }
                }
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch user',
        });
    }
};
exports.getUserById = getUserById;
// Create user (Admin)
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Check if user already exists
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists',
            });
        }
        // Hash password
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'STUDENT',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        // Emit real-time event
        const io = (0, socket_1.getSocketInstance)();
        if (io) {
            io.emit('user:created', user);
        }
        res.status(201).json({
            success: true,
            data: user,
            message: 'User created successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create user',
        });
    }
};
exports.createUser = createUser;
// Update user (Admin)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, password } = req.body;
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email;
        if (role)
            updateData.role = role;
        // Hash password if provided
        if (password) {
            const bcrypt = require('bcryptjs');
            updateData.password = await bcrypt.hash(password, 10);
        }
        const user = await prisma_1.default.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                createdAt: true,
            },
        });
        // Emit real-time event
        const io = (0, socket_1.getSocketInstance)();
        if (io) {
            io.emit('user:updated', user);
        }
        res.json({
            success: true,
            data: user,
            message: 'User updated successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update user',
        });
    }
};
exports.updateUser = updateUser;
// Get platform statistics (Admin)
const getPlatformStats = async (req, res) => {
    try {
        const [totalCourses, publishedCourses, totalUsers, totalStudents, totalInstructors, totalEnrollments, totalSubmissions, pendingSubmissions,] = await Promise.all([
            prisma_1.default.course.count(),
            prisma_1.default.course.count({ where: { isPublished: true } }),
            prisma_1.default.user.count(),
            prisma_1.default.user.count({ where: { role: 'STUDENT' } }),
            prisma_1.default.user.count({ where: { role: 'INSTRUCTOR' } }),
            prisma_1.default.enrollment.count(),
            prisma_1.default.submission.count(),
            prisma_1.default.submission.count({ where: { status: 'PENDING' } }),
        ]);
        res.json({
            success: true,
            data: {
                totalCourses,
                publishedCourses,
                totalUsers,
                totalStudents,
                totalInstructors,
                totalEnrollments,
                totalSubmissions,
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
exports.getPlatformStats = getPlatformStats;
// Get all assignments (Admin)
const getAllAssignments = async (req, res) => {
    try {
        const { courseId } = req.query;
        const where = {};
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
            orderBy: { createdAt: 'desc' }
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
exports.getAllAssignments = getAllAssignments;
// Delete assignment (Admin)
const deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.assignment.delete({
            where: { id },
        });
        res.json({
            success: true,
            message: 'Assignment deleted successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete assignment',
        });
    }
};
exports.deleteAssignment = deleteAssignment;
