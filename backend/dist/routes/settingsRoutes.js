"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settingsController_1 = require("../controllers/settingsController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes are protected
router.get('/settings', auth_1.protect, settingsController_1.getUserSettings);
router.patch('/settings', auth_1.protect, settingsController_1.updateSettings);
router.patch('/profile', auth_1.protect, settingsController_1.updateProfile);
router.patch('/password', auth_1.protect, settingsController_1.changePassword);
router.get('/export', auth_1.protect, settingsController_1.exportUserData);
router.delete('/account', auth_1.protect, settingsController_1.deleteAccount);
exports.default = router;
