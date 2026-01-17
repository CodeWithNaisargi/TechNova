import { Request, Response } from 'express';
import prisma from '../config/prisma';

// Get all assignments for a course
export const getCourseAssignments = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params;

        const assignments = await prisma.assignment.findMany({
            where: { courseId },
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { submissions: true }
                }
            }
        });

        res.json({
            success: true,
            data: assignments,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch assignments',
        });
    }
};

// Get single assignment by ID
export const getAssignmentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const assignment = await prisma.assignment.findUnique({
            where: { id },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
                _count: {
                    select: { submissions: true }
                }
            }
        });

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found',
            });
        }

        res.json({
            success: true,
            data: assignment,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch assignment',
        });
    }
};

// Create assignment (Admin/Instructor)
export const createAssignment = async (req: Request, res: Response) => {
    try {
        const { courseId, title, description, content, order, attachmentUrl, videoUrl, dueDate } = req.body;

        // Verify course exists
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        const assignment = await prisma.assignment.create({
            data: {
                courseId,
                title,
                description,
                content,
                order: order || 0,
                attachmentUrl,
                videoUrl,
                dueDate: dueDate ? new Date(dueDate) : null,
            },
        });

        res.status(201).json({
            success: true,
            data: assignment,
            message: 'Assignment created successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create assignment',
        });
    }
};

// Update assignment (Admin/Instructor)
export const updateAssignment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, content, order, attachmentUrl, videoUrl, dueDate } = req.body;

        const assignment = await prisma.assignment.update({
            where: { id },
            data: {
                title,
                description,
                content,
                order,
                attachmentUrl,
                videoUrl,
                dueDate: dueDate ? new Date(dueDate) : null,
            },
        });

        res.json({
            success: true,
            data: assignment,
            message: 'Assignment updated successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update assignment',
        });
    }
};

// Delete assignment (Admin/Instructor)
export const deleteAssignment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.assignment.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: 'Assignment deleted successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete assignment',
        });
    }
};

// Get student's assignment progress
export const getAssignmentProgress = async (req: Request, res: Response) => {
    try {
        const { assignmentId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        let progress = await prisma.assignmentProgress.findUnique({
            where: {
                userId_assignmentId: {
                    userId,
                    assignmentId,
                }
            }
        });

        // Create progress if doesn't exist
        if (!progress) {
            progress = await prisma.assignmentProgress.create({
                data: {
                    userId,
                    assignmentId,
                    status: 'NOT_STARTED',
                }
            });
        }

        res.json({
            success: true,
            data: progress,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch progress',
        });
    }
};

// Update assignment progress
export const updateAssignmentProgress = async (req: Request, res: Response) => {
    try {
        const { assignmentId } = req.params;
        const { status } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        const progress = await prisma.assignmentProgress.upsert({
            where: {
                userId_assignmentId: {
                    userId,
                    assignmentId,
                }
            },
            update: {
                status,
                startedAt: status === 'IN_PROGRESS' ? new Date() : undefined,
                completedAt: status === 'COMPLETED' || status === 'SUBMITTED' ? new Date() : undefined,
            },
            create: {
                userId,
                assignmentId,
                status,
                startedAt: status === 'IN_PROGRESS' ? new Date() : undefined,
                completedAt: status === 'COMPLETED' || status === 'SUBMITTED' ? new Date() : undefined,
            }
        });

        res.json({
            success: true,
            data: progress,
            message: 'Progress updated successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update progress',
        });
    }
};
