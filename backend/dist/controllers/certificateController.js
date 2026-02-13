"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCertificate = exports.downloadCertificate = exports.getCertificateById = exports.getMyCertificates = exports.generateCertificate = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const pdfGenerator_1 = require("../utils/pdfGenerator");
// Generate certificate for a completed course (ENHANCED with PDF generation)
const generateCertificate = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }
        // Check if user is enrolled in the course
        const enrollment = await prisma_1.default.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                }
            },
            include: {
                course: {
                    select: {
                        title: true,
                        sections: {
                            include: {
                                lessons: {
                                    select: { id: true }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'You are not enrolled in this course',
            });
        }
        // Calculate unified progress (lessons + assignments)
        const lessonIds = enrollment.course.sections.flatMap(s => s.lessons.map(l => l.id));
        const lessonProgress = await prisma_1.default.progress.findMany({
            where: { userId, lessonId: { in: lessonIds } }
        });
        const completedLessons = lessonProgress.filter(p => p.isCompleted).length;
        const totalLessons = lessonIds.length;
        const assignmentProgress = await prisma_1.default.assignmentProgress.findMany({
            where: {
                userId,
                assignment: { courseId }
            }
        });
        const completedAssignments = assignmentProgress.filter(p => p.status === 'COMPLETED' || p.status === 'SUBMITTED').length;
        const totalAssignments = assignmentProgress.length;
        const totalItems = totalLessons + totalAssignments;
        const completedItems = completedLessons + completedAssignments;
        const completionPercentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
        // Require 100% completion
        if (completionPercentage < 100) {
            return res.status(400).json({
                success: false,
                message: `You need to complete 100% of the course. Current: ${completionPercentage}%`,
                data: {
                    completionPercentage,
                    completedLessons,
                    totalLessons,
                    completedAssignments,
                    totalAssignments,
                }
            });
        }
        // Get user info
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { name: true }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        // Generate unique certificate ID
        const certificateId = `CERT-${new Date().getFullYear()}-${courseId.substring(0, 8).toUpperCase()}-${userId.substring(0, 6).toUpperCase()}`;
        // Generate PDF certificate
        const pdfUrl = await (0, pdfGenerator_1.generateCertificatePDF)({
            studentName: user.name,
            courseName: enrollment.course.title,
            certificateId,
            issueDate: new Date(),
            completionPercentage
        });
        // Create or update certificate in database
        const certificate = await prisma_1.default.certificate.upsert({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                }
            },
            update: {
                completionPercentage,
                pdfUrl
            },
            create: {
                userId,
                courseId,
                courseName: enrollment.course.title,
                studentName: user.name,
                certificateId,
                completionPercentage,
                pdfUrl
            }
        });
        res.json({
            success: true,
            data: certificate,
            message: 'Certificate generated successfully',
        });
    }
    catch (error) {
        console.error('Certificate generation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate certificate',
        });
    }
};
exports.generateCertificate = generateCertificate;
// Get user's certificates
const getMyCertificates = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }
        const certificates = await prisma_1.default.certificate.findMany({
            where: { userId },
            orderBy: { issueDate: 'desc' }
        });
        res.json({
            success: true,
            data: certificates,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch certificates',
        });
    }
};
exports.getMyCertificates = getMyCertificates;
// Get certificate by ID
const getCertificateById = async (req, res) => {
    try {
        const { certificateId } = req.params;
        const certificate = await prisma_1.default.certificate.findUnique({
            where: { certificateId }
        });
        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found',
            });
        }
        res.json({
            success: true,
            data: certificate,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch certificate',
        });
    }
};
exports.getCertificateById = getCertificateById;
// Download certificate PDF
const downloadCertificate = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }
        const certificate = await prisma_1.default.certificate.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });
        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found. Please generate it first.',
            });
        }
        if (!certificate.pdfUrl) {
            return res.status(404).json({
                success: false,
                message: 'PDF not available. Please regenerate the certificate.',
            });
        }
        res.json({
            success: true,
            data: {
                pdfUrl: certificate.pdfUrl,
                certificateId: certificate.certificateId
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to download certificate',
        });
    }
};
exports.downloadCertificate = downloadCertificate;
// Verify certificate (Public)
const verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;
        const certificate = await prisma_1.default.certificate.findUnique({
            where: { certificateId },
            select: {
                certificateId: true,
                studentName: true,
                courseName: true,
                issueDate: true,
                completionPercentage: true,
                pdfUrl: true
            }
        });
        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found or invalid',
            });
        }
        res.json({
            success: true,
            data: certificate,
            message: 'Certificate is valid',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to verify certificate',
        });
    }
};
exports.verifyCertificate = verifyCertificate;
