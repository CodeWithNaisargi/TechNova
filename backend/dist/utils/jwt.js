"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCookies = exports.setCookies = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isProduction = process.env.NODE_ENV === "production";
const generateTokens = (id, role) => {
    const payload = { id, role };
    const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 15 * 60 * 1000,
        path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });
};
exports.setCookies = setCookies;
const clearCookies = (res) => {
    res.cookie("accessToken", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 0,
        path: "/",
    });
    res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 0,
        path: "/",
    });
};
exports.clearCookies = clearCookies;
