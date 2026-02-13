"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assignmentProgressController_1 = require("../controllers/assignmentProgressController");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.protect);
// Get all assignments for a course with student's progress
router.get('/courses/:courseId/assignments', assignmentProgressController_1.getCourseAssignments);
// Toggle assignment completion
router.patch('/:assignmentId/progress', (0, roles_1.authorize)(client_1.Role.STUDENT), assignmentProgressController_1.toggleAssignmentCompletion);
// Get student's overall progress
router.get('/progress', (0, roles_1.authorize)(client_1.Role.STUDENT), assignmentProgressController_1.getAssignmentProgress);
exports.default = router;
