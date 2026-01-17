"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// All routes require authentication and admin role
router.use(auth_1.protect);
router.use((0, roles_1.authorize)(client_1.Role.ADMIN));
// Users
router.get('/users', adminController_1.getAllUsers);
router.put('/users/:id/role', adminController_1.updateUserRole);
router.patch('/users/:id/block', adminController_1.toggleBlockUser);
// Courses
router.get('/courses', adminController_1.getAllCourses);
router.patch('/courses/:id/approve', adminController_1.toggleApproveCourse);
// Enrollments
router.get('/enrollments', adminController_1.getAllEnrollments);
router.post('/enrollments/force', adminController_1.forceEnroll);
router.delete('/enrollments/:id', adminController_1.cancelEnrollment);
// Analytics
router.get('/analytics', adminController_1.getAdminAnalytics);
// Reports
router.get('/reports/:type', adminController_1.exportReport);
exports.default = router;
