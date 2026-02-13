"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assignmentController_1 = require("../controllers/assignmentController");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// Public routes
router.get('/courses/:courseId/assignments', assignmentController_1.getCourseAssignments);
router.get('/:id', assignmentController_1.getAssignmentById);
// Student routes
router.get('/:assignmentId/progress', auth_1.protect, assignmentController_1.getAssignmentProgress);
router.put('/:assignmentId/progress', auth_1.protect, assignmentController_1.updateAssignmentProgress);
// Admin/Instructor routes
router.post('/', auth_1.protect, (0, roles_1.authorize)(client_1.Role.ADMIN, client_1.Role.INSTRUCTOR), assignmentController_1.createAssignment);
router.put('/:id', auth_1.protect, (0, roles_1.authorize)(client_1.Role.ADMIN, client_1.Role.INSTRUCTOR), assignmentController_1.updateAssignment);
router.delete('/:id', auth_1.protect, (0, roles_1.authorize)(client_1.Role.ADMIN, client_1.Role.INSTRUCTOR), assignmentController_1.deleteAssignment);
exports.default = router;
