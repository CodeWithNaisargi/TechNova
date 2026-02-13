"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEducationLevels = exports.updateEducationLevel = exports.getEducationLevel = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
/**
 * GET /api/student/education-level
 * Get current user's education level
 */
const getEducationLevel = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                educationLevel: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        return res.status(200).json({
            success: true,
            data: {
                educationLevel: user.educationLevel,
            },
        });
    }
    catch (error) {
        console.error('Error fetching education level:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch education level',
        });
    }
};
exports.getEducationLevel = getEducationLevel;
/**
 * PUT /api/student/education-level
 * Set/Update student's education level
 */
const updateEducationLevel = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { educationLevel } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }
        // Validate education level
        const validLevels = [
            'SECONDARY',
            'HIGHER_SECONDARY',
            'DIPLOMA',
            'UNDERGRADUATE',
            'POSTGRADUATE',
        ];
        if (!educationLevel || !validLevels.includes(educationLevel)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid education level. Must be one of: ' + validLevels.join(', '),
            });
        }
        // Update user's education level
        const updatedUser = await prisma_1.default.user.update({
            where: { id: userId },
            data: { educationLevel },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                educationLevel: true,
                interestedCareerPathId: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: 'Education level updated successfully',
            data: updatedUser,
        });
    }
    catch (error) {
        console.error('Error updating education level:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update education level',
        });
    }
};
exports.updateEducationLevel = updateEducationLevel;
/**
 * GET /api/education-levels
 * Get all available education levels
 */
const getAllEducationLevels = async (_req, res) => {
    try {
        const levels = [
            { value: 'SECONDARY', label: 'Secondary (10th)', description: 'Completed 10th grade / SSC' },
            { value: 'HIGHER_SECONDARY', label: 'Higher Secondary (12th)', description: 'Completed 12th grade / HSC' },
            { value: 'DIPLOMA', label: 'Diploma', description: 'Technical diploma / ITI' },
            { value: 'UNDERGRADUATE', label: 'Undergraduate', description: 'Pursuing or completed Bachelor\'s degree' },
            { value: 'POSTGRADUATE', label: 'Postgraduate', description: 'Pursuing or completed Master\'s degree or above' },
        ];
        return res.status(200).json({
            success: true,
            data: levels,
        });
    }
    catch (error) {
        console.error('Error fetching education levels:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch education levels',
        });
    }
};
exports.getAllEducationLevels = getAllEducationLevels;
