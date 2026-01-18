import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { CareerPath, CareerSkill, Skill } from '@prisma/client';

/**
 * GET /api/career-paths
 * Get all career paths with their associated skills
 */
export const getAllCareerPaths = async (req: Request, res: Response) => {
    try {
        const careerPaths = await prisma.careerPath.findMany({
            include: {
                skills: {
                    include: {
                        skill: true,
                    },
                },
            },
            orderBy: {
                title: 'asc',
            },
        });

        // Transform data to flatten skills
        const transformedPaths = careerPaths.map((path) => ({
            id: path.id,
            title: path.title,
            description: path.description,
            domain: path.domain,
            createdAt: path.createdAt,
            skills: path.skills.map((cs) => ({
                id: cs.skill.id,
                name: cs.skill.name,
                description: cs.skill.description,
            })),
        }));

        return res.status(200).json({
            success: true,
            data: transformedPaths,
        });
    } catch (error) {
        console.error('Error fetching career paths:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch career paths',
        });
    }
};

/**
 * PUT /api/career-paths/student/interest
 * Update logged-in student's interested career path and/or career focus
 * Supports both legacy careerPathId and new careerFocusId
 */
export const updateStudentInterest = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { careerPathId, careerFocusId } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        // At least one of careerPathId or careerFocusId must be provided
        if (!careerPathId && !careerFocusId) {
            return res.status(400).json({
                success: false,
                message: 'Career path ID or career focus ID is required',
            });
        }

        // Build update data
        const updateData: { interestedCareerPathId?: string; careerFocusId?: string } = {};

        // If careerPathId provided, verify it exists
        if (careerPathId) {
            const careerPath = await prisma.careerPath.findUnique({
                where: { id: careerPathId },
            });

            if (!careerPath) {
                return res.status(404).json({
                    success: false,
                    message: 'Career path not found',
                });
            }
            updateData.interestedCareerPathId = careerPathId;
        }

        // careerFocusId is from config (no DB validation needed)
        if (careerFocusId) {
            updateData.careerFocusId = careerFocusId;
        }

        // Update user's career interest and mark onboarding as complete
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...updateData,
                // Mark onboarding complete when careerFocusId is set
                ...(careerFocusId && { onboardingCompleted: true }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                educationLevel: true,
                careerFocusId: true,
                interestedCareerPathId: true,
                interestedCareerPath: {
                    select: {
                        id: true,
                        title: true,
                        domain: true,
                    },
                },
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Career interest updated successfully',
            data: updatedUser,
        });
    } catch (error) {
        console.error('Error updating student interest:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update career interest',
        });
    }
};
