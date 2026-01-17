"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// All routes require authentication and student role
router.use(auth_1.protect);
router.use((0, roles_1.authorize)(client_1.Role.STUDENT, client_1.Role.ADMIN));
router.get('/enrollments', studentController_1.getMyEnrollments);
router.post('/enroll', studentController_1.enrollCourse);
router.get('/learning/:courseId', studentController_1.getCourseLearning);
router.get('/dashboard/stats', studentController_1.getStudentStats);
exports.default = router;
