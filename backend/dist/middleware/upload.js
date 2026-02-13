"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSubmission = exports.uploadAvatar = exports.uploadAttachment = exports.uploadThumbnail = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// ROOT uploads folder → backend/uploads
const rootUploadsDir = path_1.default.join(process.cwd(), "uploads");
// Ensure root uploads folder exists
if (!fs_1.default.existsSync(rootUploadsDir)) {
    fs_1.default.mkdirSync(rootUploadsDir, { recursive: true });
}
// Helper: ensure subfolder exists
function ensureDir(folder) {
    if (!fs_1.default.existsSync(folder)) {
        fs_1.default.mkdirSync(folder, { recursive: true });
    }
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let folder = rootUploadsDir;
        // Route uploads to specific folders
        if (file.fieldname === "thumbnail") {
            folder = path_1.default.join(rootUploadsDir, "thumbnails");
        }
        else if (file.fieldname === "attachment") {
            folder = path_1.default.join(rootUploadsDir, "attachments");
        }
        else if (file.fieldname === "avatar") {
            folder = path_1.default.join(rootUploadsDir, "avatars");
        }
        else if (file.fieldname === "submission") {
            folder = path_1.default.join(rootUploadsDir, "submissions");
        }
        ensureDir(folder);
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const unique = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path_1.default.extname(file.originalname)}`;
        cb(null, unique);
    }
});
// Allow images + pdf + doc/docx
const fileFilter = (req, file, cb) => {
    // Allow all images
    if (file.mimetype.startsWith("image/"))
        return cb(null, true);
    // Allow documents
    const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if (allowed.includes(file.mimetype))
        return cb(null, true);
    return cb(new Error("Invalid file type — only images, PDFs, and docs allowed"));
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});
// SINGLE UPLOADS
exports.uploadThumbnail = exports.upload.single("thumbnail");
exports.uploadAttachment = exports.upload.single("attachment");
exports.uploadAvatar = exports.upload.single("avatar");
exports.uploadSubmission = exports.upload.single("submission");
// MULTIPLE UPLOADS
exports.uploadMultiple = exports.upload.array("attachments", 10);
