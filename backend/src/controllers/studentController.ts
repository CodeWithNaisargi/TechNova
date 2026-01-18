import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

// Get enrolled courses
export const getMyEnrollments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { userId: req.user!.id },
            include: {
                course: {
                    include: {
                        instructor: { select: { name: true, avatar: true } },
                        sections: {
                            include: {
                                lessons: {
                                    include: {
                                        progress: {
                                            where: { userId: req.user!.id }
                                        }
                                    }
                                }
                            },
                            orderBy: { order: 'asc' }
                        },
                        reviews: {
                            where: { userId: req.user!.id }
                        }
                    }
                }
            },
            orderBy: { enrolledAt: 'desc' }
        });

        // Calculate progress for each course
        const coursesWithProgress = enrollments.map(enrollment => {
            const totalLessons = enrollment.course.sections.reduce(
                (sum, section) => sum + section.lessons.length, 0
            );
            const completedLessons = enrollment.course.sections.reduce(
                (sum, section) => sum + section.lessons.filter(
                    lesson => lesson.progress.some(p => p.isCompleted)
                ).length, 0
            );
            const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

            // Find last accessed lesson
            const allLessons = enrollment.course.sections.flatMap(s => s.lessons);
            const lastProgress = allLessons
                .filter(l => l.progress.length > 0)
                .sort((a, b) => {
                    const aTime = a.progress[0]?.completedAt?.getTime() || 0;
                    const bTime = b.progress[0]?.completedAt?.getTime() || 0;
                    return bTime - aTime;
                })[0];

            return {
                ...enrollment,
                progress,
                completedLessons,
                totalLessons,
                lastAccessedLesson: lastProgress ? {
                    id: lastProgress.id,
                    title: lastProgress.title,
                    sectionId: lastProgress.sectionId
                } : null
            };
        });

        res.json({ success: true, data: coursesWithProgress });
    } catch (error) {
        next(error);
    }
};

// Enroll in course
export const enrollCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.body;
        const course = await prisma.course.findUnique({ where: { id: courseId } });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check if already enrolled
        const existing = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: req.user!.id,
                    courseId
                }
            }
        });

        if (existing) {
            return res.status(400).json({ success: false, message: 'Already enrolled' });
        }

        // For paid courses, simulate checkout (in real app, integrate payment gateway)
        if (course.price > 0) {
            // Here you would process payment
            // For now, we'll just create the enrollment
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                userId: req.user!.id,
                courseId
            },
            include: {
                course: {
                    include: {
                        instructor: { select: { name: true } }
                    }
                }
            }
        });

        res.status(201).json({ success: true, data: enrollment });
    } catch (error) {
        next(error);
    }
};

// Get course learning page (with full lesson content)
export const getCourseLearning = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.params;

        // Check enrollment
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: req.user!.id,
                    courseId
                }
            }
        });

        if (!enrollment) {
            return res.status(403).json({ success: false, message: 'Not enrolled in this course' });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                instructor: { select: { name: true, avatar: true, bio: true } },
                sections: {
                    include: {
                        lessons: {
                            include: {
                                progress: {
                                    where: { userId: req.user!.id }
                                },
                                attachments: true
                            },
                            orderBy: { order: 'asc' }
                        }
                    },
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.json({ success: true, data: course });
    } catch (error) {
        next(error);
    }
};

// Get student dashboard stats
export const getStudentStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { userId: req.user!.id },
            include: {
                course: {
                    include: {
                        sections: {
                            include: { lessons: true }
                        }
                    }
                }
            }
        });

        const totalCourses = enrollments.length;
        const totalLessons = enrollments.reduce(
            (sum, e) => sum + e.course.sections.reduce((s, sec) => s + sec.lessons.length, 0), 0
        );

        const completedLessons = await prisma.progress.count({
            where: {
                userId: req.user!.id,
                isCompleted: true
            }
        });

        const inProgressCourses = enrollments.filter(e => {
            const total = e.course.sections.reduce((s, sec) => s + sec.lessons.length, 0);
            return total > 0;
        }).length;

        res.json({
            success: true,
            data: {
                totalCourses,
                totalLessons,
                completedLessons,
                inProgressCourses
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get course progress with assignment list
export const getCourseProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.params;
        const userId = req.user!.id;

        // Check enrollment
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        if (!enrollment) {
            return res.status(403).json({ success: false, message: 'Not enrolled in this course' });
        }

        // Get all assignments for this course
        const assignments = await prisma.assignment.findMany({
            where: { courseId },
            orderBy: { dueDate: 'asc' }
        });

        // Get all submissions by this student for this course's assignments
        const assignmentIds = assignments.map(a => a.id);
        const submissions = await prisma.submission.findMany({
            where: {
                studentId: userId,
                assignmentId: { in: assignmentIds }
            },
            select: {
                assignmentId: true,
                status: true
            }
        });

        // Create a map of submission status by assignment
        const submissionMap = new Map(
            submissions.map(s => [s.assignmentId, s.status])
        );

        // Calculate progress - only APPROVED submissions count as completed
        const totalAssignments = assignments.length;
        const completedAssignments = submissions.filter(
            s => s.status === 'APPROVED'
        ).length;
        const progressPercentage = totalAssignments > 0
            ? Math.round((completedAssignments / totalAssignments) * 100)
            : 0;

        // Map assignments with completion and submission status
        const assignmentsWithStatus = assignments.map(assignment => {
            const submissionStatus = submissionMap.get(assignment.id) || null;
            return {
                id: assignment.id,
                title: assignment.title,
                description: assignment.description,
                dueDate: assignment.dueDate,
                isCompleted: submissionStatus === 'APPROVED',
                submissionStatus: submissionStatus // null, 'PENDING', 'APPROVED', 'REJECTED'
            };
        });

        res.json({
            success: true,
            data: {
                totalAssignments,
                completedAssignments,
                progressPercentage,
                assignments: assignmentsWithStatus
            }
        });
    } catch (error) {
        next(error);
    }
};
