"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const jwt_1 = require("../utils/jwt");
const client_1 = require("@prisma/client");
// ------------------------ REGISTER ------------------------
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashed,
                role: role || client_1.Role.STUDENT,
            },
        });
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user.id, user.role);
        (0, jwt_1.setCookies)(res, accessToken, refreshToken);
        return res.status(201).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
// ------------------------ LOGIN ------------------------
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user.id, user.role);
        (0, jwt_1.setCookies)(res, accessToken, refreshToken);
        return res.json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
// ------------------------ LOGOUT ------------------------
const logout = (req, res) => {
    (0, jwt_1.clearCookies)(res);
    return res.json({ success: true, message: "Logged out successfully" });
};
exports.logout = logout;
// ------------------------ REFRESH TOKEN ------------------------
const refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            (0, jwt_1.clearCookies)(res);
            return res.status(401).json({ success: false, message: "No refresh token" });
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        }
        catch (err) {
            (0, jwt_1.clearCookies)(res);
            return res.status(401).json({ success: false, message: "Invalid refresh token" });
        }
        const user = await prisma_1.default.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            (0, jwt_1.clearCookies)(res);
            return res.status(401).json({ success: false, message: "User not found" });
        }
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user.id, user.role);
        (0, jwt_1.setCookies)(res, accessToken, refreshToken);
        return res.status(200).json({
            success: true,
            message: "Token refreshed",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (err) {
        (0, jwt_1.clearCookies)(res);
        return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }
};
exports.refreshToken = refreshToken;
// ------------------------ GET CURRENT USER ------------------------
const getMe = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                bio: true,
            },
        });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, data: user });
    }
    catch (err) {
        next(err);
    }
};
exports.getMe = getMe;
