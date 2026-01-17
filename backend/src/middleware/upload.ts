import multer from "multer";
import path from "path";
import fs from "fs";

// ROOT uploads folder → backend/uploads
const rootUploadsDir = path.join(process.cwd(), "uploads");

// Ensure root uploads folder exists
if (!fs.existsSync(rootUploadsDir)) {
  fs.mkdirSync(rootUploadsDir, { recursive: true });
}

// Helper: ensure subfolder exists
function ensureDir(folder: string) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = rootUploadsDir;

    // Route uploads to specific folders
    if (file.fieldname === "thumbnail") {
      folder = path.join(rootUploadsDir, "thumbnails");
    } else if (file.fieldname === "attachment") {
      folder = path.join(rootUploadsDir, "attachments");
    } else if (file.fieldname === "avatar") {
      folder = path.join(rootUploadsDir, "avatars");
    } else if (file.fieldname === "submission") {
      folder = path.join(rootUploadsDir, "submissions");
    }

    ensureDir(folder);
    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const unique = `${file.fieldname}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, unique);
  }
});

// Allow images + pdf + doc/docx
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allow all images
  if (file.mimetype.startsWith("image/")) return cb(null, true);

  // Allow documents
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (allowed.includes(file.mimetype)) return cb(null, true);

  return cb(new Error("Invalid file type — only images, PDFs, and docs allowed"));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// SINGLE UPLOADS
export const uploadThumbnail = upload.single("thumbnail");
export const uploadAttachment = upload.single("attachment");
export const uploadAvatar = upload.single("avatar");
export const uploadSubmission = upload.single("submission");

// MULTIPLE UPLOADS
export const uploadMultiple = upload.array("attachments", 10);
