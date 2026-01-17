"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLesson = exports.addSection = exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.getCourses = exports.createCourse = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = async (req, res, next) => {
    try {
        const { title, description, category, price, tags } = req.body;
        const thumbnail = req.file ? `/uploads/thumbnails/${req.file.filename}` : req.body.thumbnail;
        const course = await prisma_1.default.course.create({
            data: {
                title,
                description,
                category,
                price: parseFloat(price || 0),
                tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [],
                thumbnail,
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
const getCourses = async (req, res, next) => {
    try {
        const { search, category } = req.query;
        const where = { isPublished: true };
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (category) {
            where.category = category;
        }
        const courses = await prisma_1.default.course.findMany({
            where,
            include: { instructor: { select: { name: true, avatar: true } } },
        });
        res.json({ success: true, data: courses });
    }
    catch (error) {
        next(error);
    }
};
exports.getCourses = getCourses;
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
        const { title, order } = req.body;
        const section = await prisma_1.default.section.create({
            data: {
                title,
                order: order || 0,
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
        const { title, description, videoUrl, isFree, order } = req.body;
        const lesson = await prisma_1.default.lesson.create({
            data: {
                title,
                description,
                videoUrl: videoUrl || '',
                isFree: isFree || false,
                order: order || 0,
                sectionId: req.params.id
            }
        });
        res.status(201).json({ success: true, data: lesson });
    }
    catch (error) {
        next(error);
    }
};
exports.addLesson = addLesson;
