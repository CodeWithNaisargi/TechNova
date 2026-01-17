import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

// @desc    Update lesson progress
// @route   POST /api/progress
// @access  Private
export const updateProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lessonId, isCompleted } = req.body;
        const userId = req.user!.id;

        const progress = await prisma.progress.upsert({
            where: {
                userId_lessonId: { userId, lessonId },
            },
            update: { isCompleted },
            create: { userId, lessonId, isCompleted },
        });

        res.json({ success: true, data: progress });
    } catch (error) {
        next(error);
    }
};

// @desc    Get progress for a course (ENHANCED - includes lessons AND assignments)
// @route   GET /api/progress/:courseId
// @access  Private
export const getCourseProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.params;
        const userId = req.user!.id;

        // Get all lessons for the course
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: { sections: { include: { lessons: { select: { id: true } } } } }
        });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const lessonIds = course.sections.flatMap(s => s.lessons.map(l => l.id));

        // Get lesson progress
        const lessonProgress = await prisma.progress.findMany({
            where: {
                userId,
                lessonId: { in: lessonIds },
            },
        });

        const completedLessons = lessonProgress.filter(p => p.isCompleted).length;
        const totalLessons = lessonIds.length;

        // Get assignment progress
        const assignmentProgress = await prisma.assignmentProgress.findMany({
            where: {
                userId,
                assignment: {
                    courseId
                }
            },
            include: {
                assignment: {
                    select: { id: true, title: true }
                }
            }
        });

        const completedAssignments = assignmentProgress.filter(
            p => p.status === 'COMPLETED' || p.status === 'SUBMITTED'
        ).length;
        const totalAssignments = assignmentProgress.length;

        // Calculate unified progress
        const totalItems = totalLessons + totalAssignments;
        const completedItems = completedLessons + completedAssignments;
        const percentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

        res.json({
            success: true,
            data: {
                courseId,
                percentage,
                completedLessons,
                totalLessons,
                completedAssignments,
                totalAssignments,
                completedItems,
                totalItems,
                lessonProgress: lessonProgress.map(p => ({
                    lessonId: p.lessonId,
                    isCompleted: p.isCompleted,
                    completedAt: p.completedAt
                })),
                assignmentProgress: assignmentProgress.map(p => ({
                    assignmentId: p.assignmentId,
                    assignmentTitle: p.assignment.title,
                    status: p.status,
                    completedAt: p.completedAt
                }))
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Recalculate progress for a course (trigger certificate generation if 100%)
// @route   POST /api/progress/recalculate/:courseId
// @access  Private
export const recalculateProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.params;
        const userId = req.user!.id;

        // Reuse getCourseProgress logic
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: { sections: { include: { lessons: { select: { id: true } } } } }
        });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const lessonIds = course.sections.flatMap(s => s.lessons.map(l => l.id));

        const lessonProgress = await prisma.progress.findMany({
            where: { userId, lessonId: { in: lessonIds } },
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
        const percentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

        // If 100% complete, trigger certificate generation
        if (percentage === 100) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { name: true }
            });

            if (user) {
                const certificateId = `CERT-${new Date().getFullYear()}-${courseId.substring(0, 8).toUpperCase()}-${userId.substring(0, 6).toUpperCase()}`;

                await prisma.certificate.upsert({
                    where: {
                        userId_courseId: { userId, courseId }
                    },
                    update: {
                        completionPercentage: percentage
                    },
                    create: {
                        userId,
                        courseId,
                        courseName: course.title,
                        studentName: user.name,
                        certificateId,
                        completionPercentage: percentage
                    }
                });
            }
        }

        res.json({
            success: true,
            data: {
                percentage,
                completedLessons,
                totalLessons,
                completedAssignments,
                totalAssignments,
                certificateGenerated: percentage === 100
            }
        });
    } catch (error) {
        next(error);
    }
};
