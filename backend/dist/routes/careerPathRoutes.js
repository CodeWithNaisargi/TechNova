"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const careerPathController_1 = require("../controllers/careerPathController");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// Public route - Get all career paths
router.get('/', careerPathController_1.getAllCareerPaths);
// Protected route - Update student's career interest (STUDENT only)
router.put('/student/interest', auth_1.protect, (0, roles_1.authorize)(client_1.Role.STUDENT), careerPathController_1.updateStudentInterest);
exports.default = router;
