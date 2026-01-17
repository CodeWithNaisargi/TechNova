"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const instructorController_1 = require("../controllers/instructorController");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// All routes require authentication and instructor role
router.use(auth_1.protect);
router.use((0, roles_1.authorize)(client_1.Role.INSTRUCTOR, client_1.Role.ADMIN));
router.get('/courses', instructorController_1.getMyCourses);
router.get('/dashboard/stats', instructorController_1.getDashboardStats);
router.put('/sections/:id', instructorController_1.updateSection);
router.delete('/sections/:id', instructorController_1.deleteSection);
router.put('/lessons/:id', instructorController_1.updateLesson);
router.delete('/lessons/:id', instructorController_1.deleteLesson);
router.patch('/courses/:id/publish', instructorController_1.togglePublish);
router.put('/courses/:id/sections/reorder', instructorController_1.reorderSections);
router.get('/courses/:id/progress', instructorController_1.getCourseProgress);
exports.default = router;
