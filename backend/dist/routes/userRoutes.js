"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.put('/profile', auth_1.protect, userController_1.updateProfile);
// Admin routes
router.get('/', auth_1.protect, (0, roles_1.authorize)(client_1.Role.ADMIN), userController_1.getUsers);
router.get('/:id', auth_1.protect, (0, roles_1.authorize)(client_1.Role.ADMIN), userController_1.getUserById);
router.put('/:id/role', auth_1.protect, (0, roles_1.authorize)(client_1.Role.ADMIN), userController_1.updateUserRole);
router.put('/:id/block', auth_1.protect, (0, roles_1.authorize)(client_1.Role.ADMIN), userController_1.toggleBlockUser);
exports.default = router;
