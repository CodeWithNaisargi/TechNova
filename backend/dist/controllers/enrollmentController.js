"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEnrollment = exports.getMyEnrollments = exports.enrollCourse = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private
const enrollCourse = async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;
        const existingEnrollment = await prisma_1.default.enrollment.findUnique({
            where: {
                userId_courseId: { userId, courseId },
            },
        });
        if (existingEnrollment) {
            return res.status(400).json({ success: false, message: 'Already enrolled' });
        }
        const enrollment = await prisma_1.default.enrollment.create({
            data: { userId, courseId },
        });
        res.status(201).json({ success: true, data: enrollment });
    }
    catch (error) {
        next(error);
    }
};
exports.enrollCourse = enrollCourse;
// @desc    Get my enrollments
// @route   GET /api/enrollments/my
// @access  Private
const getMyEnrollments = async (req, res, next) => {
    try {
        const enrollments = await prisma_1.default.enrollment.findMany({
            where: { userId: req.user.id },
            include: {
                course: {
                    select: { id: true, title: true, thumbnail: true, instructor: { select: { name: true } } },
                },
            },
        });
        res.json({ success: true, data: enrollments });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyEnrollments = getMyEnrollments;
// @desc    Check enrollment status
// @route   GET /api/enrollments/check/:courseId
// @access  Private
const checkEnrollment = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const enrollment = await prisma_1.default.enrollment.findUnique({
            where: { userId_courseId: { userId: req.user.id, courseId } }
        });
        res.json({ success: true, isEnrolled: !!enrollment });
    }
    catch (error) {
        next(error);
    }
};
exports.checkEnrollment = checkEnrollment;
