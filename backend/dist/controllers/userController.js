"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBlockUser = exports.updateUserRole = exports.updateProfile = exports.getUserById = exports.getUsers = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: { id: true, name: true, email: true, role: true, isBlocked: true, createdAt: true },
        });
        res.json({ success: true, data: users });
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.params.id },
            select: { id: true, name: true, email: true, role: true, isBlocked: true, createdAt: true },
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const { name, bio, avatar } = req.body;
        const user = await prisma_1.default.user.update({
            where: { id: req.user?.id },
            data: { name, bio, avatar },
            select: { id: true, name: true, email: true, role: true, bio: true, avatar: true },
        });
        res.json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!Object.values(client_1.Role).includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        const user = await prisma_1.default.user.update({
            where: { id: req.params.id },
            data: { role },
            select: { id: true, name: true, email: true, role: true },
        });
        res.json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserRole = updateUserRole;
// @desc    Block/Unblock user (Admin only)
// @route   PUT /api/users/:id/block
// @access  Private/Admin
const toggleBlockUser = async (req, res, next) => {
    try {
        const user = await prisma_1.default.user.findUnique({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const updatedUser = await prisma_1.default.user.update({
            where: { id: req.params.id },
            data: { isBlocked: !user.isBlocked },
            select: { id: true, isBlocked: true },
        });
        res.json({ success: true, data: updatedUser });
    }
    catch (error) {
        next(error);
    }
};
exports.toggleBlockUser = toggleBlockUser;
