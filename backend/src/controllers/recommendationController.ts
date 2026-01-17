import { Request, Response } from 'express';
import {
    getRecommendations,
    getNextFocusSkill,
    getStudentVector,
} from '../services/recommendationService';

/**
 * GET /api/recommendations
 * Get personalized course recommendations for the logged-in student
 */
export const getCourseRecommendations = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const limit = parseInt(req.query.limit as string) || 10;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        const recommendations = await getRecommendations(userId, limit);

        return res.status(200).json({
            success: true,
            data: recommendations,
            meta: {
                algorithm: 'Content-Based Feature Vector',
                limit,
            },
        });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get recommendations',
        });
    }
};

/**
 * GET /api/recommendations/next-skill
 * Get the next focus skill suggestion for the student
 */
export const getNextSkillSuggestion = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        const nextSkill = await getNextFocusSkill(userId);

        return res.status(200).json({
            success: true,
            data: nextSkill,
        });
    } catch (error) {
        console.error('Error getting next skill:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get next skill suggestion',
        });
    }
};

/**
 * GET /api/recommendations/profile
 * Get the student's feature vector (for debugging/transparency)
 */
export const getStudentProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        const vector = await getStudentVector(userId);

        return res.status(200).json({
            success: true,
            data: {
                featureVector: vector,
                features: [
                    'education_level',
                    'skill_javascript', 'skill_python', 'skill_react', 'skill_nodejs', 'skill_sql',
                    'skill_iot', 'skill_analytics', 'skill_gis', 'skill_healthcare', 'skill_ml',
                    'skill_html5', 'skill_css3', 'skill_typescript', 'skill_aws', 'skill_docker',
                    'project_count',
                    'career_domain',
                ],
            },
        });
    } catch (error) {
        console.error('Error getting student profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get student profile',
        });
    }
};
