"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInsightsUnlockStatus = exports.getStudentInsights = void 0;
const behaviorAnalysisService_1 = require("../services/behaviorAnalysisService");
/**
 * Get student behavior insights
 * Returns unlock status + insights (if unlocked)
 */
const getStudentInsights = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        const insights = await (0, behaviorAnalysisService_1.generateInsights)(userId);
        if (!insights) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            data: insights
        });
    }
    catch (error) {
        console.error('Insights error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate insights'
        });
    }
};
exports.getStudentInsights = getStudentInsights;
/**
 * Get unlock status only (lightweight endpoint)
 */
const getInsightsUnlockStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        const status = await (0, behaviorAnalysisService_1.getUnlockStatus)(userId);
        res.json({
            success: true,
            data: status
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get unlock status'
        });
    }
};
exports.getInsightsUnlockStatus = getInsightsUnlockStatus;
