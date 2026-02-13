"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAttachment = exports.addAttachment = exports.uploadFile = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
// Simple file upload (for assignment submissions)
const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const fileUrl = `/uploads/attachments/${req.file.filename}`;
        res.status(201).json({
            success: true,
            data: {
                url: fileUrl,
                name: req.file.originalname,
                type: req.file.mimetype,
                size: req.file.size
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadFile = uploadFile;
// Add attachment to lesson
const addAttachment = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const { lessonId } = req.body;
        const lesson = await prisma_1.default.lesson.findUnique({
            where: { id: lessonId },
            include: { section: { include: { course: true } } }
        });
        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }
        if (lesson.section.course.instructorId !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const fileUrl = `/uploads/attachments/${req.file.filename}`;
        const attachment = await prisma_1.default.attachment.create({
            data: {
                name: req.file.originalname,
                url: fileUrl,
                type: req.file.mimetype,
                size: req.file.size,
                lessonId
            }
        });
        res.status(201).json({ success: true, data: attachment });
    }
    catch (error) {
        next(error);
    }
};
exports.addAttachment = addAttachment;
// Delete attachment
const deleteAttachment = async (req, res, next) => {
    try {
        const attachment = await prisma_1.default.attachment.findUnique({
            where: { id: req.params.id },
            include: {
                lesson: {
                    include: {
                        section: { include: { course: true } }
                    }
                }
            }
        });
        if (!attachment) {
            return res.status(404).json({ success: false, message: 'Attachment not found' });
        }
        if (attachment.lesson.section.course.instructorId !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        // Delete file from filesystem
        const fs = require('fs');
        const filePath = path_1.default.join(process.cwd(), attachment.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        await prisma_1.default.attachment.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Attachment deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAttachment = deleteAttachment;
