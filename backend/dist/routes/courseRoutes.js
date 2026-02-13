"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const client_1 = require("@prisma/client");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// Public routes - MUST come before /:id route
router.get('/popular', courseController_1.getPopularCourses);
router.get('/new', courseController_1.getNewCourses);
router.get('/categories', courseController_1.getCategories);
router.route('/')
    .get(courseController_1.getCourses)
    .post(auth_1.protect, (0, roles_1.authorize)(client_1.Role.INSTRUCTOR, client_1.Role.ADMIN), upload_1.uploadThumbnail, courseController_1.createCourse);
router.route('/:id')
    .get(courseController_1.getCourseById)
    .put(auth_1.protect, (0, roles_1.authorize)(client_1.Role.INSTRUCTOR, client_1.Role.ADMIN), upload_1.uploadThumbnail, courseController_1.updateCourse)
    .delete(auth_1.protect, (0, roles_1.authorize)(client_1.Role.INSTRUCTOR, client_1.Role.ADMIN), courseController_1.deleteCourse);
router.post('/:id/sections', auth_1.protect, (0, roles_1.authorize)(client_1.Role.INSTRUCTOR, client_1.Role.ADMIN), courseController_1.addSection);
// Added uploadAttachment middleware to parse FormData with optional file attachment
router.post('/sections/:id/lessons', auth_1.protect, (0, roles_1.authorize)(client_1.Role.INSTRUCTOR, client_1.Role.ADMIN), upload_1.uploadAttachment, courseController_1.addLesson);
exports.default = router;
