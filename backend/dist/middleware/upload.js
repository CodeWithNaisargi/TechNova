"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadAvatar = exports.uploadAttachment = exports.uploadThumbnail = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = uploadsDir;
        if (file.fieldname === 'thumbnail') {
            uploadPath = path_1.default.join(uploadsDir, 'thumbnails');
        }
        else if (file.fieldname === 'attachment') {
            uploadPath = path_1.default.join(uploadsDir, 'attachments');
        }
        else if (file.fieldname === 'avatar') {
            uploadPath = path_1.default.join(uploadsDir, 'avatars');
        }
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    // Allow images
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    // Allow PDFs and documents
    else if (file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});
// Single file uploads
exports.uploadThumbnail = exports.upload.single('thumbnail');
exports.uploadAttachment = exports.upload.single('attachment');
exports.uploadAvatar = exports.upload.single('avatar');
// Multiple file upload
exports.uploadMultiple = exports.upload.array('attachments', 10);
