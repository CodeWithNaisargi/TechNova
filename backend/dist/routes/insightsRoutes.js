"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const insightsController_1 = require("../controllers/insightsController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.protect);
// GET /api/insights - Get full insights (includes unlock status)
router.get('/', insightsController_1.getStudentInsights);
// GET /api/insights/unlock-status - Get unlock status only
router.get('/unlock-status', insightsController_1.getInsightsUnlockStatus);
exports.default = router;
