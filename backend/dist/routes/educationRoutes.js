"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const educationController_1 = require("../controllers/educationController");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// Public route - Get all education level options
router.get('/levels', educationController_1.getAllEducationLevels);
// Protected routes - Student only
router.get('/student/education-level', auth_1.protect, (0, roles_1.authorize)(client_1.Role.STUDENT), educationController_1.getEducationLevel);
router.put('/student/education-level', auth_1.protect, (0, roles_1.authorize)(client_1.Role.STUDENT), educationController_1.updateEducationLevel);
exports.default = router;
