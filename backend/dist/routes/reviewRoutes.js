"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/course/:courseId', reviewController_1.getCourseReviews);
router.post('/', auth_1.protect, reviewController_1.createReview);
router.put('/:id', auth_1.protect, reviewController_1.updateReview);
router.delete('/:id', auth_1.protect, reviewController_1.deleteReview);
exports.default = router;
