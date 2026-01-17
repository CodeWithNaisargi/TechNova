"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseReviews = exports.deleteReview = exports.updateReview = exports.createReview = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
// Create review
const createReview = async (req, res, next) => {
    try {
        const { courseId, rating, comment } = req.body;
        // Check if enrolled
        const enrollment = await prisma_1.default.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: req.user.id,
                    courseId
                }
            }
        });
        if (!enrollment) {
            return res.status(403).json({ success: false, message: 'Must be enrolled to review' });
        }
        // Check if already reviewed
        const existing = await prisma_1.default.review.findFirst({
            where: {
                userId: req.user.id,
                courseId
            }
        });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Already reviewed this course' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }
        const review = await prisma_1.default.review.create({
            data: {
                userId: req.user.id,
                courseId,
                rating,
                comment
            },
            include: {
                user: { select: { name: true, avatar: true } }
            }
        });
        res.status(201).json({ success: true, data: review });
    }
    catch (error) {
        next(error);
    }
};
exports.createReview = createReview;
// Update review
const updateReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const review = await prisma_1.default.review.findUnique({
            where: { id: req.params.id }
        });
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        if (review.userId !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }
        const updated = await prisma_1.default.review.update({
            where: { id: req.params.id },
            data: { rating, comment },
            include: {
                user: { select: { name: true, avatar: true } }
            }
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.updateReview = updateReview;
// Delete review
const deleteReview = async (req, res, next) => {
    try {
        const review = await prisma_1.default.review.findUnique({
            where: { id: req.params.id }
        });
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        if (review.userId !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        await prisma_1.default.review.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Review deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteReview = deleteReview;
// Get course reviews
const getCourseReviews = async (req, res, next) => {
    try {
        const reviews = await prisma_1.default.review.findMany({
            where: { courseId: req.params.courseId },
            include: {
                user: { select: { name: true, avatar: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        // Calculate rating stats
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0;
        const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
            rating,
            count: reviews.filter(r => r.rating === rating).length
        }));
        res.json({
            success: true,
            data: {
                reviews,
                stats: {
                    totalReviews,
                    averageRating: Math.round(averageRating * 10) / 10,
                    ratingDistribution
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCourseReviews = getCourseReviews;
