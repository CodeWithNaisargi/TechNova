"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentProfile = exports.getNextSkillSuggestion = exports.getCourseRecommendations = void 0;
const recommendationService_1 = require("../services/recommendationService");
/**
 * GET /api/recommendations
 * Get personalized course recommendations for the logged-in student
 */
const getCourseRecommendations = async (req, res) => {
    try {
        const userId = req.user?.id;
        const limit = parseInt(req.query.limit) || 10;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }
        const recommendations = await (0, recommendationService_1.getRecommendations)(userId, limit);
        return res.status(200).json({
            success: true,
            data: recommendations,
            meta: {
                algorithm: 'Content-Based Feature Vector',
                limit,
            },
        });
    }
    catch (error) {
        console.error('Error getting recommendations:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get recommendations',
        });
    }
};
exports.getCourseRecommendations = getCourseRecommendations;
/**
 * GET /api/recommendations/next-skill
 * Get the next focus skill suggestion for the student
 */
const getNextSkillSuggestion = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }
        const nextSkill = await (0, recommendationService_1.getNextFocusSkill)(userId);
        return res.status(200).json({
            success: true,
            data: nextSkill,
        });
    }
    catch (error) {
        console.error('Error getting next skill:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get next skill suggestion',
        });
    }
};
exports.getNextSkillSuggestion = getNextSkillSuggestion;
/**
 * GET /api/recommendations/profile
 * Get the student's feature vector (for debugging/transparency)
 */
const getStudentProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }
        const vector = await (0, recommendationService_1.getStudentVector)(userId);
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
    }
    catch (error) {
        console.error('Error getting student profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get student profile',
        });
    }
};
exports.getStudentProfile = getStudentProfile;
