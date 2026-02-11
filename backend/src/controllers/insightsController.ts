import { Request, Response } from 'express';
import { getUnlockStatus, generateInsights } from '../services/behaviorAnalysisService';

/**
 * Get student behavior insights
 * Returns unlock status + insights (if unlocked)
 */
export const getStudentInsights = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const insights = await generateInsights(userId);

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
    } catch (error: any) {
        console.error('Insights error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate insights'
        });
    }
};

/**
 * Get unlock status only (lightweight endpoint)
 */
export const getInsightsUnlockStatus = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const status = await getUnlockStatus(userId);

        res.json({
            success: true,
            data: status
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get unlock status'
        });
    }
};
