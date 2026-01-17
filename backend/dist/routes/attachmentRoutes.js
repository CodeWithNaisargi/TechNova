"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attachmentController_1 = require("../controllers/attachmentController");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const client_1 = require("@prisma/client");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.use((0, roles_1.authorize)(client_1.Role.INSTRUCTOR, client_1.Role.ADMIN));
router.post('/', upload_1.uploadAttachment, attachmentController_1.addAttachment);
router.delete('/:id', attachmentController_1.deleteAttachment);
exports.default = router;
