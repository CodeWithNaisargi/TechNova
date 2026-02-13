"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentInterest = exports.getAllCareerPaths = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const notification_service_1 = require("../modules/notification/notification.service");
const client_1 = require("@prisma/client");
/**
 * GET /api/career-paths
 * Get all career paths with their associated skills
 */
const getAllCareerPaths = async (req, res) => {
    try {
        const careerPaths = await prisma_1.default.careerPath.findMany({
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
    }
    catch (error) {
        console.error('Error fetching career paths:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch career paths',
        });
    }
};
exports.getAllCareerPaths = getAllCareerPaths;
/**
 * PUT /api/career-paths/student/interest
 * Update logged-in student's interested career path and/or career focus
 * Supports both legacy careerPathId and new careerFocusId
 */
const updateStudentInterest = async (req, res) => {
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
        const updateData = {};
        let pathTitle = '';
        // If careerPathId provided, verify it exists
        if (careerPathId) {
            const careerPath = await prisma_1.default.careerPath.findUnique({
                where: { id: careerPathId },
            });
            if (!careerPath) {
                return res.status(404).json({
                    success: false,
                    message: 'Career path not found',
                });
            }
            updateData.interestedCareerPathId = careerPathId;
            pathTitle = careerPath.title;
        }
        // careerFocusId is from config (no DB validation needed)
        if (careerFocusId) {
            updateData.careerFocusId = careerFocusId;
        }
        // Update user's career interest and mark onboarding as complete
        const updatedUser = await prisma_1.default.user.update({
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
        // Trigger notification
        await (0, notification_service_1.createNotification)({
            userId,
            title: 'Career Path Updated!',
            message: `You have successfully updated your career path${pathTitle ? ` to ${pathTitle}` : ''}. We'll recommend courses for you!`,
            type: client_1.NotificationType.PATH,
            link: '/dashboard'
        });
        return res.status(200).json({
            success: true,
            message: 'Career interest updated successfully',
            data: updatedUser,
        });
    }
    catch (error) {
        console.error('Error updating student interest:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update career interest',
        });
    }
};
exports.updateStudentInterest = updateStudentInterest;
