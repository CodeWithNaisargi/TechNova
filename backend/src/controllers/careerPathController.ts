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
 * Update logged-in student's interested career path
 */
export const updateStudentInterest = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { careerPathId } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        if (!careerPathId) {
            return res.status(400).json({
                success: false,
                message: 'Career path ID is required',
            });
        }

        // Verify career path exists
        const careerPath = await prisma.careerPath.findUnique({
            where: { id: careerPathId },
        });

        if (!careerPath) {
            return res.status(404).json({
                success: false,
                message: 'Career path not found',
            });
        }

        // Update user's interested career path
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { interestedCareerPathId: careerPathId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
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
