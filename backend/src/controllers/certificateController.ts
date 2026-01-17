import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { generateCertificatePDF } from '../utils/pdfGenerator';

// Generate certificate for a completed course (ENHANCED with PDF generation)
export const generateCertificate = async (req: Request, res: Response) => {
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
        const enrollment = await prisma.enrollment.findUnique({
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

        const lessonProgress = await prisma.progress.findMany({
            where: { userId, lessonId: { in: lessonIds } }
        });
        const completedLessons = lessonProgress.filter(p => p.isCompleted).length;
        const totalLessons = lessonIds.length;

        const assignmentProgress = await prisma.assignmentProgress.findMany({
            where: {
                userId,
                assignment: { courseId }
            }
        });
        const completedAssignments = assignmentProgress.filter(
            p => p.status === 'COMPLETED' || p.status === 'SUBMITTED'
        ).length;
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
        const user = await prisma.user.findUnique({
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
        const pdfUrl = await generateCertificatePDF({
            studentName: user.name,
            courseName: enrollment.course.title,
            certificateId,
            issueDate: new Date(),
            completionPercentage
        });

        // Create or update certificate in database
        const certificate = await prisma.certificate.upsert({
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
    } catch (error: any) {
        console.error('Certificate generation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate certificate',
        });
    }
};

// Get user's certificates
export const getMyCertificates = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        const certificates = await prisma.certificate.findMany({
            where: { userId },
            orderBy: { issueDate: 'desc' }
        });

        res.json({
            success: true,
            data: certificates,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch certificates',
        });
    }
};

// Get certificate by ID
export const getCertificateById = async (req: Request, res: Response) => {
    try {
        const { certificateId } = req.params;

        const certificate = await prisma.certificate.findUnique({
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch certificate',
        });
    }
};

// Download certificate PDF
export const downloadCertificate = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        const certificate = await prisma.certificate.findUnique({
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to download certificate',
        });
    }
};

// Verify certificate (Public)
export const verifyCertificate = async (req: Request, res: Response) => {
    try {
        const { certificateId } = req.params;

        const certificate = await prisma.certificate.findUnique({
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to verify certificate',
        });
    }
};
