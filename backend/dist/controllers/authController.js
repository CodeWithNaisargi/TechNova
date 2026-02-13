"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.refreshToken = exports.logout = exports.login = exports.resendVerification = exports.verifyEmail = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../config/prisma"));
const jwt_1 = require("../utils/jwt");
const client_1 = require("@prisma/client");
const email_1 = require("../utils/email");
// ------------------------ REGISTER ------------------------
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        // Generate verification token
        const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashed,
                role: role || client_1.Role.STUDENT,
                isEmailVerified: false,
                emailVerificationToken: verificationToken,
                emailVerificationTokenExpiry: tokenExpiry,
            },
        });
        // Send verification email (non-blocking)
        (0, email_1.sendVerificationEmail)(user.email, user.name, verificationToken).catch((emailError) => {
            console.error("Failed to send verification email:", emailError.message || emailError);
        });
        return res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email to verify your account.",
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
// ------------------------ VERIFY EMAIL ------------------------
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query;
        if (!token || typeof token !== "string") {
            return res.status(400).json({ success: false, message: "Invalid verification token" });
        }
        const user = await prisma_1.default.user.findFirst({
            where: { emailVerificationToken: token },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification token",
            });
        }
        // Check if already verified (Handle double-clicks/prefetches)
        if (user.isEmailVerified) {
            return res.status(200).json({
                success: true,
                message: "Email is already verified. You can log in.",
            });
        }
        // Check if token is expired
        if (user.emailVerificationTokenExpiry && user.emailVerificationTokenExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Verification token has expired. Please request a new one.",
            });
        }
        // Mark email as verified but KEEP the token for a while (or indefinitely until re-issued)
        // This allows the user to refresh the success page without getting an error
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: {
                isEmailVerified: true,
                // Do NOT clear token immediately to prevent "Invalid Token" on refresh
                // emailVerificationToken: null, 
                // emailVerificationTokenExpiry: null,
            },
        });
        // Send welcome email after verification (non-blocking)
        (0, email_1.sendWelcomeEmail)(user.email, user.name).catch((emailError) => {
            console.error("Failed to send welcome email:", emailError.message || emailError);
        });
        return res.json({
            success: true,
            message: "Email verified successfully. You can now log in.",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.verifyEmail = verifyEmail;
// ------------------------ RESEND VERIFICATION EMAIL ------------------------
const resendVerification = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            // Don't reveal if user exists
            return res.json({ success: true, message: "If an account exists with this email, a verification link has been sent." });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ success: false, message: "Email is already verified" });
        }
        // Generate new verification token
        const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: {
                emailVerificationToken: verificationToken,
                emailVerificationTokenExpiry: tokenExpiry,
            },
        });
        // Send verification email (non-blocking)
        (0, email_1.sendVerificationEmail)(user.email, user.name, verificationToken).catch((emailError) => {
            console.error("Failed to send verification email:", emailError.message || emailError);
        });
        return res.json({
            success: true,
            message: "If an account exists with this email, a verification link has been sent.",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.resendVerification = resendVerification;
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
        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in",
                code: "EMAIL_NOT_VERIFIED",
            });
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
                educationLevel: true,
                careerFocusId: true,
                onboardingCompleted: true,
                interestedCareerPath: {
                    select: {
                        id: true,
                        title: true,
                        domain: true,
                    }
                },
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
