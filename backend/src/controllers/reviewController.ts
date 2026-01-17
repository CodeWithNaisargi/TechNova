import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { Role } from '@prisma/client';

// Create review
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, rating, comment } = req.body;

        // Check if enrolled
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: req.user!.id,
                    courseId
                }
            }
        });

        if (!enrollment) {
            return res.status(403).json({ success: false, message: 'Must be enrolled to review' });
        }

        // Check if already reviewed
        const existing = await prisma.review.findFirst({
            where: {
                userId: req.user!.id,
                courseId
            }
        });

        if (existing) {
            return res.status(400).json({ success: false, message: 'Already reviewed this course' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }

        const review = await prisma.review.create({
            data: {
                userId: req.user!.id,
                courseId,
                rating,
                comment
            },
            include: {
                user: { select: { name: true, avatar: true } }
            }
        });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
};

// Update review
export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rating, comment } = req.body;
        const review = await prisma.review.findUnique({
            where: { id: req.params.id }
        });

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        if (review.userId !== req.user!.id && req.user!.role !== Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }

        const updated = await prisma.review.update({
            where: { id: req.params.id },
            data: { rating, comment },
            include: {
                user: { select: { name: true, avatar: true } }
            }
        });

        res.json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
};

// Delete review
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const review = await prisma.review.findUnique({
            where: { id: req.params.id }
        });

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        if (review.userId !== req.user!.id && req.user!.role !== Role.ADMIN) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await prisma.review.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Review deleted' });
    } catch (error) {
        next(error);
    }
};

// Get course reviews
export const getCourseReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviews = await prisma.review.findMany({
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
    } catch (error) {
        next(error);
    }
};

