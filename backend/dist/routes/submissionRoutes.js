"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const submissionController_1 = require("../controllers/submissionController");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// Student routes
router.post('/', auth_1.protect, (0, roles_1.authorize)(client_1.Role.STUDENT), submissionController_1.submitAssignment);
router.get('/my-submissions', auth_1.protect, (0, roles_1.authorize)(client_1.Role.STUDENT), submissionController_1.getMySubmissions);
// Admin/Instructor routes
router.get('/', auth_1.protect, (0, roles_1.authorize)(client_1.Role.ADMIN, client_1.Role.INSTRUCTOR), submissionController_1.getAllSubmissions);
router.get('/assignment/:assignmentId', auth_1.protect, (0, roles_1.authorize)(client_1.Role.ADMIN, client_1.Role.INSTRUCTOR), submissionController_1.getAssignmentSubmissions);
router.get('/:id', auth_1.protect, submissionController_1.getSubmissionById);
router.patch('/:id/status', auth_1.protect, (0, roles_1.authorize)(client_1.Role.ADMIN, client_1.Role.INSTRUCTOR), submissionController_1.updateSubmissionStatus);
exports.default = router;
