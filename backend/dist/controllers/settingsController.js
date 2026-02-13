"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.exportUserData = exports.changePassword = exports.updateProfile = exports.updateSettings = exports.getUserSettings = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// @desc    Get user settings
// @route   GET /api/users/settings
// @access  Private
const getUserSettings = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let settings = await prisma_1.default.userSettings.findUnique({
            where: { userId }
        });
        // Create default settings if they don't exist
        if (!settings) {
            settings = await prisma_1.default.userSettings.create({
                data: { userId }
            });
        }
        res.json({ success: true, data: settings });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserSettings = getUserSettings;
// @desc    Update user settings
// @route   PATCH /api/users/settings
// @access  Private
const updateSettings = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { emailNotifications, assignmentNotifications, courseUpdateNotifications, profileVisibility, dataSharing, theme } = req.body;
        const settings = await prisma_1.default.userSettings.upsert({
            where: { userId },
            update: {
                emailNotifications,
                assignmentNotifications,
                courseUpdateNotifications,
                profileVisibility,
                dataSharing,
                theme
            },
            create: {
                userId,
                emailNotifications,
                assignmentNotifications,
                courseUpdateNotifications,
                profileVisibility,
                dataSharing,
                theme
            }
        });
        res.json({
            success: true,
            data: settings,
            message: 'Settings updated successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSettings = updateSettings;
// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, email, phone, bio, avatar } = req.body;
        // Check if email is already taken by another user
        if (email) {
            const existingUser = await prisma_1.default.user.findUnique({
                where: { email }
            });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
        }
        const user = await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(phone !== undefined && { phone }),
                ...(bio !== undefined && { bio }),
                ...(avatar !== undefined && { avatar })
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                bio: true,
                avatar: true,
                role: true
            }
        });
        res.json({
            success: true,
            data: user,
            message: 'Profile updated successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
// @desc    Change password
// @route   PATCH /api/users/password
// @access  Private
const changePassword = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }
        // Get user with password
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Verify current password
        const isValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        // Hash new password
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        // Update password
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.changePassword = changePassword;
// @desc    Export user data
// @route   GET /api/users/export
// @access  Private
const exportUserData = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: {
                enrollments: {
                    include: {
                        course: {
                            select: { title: true, description: true }
                        }
                    }
                },
                progress: true,
                assignmentProgress: true,
                certificates: true,
                reviews: true,
                settings: true
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Remove sensitive data
        const { password, ...userData } = user;
        res.json({
            success: true,
            data: userData
        });
    }
    catch (error) {
        next(error);
    }
};
exports.exportUserData = exportUserData;
// @desc    Delete user account (soft delete)
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required to delete account'
            });
        }
        // Get user with password
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Verify password
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect'
            });
        }
        // Soft delete by blocking the account
        await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                isBlocked: true,
                email: `deleted_${userId}@deleted.com` // Prevent email reuse
            }
        });
        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAccount = deleteAccount;
