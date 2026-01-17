import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { Role } from '@prisma/client';
import path from 'path';

// Simple file upload (for assignment submissions)
export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (error) {
        next(error);
    }
};

// Add attachment to lesson
export const addAttachment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const { lessonId } = req.body;
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { section: { include: { course: true } } }
        });

        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }

        if (lesson.section.course.instructorId !== req.user!.id && req.user!.role !== Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const fileUrl = `/uploads/attachments/${req.file.filename}`;
        const attachment = await prisma.attachment.create({
            data: {
                name: req.file.originalname,
                url: fileUrl,
                type: req.file.mimetype,
                size: req.file.size,
                lessonId
            }
        });

        res.status(201).json({ success: true, data: attachment });
    } catch (error) {
        next(error);
    }
};

// Delete attachment
export const deleteAttachment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attachment = await prisma.attachment.findUnique({
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

        if (attachment.lesson.section.course.instructorId !== req.user!.id && req.user!.role !== Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Delete file from filesystem
        const fs = require('fs');
        const filePath = path.join(process.cwd(), attachment.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await prisma.attachment.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Attachment deleted' });
    } catch (error) {
        next(error);
    }
};

