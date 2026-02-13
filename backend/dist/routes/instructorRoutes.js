"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const instructorController_1 = require("../controllers/instructorController");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// All routes require instructor or admin role
router.use(auth_1.protect);
router.use((0, roles_1.authorize)(client_1.Role.INSTRUCTOR, client_1.Role.ADMIN));
// Dashboard stats
router.get('/stats', instructorController_1.getInstructorStats);
// Courses
router.get('/courses', instructorController_1.getInstructorCourses);
router.patch('/courses/:id/publish', adminController_1.toggleCoursePublish);
// Assignments
router.get('/assignments', instructorController_1.getInstructorAssignments);
// Submissions
router.get('/submissions', instructorController_1.getInstructorSubmissions);
router.patch('/submissions/:id', instructorController_1.updateSubmissionStatus);
exports.default = router;
