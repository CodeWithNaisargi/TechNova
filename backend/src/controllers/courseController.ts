import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { Role } from '@prisma/client';

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, category, price, tags, difficulty, duration, prerequisites, learningOutcomes } = req.body;
        const thumbnail = req.file ? `/uploads/thumbnails/${req.file.filename}` : req.body.thumbnail;

        const course = await prisma.course.create({
            data: {
                title,
                description,
                category,
                price: parseFloat(price || 0),
                tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim())) : [],
                thumbnail,
                difficulty: difficulty || 'BEGINNER',
                duration,
                prerequisites: prerequisites ? (Array.isArray(prerequisites) ? prerequisites : []) : [],
                learningOutcomes: learningOutcomes ? (Array.isArray(learningOutcomes) ? learningOutcomes : []) : [],
                instructorId: req.user!.id,
            },
        });
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all courses (Public - with filters)
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, category, difficulty } = req.query;
        const where: any = { isPublished: true };

        if (search) {
            where.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } },
            ];
        }
        if (category) {
            where.category = category as string;
        }
        if (difficulty) {
            where.difficulty = difficulty as string;
        }

        const courses = await prisma.course.findMany({
            where,
            include: {
                instructor: { select: { name: true, avatar: true } },
                _count: {
                    select: { enrollments: true, reviews: true }
                }
            },
        });
        res.json({ success: true, data: courses });
    } catch (error) {
        next(error);
    }
};

// @desc    Get popular courses
// @route   GET /api/courses/popular
// @access  Public
export const getPopularCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await prisma.course.findMany({
            where: { isPublished: true },
            include: {
                instructor: { select: { name: true, avatar: true } },
                _count: {
                    select: { enrollments: true, reviews: true }
                }
            },
            orderBy: {
                enrollments: {
                    _count: 'desc'
                }
            },
            take: 8
        });
        res.json({ success: true, data: courses });
    } catch (error) {
        next(error);
    }
};

// @desc    Get new/recent courses
// @route   GET /api/courses/new
// @access  Public
export const getNewCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await prisma.course.findMany({
            where: { isPublished: true },
            include: {
                instructor: { select: { name: true, avatar: true } },
                _count: {
                    select: { enrollments: true, reviews: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 8
        });
        res.json({ success: true, data: courses });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all categories
// @route   GET /api/courses/categories
// @access  Public
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await prisma.course.groupBy({
            by: ['category'],
            where: { isPublished: true },
            _count: {
                category: true
            }
        });

        const formattedCategories = categories.map(cat => ({
            name: cat.category,
            count: cat._count.category
        }));

        res.json({ success: true, data: formattedCategories });
    } catch (error) {
        next(error);
    }
};

// @desc    Get course by ID (Public)
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const course = await prisma.course.findUnique({
            where: { id: req.params.id },
            include: {
                instructor: { select: { name: true, avatar: true, bio: true } },
                sections: {
                    include: {
                        lessons: {
                            select: { id: true, title: true, isFree: true, order: true, videoUrl: false } // Hide video URL for non-enrolled
                        }
                    },
                    orderBy: { order: 'asc' }
                },
                reviews: {
                    include: { user: { select: { name: true, avatar: true } } }
                },
                _count: {
                    select: { enrollments: true, assignments: true }
                }
            },
        });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.json({ success: true, data: course });
    } catch (error) {
        next(error);
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const course = await prisma.course.findUnique({ where: { id: req.params.id } });
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        if (course.instructorId !== req.user!.id && req.user!.role !== Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const updateData: any = { ...req.body };
        if (req.file) {
            updateData.thumbnail = `/uploads/thumbnails/${req.file.filename}`;
        }
        if (updateData.tags && typeof updateData.tags === 'string') {
            updateData.tags = updateData.tags.split(',').map((t: string) => t.trim());
        }
        if (updateData.price) {
            updateData.price = parseFloat(updateData.price);
        }

        const updatedCourse = await prisma.course.update({
            where: { id: req.params.id },
            data: updateData,
        });
        res.json({ success: true, data: updatedCourse });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor/Admin
export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const course = await prisma.course.findUnique({ where: { id: req.params.id } });
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        if (course.instructorId !== req.user!.id && req.user!.role !== Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await prisma.course.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Course deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Add Section
// @route   POST /api/courses/:id/sections
// @access  Private/Instructor
export const addSection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const course = await prisma.course.findUnique({ where: { id: req.params.id } });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        if (course.instructorId !== req.user!.id && req.user!.role !== Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const { title, description, order } = req.body;

        // Get the highest order number if order not provided
        const maxOrder = await prisma.section.findFirst({
            where: { courseId: req.params.id },
            orderBy: { order: 'desc' },
            select: { order: true }
        });

        const section = await prisma.section.create({
            data: {
                title,
                description: description || null,
                order: order || (maxOrder ? maxOrder.order + 1 : 1),
                courseId: req.params.id
            }
        });
        res.status(201).json({ success: true, data: section });
    } catch (error) {
        next(error);
    }
}

// @desc    Add Lesson
// @route   POST /api/sections/:id/lessons
// @access  Private/Instructor
export const addLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const section = await prisma.section.findUnique({
            where: { id: req.params.id },
            include: { course: true }
        });

        if (!section) {
            return res.status(404).json({ success: false, message: 'Section not found' });
        }

        if (section.course.instructorId !== req.user!.id && req.user!.role !== Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Handle both JSON and FormData
        let { title, description, videoUrl, isFree, order, duration } = req.body;

        // Trim values first
        title = title?.trim();
        description = description?.trim();
        videoUrl = videoUrl?.trim();

        // Validate required fields AFTER trimming
        if (!title || title.length === 0) {
            console.error('Validation failed: Title is missing or empty');
            return res.status(400).json({
                success: false,
                message: 'Lesson title is required'
            });
        }

        if (!videoUrl || videoUrl.length === 0) {
            console.error('Validation failed: Video URL is missing or empty');
            return res.status(400).json({
                success: false,
                message: 'Video URL is required'
            });
        }

        // Get the highest order number if order not provided
        const maxOrder = await prisma.lesson.findFirst({
            where: { sectionId: req.params.id },
            orderBy: { order: 'desc' },
            select: { order: true }
        });

        // Convert string values from FormData to proper types
        const lessonData: any = {
            title,
            description: description || null,
            videoUrl,
            isFree: isFree === 'true' || isFree === true || isFree === 'on',
            order: order ? parseInt(order) : (maxOrder ? maxOrder.order + 1 : 1),
            sectionId: req.params.id
        };

        // Add duration if provided
        if (duration && duration !== '') {
            lessonData.duration = parseFloat(duration);
        }

        console.log('Creating lesson with data:', lessonData);

        const lesson = await prisma.lesson.create({
            data: lessonData
        });

        console.log('Lesson created successfully:', lesson.id);
        res.status(201).json({ success: true, data: lesson });
    } catch (error) {
        console.error('Error creating lesson:', error);
        next(error);
    }
}
