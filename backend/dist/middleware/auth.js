"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const protect = async (req, res, next) => {
    let token;
    // 1) Try access token from cookies (primary)
    if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }
    // 2) Fallback to Authorization header (Bearer xxx)
    else if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }
    // 3) No token found
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Not authorized, no token provided" });
    }
    try {
        // 4) Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // 5) Check if user exists
        const user = await prisma_1.default.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "User no longer exists" });
        }
        // 6) Blocked user check
        if (user.isBlocked) {
            return res
                .status(403)
                .json({ success: false, message: "User account is blocked" });
        }
        // 7) Attach user to req for access in controllers
        req.user = { id: decoded.id, role: decoded.role };
        return next();
    }
    catch (err) {
        console.error("Auth error:", err);
        return res
            .status(401)
            .json({ success: false, message: "Not authorized, invalid token" });
    }
};
exports.protect = protect;
