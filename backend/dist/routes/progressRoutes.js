"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const progressController_1 = require("../controllers/progressController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', auth_1.protect, progressController_1.updateProgress);
router.get('/:courseId', auth_1.protect, progressController_1.getCourseProgress);
exports.default = router;
