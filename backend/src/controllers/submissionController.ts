import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { createNotification } from '../modules/notification/notification.service';
import { NotificationType } from '@prisma/client';

// Submit assignment (Student)
export const submitAssignment = async (req: Request, res: Response) => {
    try {
        const { assignmentId, fileUrl } = req.body;
        const studentId = req.user?.id;

        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        // Check if assignment exists
        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: { course: true }
        });

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found',
            });
        }

        // Create or update submission
        const submission = await prisma.submission.upsert({
            where: {
                assignmentId_studentId: {
                    assignmentId,
                    studentId,
                }
            },
            update: {
                fileUrl,
                status: 'PENDING',
                submittedAt: new Date(),
            },
            create: {
                assignmentId,
                studentId,
                fileUrl,
                status: 'PENDING',
            },
            include: {
                assignment: {
                    select: {
                        title: true,
                        courseId: true,
                    }
                }
            }
        });

        // Update assignment progress to SUBMITTED
        await prisma.assignmentProgress.upsert({
            where: {
                userId_assignmentId: {
                    userId: studentId,
                    assignmentId,
                }
            },
            update: {
                status: 'SUBMITTED',
                completedAt: new Date(),
            },
            create: {
                userId: studentId,
                assignmentId,
                status: 'SUBMITTED',
                completedAt: new Date(),
            }
        });

        // Trigger notification for student
        await createNotification({
            userId: studentId,
            title: 'Assignment Submitted',
            message: `Your submission for ${assignment.title} has been received.`,
            type: NotificationType.ASSIGNMENT,
            link: `/student/course/${assignment.courseId}/progress`
        });

        // Trigger notification for instructor
        const instructorId = assignment.course.instructorId;
        await createNotification({
            userId: instructorId,
            title: 'New Assignment Submission',
            message: `A student has submitted an assignment for ${assignment.course.title}.`,
            type: NotificationType.ASSIGNMENT,
            link: `/instructor/courses/${assignment.courseId}/submissions`
        });

        // Recalculate course progress
        const courseId = submission.assignment.courseId;

        // Get all lessons for this course
        const lessons = await prisma.lesson.findMany({
            where: {
                section: {
                    courseId
                }
            }
        });

        // Get completed lessons count
        const completedLessons = await prisma.progress.count({
            where: {
                userId: studentId,
                lesson: {
                    section: {
                        courseId
                    }
                },
                isCompleted: true
            }
        });

        // Get all assignments for this course
        const assignments = await prisma.assignment.findMany({
            where: { courseId }
        });

        // Get completed assignments count (SUBMITTED status counts as completed)
        const completedAssignments = await prisma.assignmentProgress.count({
            where: {
                userId: studentId,
                assignment: {
                    courseId
                },
                status: 'SUBMITTED'
            }
        });

        // Calculate unified progress
        const totalItems = lessons.length + assignments.length;
        const completedItems = completedLessons + completedAssignments;
        const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        // Emit Socket.io event for real-time dashboard update
        const io = (req as any).app.get('io');
        if (io) {
            io.to(`user:${studentId}`).emit('progress:updated', {
                userId: studentId,
                courseId,
                progressPercentage,
                completedLessons,
                totalLessons: lessons.length,
                completedAssignments,
                totalAssignments: assignments.length
            });
        }

        res.status(201).json({
            success: true,
            data: submission,
            message: 'Assignment submitted successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to submit assignment',
        });
    }
};

// Get student's submissions
export const getMySubmissions = async (req: Request, res: Response) => {
    try {
        const studentId = req.user?.id;

        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        const submissions = await prisma.submission.findMany({
            where: { studentId },
            include: {
                assignment: {
                    select: {
                        id: true,
                        title: true,
                        courseId: true,
                        course: {
                            select: {
                                title: true,
                                thumbnail: true,
                            }
                        }
                    }
                }
            },
            orderBy: { submittedAt: 'desc' }
        });

        res.json({
            success: true,
            data: submissions,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch submissions',
        });
    }
};

// Get submission by ID
export const getSubmissionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const submission = await prisma.submission.findUnique({
            where: { id },
            include: {
                assignment: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        courseId: true,
                    }
                },
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found',
            });
        }

        res.json({
            success: true,
            data: submission,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch submission',
        });
    }
};

// Get all submissions for an assignment (Admin/Instructor)
export const getAssignmentSubmissions = async (req: Request, res: Response) => {
    try {
        const { assignmentId } = req.params;

        const submissions = await prisma.submission.findMany({
            where: { assignmentId },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: { submittedAt: 'desc' }
        });

        res.json({
            success: true,
            data: submissions,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch submissions',
        });
    }
};

// Update submission status (Admin/Instructor)
export const updateSubmissionStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, feedback, grade } = req.body;

        const submission = await prisma.submission.update({
            where: { id },
            data: {
                status,
                feedback,
                grade,
            },
            include: {
                student: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                assignment: {
                    select: {
                        title: true,
                    }
                }
            }
        });

        res.json({
            success: true,
            data: submission,
            message: 'Submission status updated successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update submission',
        });
    }
};

// Get all submissions (Admin)
export const getAllSubmissions = async (req: Request, res: Response) => {
    try {
        const { status, courseId } = req.query;

        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (courseId) {
            where.assignment = {
                courseId: courseId as string
            };
        }

        const submissions = await prisma.submission.findMany({
            where,
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                assignment: {
                    select: {
                        id: true,
                        title: true,
                        courseId: true,
                        course: {
                            select: {
                                title: true,
                            }
                        }
                    }
                }
            },
            orderBy: { submittedAt: 'desc' }
        });

        res.json({
            success: true,
            data: submissions,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch submissions',
        });
    }
};
