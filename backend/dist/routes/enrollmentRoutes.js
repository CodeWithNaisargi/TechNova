"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enrollmentController_1 = require("../controllers/enrollmentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', auth_1.protect, enrollmentController_1.enrollCourse);
router.get('/my', auth_1.protect, enrollmentController_1.getMyEnrollments);
router.get('/check/:courseId', auth_1.protect, enrollmentController_1.checkEnrollment);
exports.default = router;
