"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.protect);
// GET /api/notifications - Fetch user's notifications
router.get('/', notificationController_1.getNotifications);
// GET /api/notifications/unread-count - Get unread count for badge
router.get('/unread-count', notificationController_1.getNotificationCount);
// PUT /api/notifications/read-all - Mark all as read
router.put('/read-all', notificationController_1.markAllNotificationsRead);
// PUT /api/notifications/:id/read - Mark single as read
router.put('/:id/read', notificationController_1.markNotificationRead);
exports.default = router;
