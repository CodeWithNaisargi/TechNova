"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLesson = exports.addSection = exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.getCategories = exports.getNewCourses = exports.getPopularCourses = exports.getCourses = exports.createCourse = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = async (req, res, next) => {
    try {
        const { title, description, category, price, tags, difficulty, duration, prerequisites, learningOutcomes } = req.body;
        const thumbnail = req.file ? `/uploads/thumbnails/${req.file.filename}` : req.body.thumbnail;
        const course = await prisma_1.default.course.create({
            data: {
                title,
                description,
                category,
                price: parseFloat(price || 0),
                tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [],
                thumbnail,
                difficulty: difficulty || 'BEGINNER',
                duration,
                prerequisites: prerequisites ? (Array.isArray(prerequisites) ? prerequisites : []) : [],
                learningOutcomes: learningOutcomes ? (Array.isArray(learningOutcomes) ? learningOutcomes : []) : [],
                instructorId: req.user.id,
            },
        });
        res.status(201).json({ success: true, data: course });
    }
    catch (error) {
        next(error);
    }
};
exports.createCourse = createCourse;
// @desc    Get all courses (Public - with filters)
// @route   GET /api/courses
// @access  Public
// Filters: search, category, difficulty, educationLevel (STRICT), domain
const getCourses = async (req, res, next) => {
    try {
        const { search, category, difficulty, educationLevel, domain } = req.query;
        const where = { isPublished: true };
        // Text search
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        // Category filter
        if (category) {
            where.category = category;
        }
        // Difficulty filter (optional refinement)
        if (difficulty) {
            where.difficulty = difficulty;
        }
        // STRICT Education Level Filter
        // Course.targetEducationLevel MUST EQUAL user.educationLevel
        // This ensures 10th students NEVER see UG/PG courses
        if (educationLevel) {
            where.targetEducationLevel = educationLevel;
        }
        // Domain filter (from career focus)
        if (domain) {
            where.domain = domain;
        }
        const courses = await prisma_1.default.course.findMany({
            where,
            include: {
                instructor: { select: { name: true, avatar: true } },
                _count: {
                    select: { enrollments: true, reviews: true }
                }
            },
        });
        res.json({ success: true, data: courses });
    }
    catch (error) {
        next(error);
    }
};
exports.getCourses = getCourses;
// @desc    Get popular courses
// @route   GET /api/courses/popular
// @access  Public
const getPopularCourses = async (req, res, next) => {
    try {
        const { educationLevel, domain } = req.query;
        const where = { isPublished: true };
        // STRICT Education Level Filter
        if (educationLevel) {
            where.targetEducationLevel = educationLevel;
        }
        // Domain filter
        if (domain) {
            where.domain = domain;
        }
        const courses = await prisma_1.default.course.findMany({
            where,
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
    }
    catch (error) {
        next(error);
    }
};
exports.getPopularCourses = getPopularCourses;
// @desc    Get new/recent courses
// @route   GET /api/courses/new
// @access  Public
const getNewCourses = async (req, res, next) => {
    try {
        const courses = await prisma_1.default.course.findMany({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getNewCourses = getNewCourses;
// @desc    Get all categories
// @route   GET /api/courses/categories
// @access  Public
const getCategories = async (req, res, next) => {
    try {
        const categories = await prisma_1.default.course.groupBy({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getCategories = getCategories;
// @desc    Get course by ID (Public)
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
    try {
        const course = await prisma_1.default.course.findUnique({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getCourseById = getCourseById;
// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
const updateCourse = async (req, res, next) => {
    try {
        const course = await prisma_1.default.course.findUnique({ where: { id: req.params.id } });
        if (!course)
            return res.status(404).json({ success: false, message: 'Course not found' });
        if (course.instructorId !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const updateData = { ...req.body };
        if (req.file) {
            updateData.thumbnail = `/uploads/thumbnails/${req.file.filename}`;
        }
        if (updateData.tags && typeof updateData.tags === 'string') {
            updateData.tags = updateData.tags.split(',').map((t) => t.trim());
        }
        if (updateData.price) {
            updateData.price = parseFloat(updateData.price);
        }
        const updatedCourse = await prisma_1.default.course.update({
            where: { id: req.params.id },
            data: updateData,
        });
        res.json({ success: true, data: updatedCourse });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCourse = updateCourse;
// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor/Admin
const deleteCourse = async (req, res, next) => {
    try {
        const course = await prisma_1.default.course.findUnique({ where: { id: req.params.id } });
        if (!course)
            return res.status(404).json({ success: false, message: 'Course not found' });
        if (course.instructorId !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        await prisma_1.default.course.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Course deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCourse = deleteCourse;
// @desc    Add Section
// @route   POST /api/courses/:id/sections
// @access  Private/Instructor
const addSection = async (req, res, next) => {
    try {
        const course = await prisma_1.default.course.findUnique({ where: { id: req.params.id } });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        if (course.instructorId !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const { title, description, order } = req.body;
        // Get the highest order number if order not provided
        const maxOrder = await prisma_1.default.section.findFirst({
            where: { courseId: req.params.id },
            orderBy: { order: 'desc' },
            select: { order: true }
        });
        const section = await prisma_1.default.section.create({
            data: {
                title,
                description: description || null,
                order: order || (maxOrder ? maxOrder.order + 1 : 1),
                courseId: req.params.id
            }
        });
        res.status(201).json({ success: true, data: section });
    }
    catch (error) {
        next(error);
    }
};
exports.addSection = addSection;
// @desc    Add Lesson
// @route   POST /api/sections/:id/lessons
// @access  Private/Instructor
const addLesson = async (req, res, next) => {
    try {
        const section = await prisma_1.default.section.findUnique({
            where: { id: req.params.id },
            include: { course: true }
        });
        if (!section) {
            return res.status(404).json({ success: false, message: 'Section not found' });
        }
        if (section.course.instructorId !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
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
        const maxOrder = await prisma_1.default.lesson.findFirst({
            where: { sectionId: req.params.id },
            orderBy: { order: 'desc' },
            select: { order: true }
        });
        // Convert string values from FormData to proper types
        const lessonData = {
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
        const lesson = await prisma_1.default.lesson.create({
            data: lessonData
        });
        console.log('Lesson created successfully:', lesson.id);
        res.status(201).json({ success: true, data: lesson });
    }
    catch (error) {
        console.error('Error creating lesson:', error);
        next(error);
    }
};
exports.addLesson = addLesson;
