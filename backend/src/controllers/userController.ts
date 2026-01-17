import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { Role } from '@prisma/client';

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, isBlocked: true, createdAt: true },
        });
        res.json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: { id: true, name: true, email: true, role: true, isBlocked: true, createdAt: true },
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, bio, avatar } = req.body;
        const user = await prisma.user.update({
            where: { id: req.user?.id },
            data: { name, bio, avatar },
            select: { id: true, name: true, email: true, role: true, bio: true, avatar: true },
        });
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role } = req.body;
        if (!Object.values(Role).includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { role },
            select: { id: true, name: true, email: true, role: true },
        });
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Block/Unblock user (Admin only)
// @route   PUT /api/users/:id/block
// @access  Private/Admin
export const toggleBlockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.params.id },
            data: { isBlocked: !user.isBlocked },
            select: { id: true, isBlocked: true },
        });
        res.json({ success: true, data: updatedUser });
    } catch (error) {
        next(error);
    }
};
