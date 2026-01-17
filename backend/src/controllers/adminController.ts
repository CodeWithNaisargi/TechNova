import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { getSocketInstance } from '../config/socket';

// Get all courses (Admin)
export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const courses = await prisma.course.findMany({
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch courses',
        });
    }
};

// Update course price (Admin)
export const updateCoursePrice = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { price } = req.body;

        const course = await prisma.course.update({
            where: { id },
            data: { price: parseFloat(price) },
        });

        res.json({
            success: true,
            data: course,
            message: 'Course price updated successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update course price',
        });
    }
};

// Toggle course publish status (Admin)
export const toggleCoursePublish = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const course = await prisma.course.findUnique({
            where: { id },
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        const updatedCourse = await prisma.course.update({
            where: { id },
            data: { isPublished: !course.isPublished },
        });

        res.json({
            success: true,
            data: updatedCourse,
            message: `Course ${updatedCourse.isPublished ? 'published' : 'unpublished'} successfully`,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to toggle course status',
        });
    }
};

// Get all users (Admin)
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { role } = req.query;

        const where: any = {};
        if (role) {
            where.role = role;
        }

        const users = await prisma.user.findMany({
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch users',
        });
    }
};

// Delete user (Admin)
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Don't allow deleting yourself
        if (id === req.user?.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account',
            });
        }

        await prisma.user.delete({
            where: { id },
        });

        // Emit real-time event
        const io = getSocketInstance();
        if (io) {
            io.emit('user:deleted', { userId: id });
        }

        res.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete user',
        });
    }
};

// Get user by ID (Admin)
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch user',
        });
    }
};

// Create user (Admin)
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
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

        const user = await prisma.user.create({
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
        const io = getSocketInstance();
        if (io) {
            io.emit('user:created', user);
        }

        res.status(201).json({
            success: true,
            data: user,
            message: 'User created successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create user',
        });
    }
};

// Update user (Admin)
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, role, password } = req.body;

        const updateData: any = {};

        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;

        // Hash password if provided
        if (password) {
            const bcrypt = require('bcryptjs');
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
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
        const io = getSocketInstance();
        if (io) {
            io.emit('user:updated', user);
        }

        res.json({
            success: true,
            data: user,
            message: 'User updated successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update user',
        });
    }
};

// Get platform statistics (Admin)
export const getPlatformStats = async (req: Request, res: Response) => {
    try {
        const [
            totalCourses,
            publishedCourses,
            totalUsers,
            totalStudents,
            totalInstructors,
            totalEnrollments,
            totalSubmissions,
            pendingSubmissions,
        ] = await Promise.all([
            prisma.course.count(),
            prisma.course.count({ where: { isPublished: true } }),
            prisma.user.count(),
            prisma.user.count({ where: { role: 'STUDENT' } }),
            prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
            prisma.enrollment.count(),
            prisma.submission.count(),
            prisma.submission.count({ where: { status: 'PENDING' } }),
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch statistics',
        });
    }
};

// Get all assignments (Admin)
export const getAllAssignments = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.query;

        const where: any = {};
        if (courseId) {
            where.courseId = courseId;
        }

        const assignments = await prisma.assignment.findMany({
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch assignments',
        });
    }
};

// Delete assignment (Admin)
export const deleteAssignment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.assignment.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: 'Assignment deleted successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete assignment',
        });
    }
};
