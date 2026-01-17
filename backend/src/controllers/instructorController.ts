import { Request, Response } from 'express';
import prisma from '../config/prisma';

// Get instructor's courses
export const getInstructorCourses = async (req: Request, res: Response) => {
    try {
        const instructorId = req.user?.id;

        const courses = await prisma.course.findMany({
            where: { instructorId },
            include: {
                _count: {
                    select: {
                        enrollments: true,
                        assignments: true,
                        reviews: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: courses,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch courses',
        });
    }
};

// Get instructor's dashboard stats
export const getInstructorStats = async (req: Request, res: Response) => {
    try {
        const instructorId = req.user?.id;

        const [
            totalCourses,
            publishedCourses,
            totalEnrollments,
            pendingSubmissions,
        ] = await Promise.all([
            prisma.course.count({ where: { instructorId } }),
            prisma.course.count({ where: { instructorId, isPublished: true } }),
            prisma.enrollment.count({
                where: {
                    course: { instructorId }
                }
            }),
            prisma.submission.count({
                where: {
                    assignment: {
                        course: { instructorId }
                    },
                    status: 'PENDING'
                }
            }),
        ]);

        res.json({
            success: true,
            data: {
                totalCourses,
                publishedCourses,
                totalEnrollments,
                pendingSubmissions,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch statistics',
        });
    }
};

// Get instructor's submissions
export const getInstructorSubmissions = async (req: Request, res: Response) => {
    try {
        const instructorId = req.user?.id;
        const { status, courseId } = req.query;

        const where: any = {
            assignment: {
                course: { instructorId }
            }
        };

        if (status) {
            where.status = status;
        }

        if (courseId) {
            where.assignment = {
                ...where.assignment,
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

// Update submission status (Instructor)
export const updateSubmissionStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, feedback, grade } = req.body;
        const instructorId = req.user?.id;

        // Verify this submission belongs to instructor's course
        const submission = await prisma.submission.findUnique({
            where: { id },
            include: {
                assignment: {
                    include: {
                        course: true
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

        if (submission.assignment.course.instructorId !== instructorId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to review this submission',
            });
        }

        const updatedSubmission = await prisma.submission.update({
            where: { id },
            data: {
                status,
                feedback,
                grade: grade ? parseInt(grade) : null,
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
            data: updatedSubmission,
            message: 'Submission updated successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update submission',
        });
    }
};

// Get instructor's assignments
export const getInstructorAssignments = async (req: Request, res: Response) => {
    try {
        const instructorId = req.user?.id;
        const { courseId } = req.query;

        const where: any = {
            course: { instructorId }
        };

        if (courseId) {
            where.courseId = courseId;
        }

        const assignments = await prisma.assignment.findMany({
            where,
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
                _count: {
                    select: {
                        submissions: true,
                    }
                }
            },
            orderBy: [
                { courseId: 'asc' },
                { order: 'asc' }
            ]
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
