import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { createNotification } from '../modules/notification/notification.service';
import { NotificationType } from '@prisma/client';

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private
export const enrollCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.body;
        const userId = req.user!.id;

        // Check if already enrolled
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: { userId, courseId },
            },
        });

        if (existingEnrollment) {
            return res.status(400).json({ success: false, message: 'Already enrolled' });
        }

        // Verify course exists
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: { id: true, title: true }
        });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Use transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx) => {
            // Create enrollment
            const enrollment = await tx.enrollment.create({
                data: { userId, courseId },
            });

            // Auto-generate 10 assignments for this course
            const assignmentsData = Array.from({ length: 10 }, (_, index) => ({
                courseId,
                title: `Assignment ${index + 1}`,
                description: `Complete Assignment ${index + 1} for ${course.title}`,
                order: index + 1,
                content: `This is Assignment ${index + 1}. Please complete the tasks as instructed.`,
            }));

            // Create all assignments
            const assignments = await tx.assignment.createMany({
                data: assignmentsData,
                skipDuplicates: true, // Skip if assignments already exist
            });

            // Get the created assignment IDs
            const createdAssignments = await tx.assignment.findMany({
                where: { courseId },
                select: { id: true },
                orderBy: { order: 'asc' },
            });

            // Create assignment progress records for the student
            const progressData = createdAssignments.map((assignment) => ({
                userId,
                assignmentId: assignment.id,
                status: 'NOT_STARTED',
            }));

            await tx.assignmentProgress.createMany({
                data: progressData,
                skipDuplicates: true, // Skip if progress already exists
            });

            return { enrollment, assignmentsCreated: assignments.count };
        });

        // Trigger notification
        await createNotification({
            userId,
            title: 'Successfully Enrolled!',
            message: `You have successfully enrolled in ${course.title}. Start your learning journey!`,
            type: NotificationType.ENROLLMENT,
            link: `/learning/${course.id}`
        });

        res.status(201).json({
            success: true,
            data: result.enrollment,
            message: `Enrolled successfully! ${result.assignmentsCreated} assignments created.`,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my enrollments
// @route   GET /api/enrollments/my
// @access  Private
export const getMyEnrollments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { userId: req.user!.id },
            include: {
                course: {
                    select: { id: true, title: true, thumbnail: true, instructor: { select: { name: true } } },
                },
            },
        });
        res.json({ success: true, data: enrollments });
    } catch (error) {
        next(error);
    }
};

// @desc    Check enrollment status
// @route   GET /api/enrollments/check/:courseId
// @access  Private
export const checkEnrollment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.params;
        const enrollment = await prisma.enrollment.findUnique({
            where: { userId_courseId: { userId: req.user!.id, courseId } }
        });
        res.json({ success: true, isEnrolled: !!enrollment });
    } catch (error) {
        next(error);
    }
};
