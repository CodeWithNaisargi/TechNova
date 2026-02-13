"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const certificateController_1 = require("../controllers/certificateController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Protected routes
router.post('/generate/:courseId', auth_1.protect, certificateController_1.generateCertificate);
router.get('/my', auth_1.protect, certificateController_1.getMyCertificates);
router.get('/my-certificates', auth_1.protect, certificateController_1.getMyCertificates);
router.get('/download/:courseId', auth_1.protect, certificateController_1.downloadCertificate);
router.get('/:certificateId', certificateController_1.getCertificateById);
// Public route for verification
router.get('/verify/:certificateId', certificateController_1.verifyCertificate);
exports.default = router;
