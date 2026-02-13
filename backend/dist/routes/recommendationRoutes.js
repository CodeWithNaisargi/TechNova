"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recommendationController_1 = require("../controllers/recommendationController");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// All routes require authentication and STUDENT role
router.use(auth_1.protect);
router.use((0, roles_1.authorize)(client_1.Role.STUDENT));
// Get personalized course recommendations
router.get('/', recommendationController_1.getCourseRecommendations);
// Get next focus skill suggestion
router.get('/next-skill', recommendationController_1.getNextSkillSuggestion);
// Get student feature vector (for transparency/debugging)
router.get('/profile', recommendationController_1.getStudentProfile);
exports.default = router;
