"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// Protect all admin routes + role check
router.use(auth_1.protect);
router.use((0, roles_1.authorize)(client_1.Role.ADMIN));
// Platform statistics
router.get("/stats", adminController_1.getPlatformStats);
// Course management
router.get("/courses", adminController_1.getAllCourses);
router.patch("/courses/:id/price", adminController_1.updateCoursePrice);
router.patch("/courses/:id/publish", adminController_1.toggleCoursePublish);
// User management
router.get("/users", adminController_1.getAllUsers);
router.get("/users/:id", adminController_1.getUserById);
router.post("/users", adminController_1.createUser);
router.put("/users/:id", adminController_1.updateUser);
router.delete("/users/:id", adminController_1.deleteUser);
// Assignment management
router.get("/assignments", adminController_1.getAllAssignments);
router.delete("/assignments/:id", adminController_1.deleteAssignment);
exports.default = router;
