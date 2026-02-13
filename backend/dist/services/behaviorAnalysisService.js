"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnlockStatus = getUnlockStatus;
exports.generateInsights = generateInsights;
const prisma_1 = __importDefault(require("../config/prisma"));
/**
 * Student Behavior Analysis Service
 *
 * CORE PRINCIPLES:
 * 1. Deterministic, explainable logic - NO ML
 * 2. Insights unlock ONLY after sufficient data (5 enrolled, 3 completed)
 * 3. All calculations are auditable and data-driven
 * 4. OpenAI is OPTIONAL post-processing only (not implemented here)
 */
// Unlock thresholds
const REQUIRED_ENROLLED = 5;
const REQUIRED_COMPLETED = 3;
/**
 * Get unlock status for a student
 */
async function getUnlockStatus(userId) {
    // Count enrolled courses
    const enrolledCount = await prisma_1.default.enrollment.count({
        where: { userId }
    });
    // Count completed courses (certificate issued)
    const completedCount = await prisma_1.default.certificate.count({
        where: { userId }
    });
    const isUnlocked = enrolledCount >= REQUIRED_ENROLLED && completedCount >= REQUIRED_COMPLETED;
    return {
        isUnlocked,
        enrolledCount,
        completedCount,
        requiredEnrolled: REQUIRED_ENROLLED,
        requiredCompleted: REQUIRED_COMPLETED,
        enrolledProgress: Math.min((enrolledCount / REQUIRED_ENROLLED) * 100, 100),
        completedProgress: Math.min((completedCount / REQUIRED_COMPLETED) * 100, 100)
    };
}
/**
 * Calculate engagement score
 * Formula: (completed courses / enrolled courses) * 100
 */
function calculateEngagement(enrolled, completed) {
    if (enrolled === 0) {
        return { score: 0, level: 'LOW', description: 'Start enrolling in courses to begin your journey.' };
    }
    const score = Math.round((completed / enrolled) * 100);
    let level;
    let description;
    if (score >= 80) {
        level = 'EXCELLENT';
        description = 'Outstanding! You complete most courses you start, showing great commitment.';
    }
    else if (score >= 60) {
        level = 'HIGH';
        description = 'Great engagement! You consistently complete courses you enroll in.';
    }
    else if (score >= 40) {
        level = 'MODERATE';
        description = 'Good start! Try to complete more courses to maximize your learning.';
    }
    else {
        level = 'LOW';
        description = 'Consider completing courses before enrolling in new ones.';
    }
    return { score, level, description };
}
/**
 * Calculate skill growth from completed courses
 */
async function calculateSkillGrowth(userId) {
    const userSkills = await prisma_1.default.userSkill.findMany({
        where: { userId },
        include: { skill: true }
    });
    const skillsAcquired = userSkills.map(us => us.skill.name);
    const totalSkills = skillsAcquired.length;
    // Score based on skill count
    let score;
    let level;
    if (totalSkills >= 10) {
        score = 100;
        level = 'EXCELLENT';
    }
    else if (totalSkills >= 7) {
        score = 80;
        level = 'HIGH';
    }
    else if (totalSkills >= 4) {
        score = 60;
        level = 'MODERATE';
    }
    else if (totalSkills >= 1) {
        score = 40;
        level = 'GROWING';
    }
    else {
        score = 0;
        level = 'STARTING';
    }
    return { score, level, skillsAcquired, totalSkills };
}
/**
 * Calculate career alignment
 * Compare student's skills with career-required skills
 */
async function calculateCareerAlignment(userId) {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        include: {
            interestedCareerPath: {
                include: {
                    skills: { include: { skill: true } }
                }
            },
            userSkills: { include: { skill: true } }
        }
    });
    if (!user) {
        return { score: 0, matchedSkills: [], missingSkills: [], alignmentPercentage: 0 };
    }
    let careerPath = user.interestedCareerPath;
    // Fallback: If no explicit career path relation, try to match by domain inferred from careerFocusId
    if (!careerPath && user.careerFocusId) {
        let domainMatch = null;
        const focusId = user.careerFocusId.toLowerCase();
        if (focusId.includes('agri'))
            domainMatch = 'AGRICULTURE';
        else if (focusId.includes('health'))
            domainMatch = 'HEALTHCARE';
        else if (focusId.includes('urban'))
            domainMatch = 'URBAN';
        else if (focusId.includes('tech') || focusId.includes('data') || focusId.includes('engineering') || focusId.includes('science'))
            domainMatch = 'TECH';
        if (domainMatch) {
            careerPath = await prisma_1.default.careerPath.findFirst({
                where: { domain: domainMatch },
                include: {
                    skills: { include: { skill: true } }
                }
            });
        }
    }
    if (!careerPath) {
        return {
            score: 0,
            matchedSkills: [],
            missingSkills: [],
            alignmentPercentage: 0
        };
    }
    const careerSkills = careerPath.skills.map(cs => cs.skill.name);
    const userSkillNames = user.userSkills.map(us => us.skill.name.toLowerCase());
    const matchedSkills = careerSkills.filter(cs => userSkillNames.includes(cs.toLowerCase()));
    const missingSkills = careerSkills.filter(cs => !userSkillNames.includes(cs.toLowerCase()));
    const alignmentPercentage = careerSkills.length > 0
        ? Math.round((matchedSkills.length / careerSkills.length) * 100)
        : 0;
    return {
        score: alignmentPercentage,
        matchedSkills,
        missingSkills,
        alignmentPercentage
    };
}
/**
 * Calculate learning consistency
 * Based on domain diversity of completed courses
 */
async function calculateConsistency(userId) {
    const certificates = await prisma_1.default.certificate.findMany({
        where: { userId },
        include: {
        // We need to get course domain through the courseId
        }
    });
    // Get courses for the certificates
    const courseIds = certificates.map(c => c.courseId);
    const courses = await prisma_1.default.course.findMany({
        where: { id: { in: courseIds } },
        select: { domain: true }
    });
    const domains = courses.map(c => c.domain).filter(Boolean);
    const uniqueDomains = [...new Set(domains)];
    // Higher consistency = fewer unique domains (focused learning)
    // Lower consistency = many unique domains (scattered)
    let score;
    let level;
    let description;
    if (domains.length === 0) {
        score = 0;
        level = 'LOW';
        description = 'Complete courses to establish your learning pattern.';
    }
    else if (uniqueDomains.length <= 2) {
        score = 100;
        level = 'EXCELLENT';
        description = "Highly focused learning! You are building deep expertise.";
    }
    else if (uniqueDomains.length <= 3) {
        score = 75;
        level = 'HIGH';
        description = 'Good focus with some exploration.';
    }
    else if (uniqueDomains.length <= 4) {
        score = 50;
        level = 'MODERATE';
        description = 'Diverse learning across multiple domains.';
    }
    else {
        score = 30;
        level = 'LOW';
        description = 'Very diverse - consider focusing on your career path.';
    }
    return { score, level, description };
}
/**
 * Generate course recommendations based on career gaps
 */
async function generateRecommendations(userId, missingSkills, educationLevel) {
    // Find courses that teach missing skills
    const recommendedCourses = await prisma_1.default.course.findMany({
        where: {
            isPublished: true,
            ...(educationLevel && { targetEducationLevel: educationLevel }),
            OR: [
                { tags: { hasSome: missingSkills.map(s => s.toLowerCase()) } },
                { courseSkills: { some: { skill: { name: { in: missingSkills } } } } }
            ]
        },
        take: 5,
        select: { id: true, title: true, tags: true }
    });
    // Filter out already enrolled courses
    const enrolledCourses = await prisma_1.default.enrollment.findMany({
        where: { userId },
        select: { courseId: true }
    });
    const enrolledIds = new Set(enrolledCourses.map(e => e.courseId));
    const filteredCourses = recommendedCourses
        .filter(c => !enrolledIds.has(c.id))
        .slice(0, 3)
        .map(c => ({
        id: c.id,
        title: c.title,
        reason: `Helps you gain skills in: ${c.tags.slice(0, 2).join(', ')}`
    }));
    const actions = [];
    if (missingSkills.length > 0) {
        actions.push(`Focus on developing: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    if (filteredCourses.length > 0) {
        actions.push('Enroll in recommended courses to fill skill gaps');
    }
    actions.push('Complete your enrolled courses to earn certificates');
    return {
        courses: filteredCourses,
        skillsToFocus: missingSkills.slice(0, 5),
        actions
    };
}
/**
 * Generate complete student insights (ONLY when unlocked)
 */
async function generateInsights(userId) {
    const unlockStatus = await getUnlockStatus(userId);
    // Get student profile
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            name: true,
            educationLevel: true,
            careerFocusId: true,
            interestedCareerPath: { select: { title: true } }
        }
    });
    if (!user)
        return null;
    // If not unlocked, return minimal data
    if (!unlockStatus.isUnlocked) {
        return {
            unlockStatus,
            engagement: { score: 0, level: 'LOW', description: 'Unlock insights by completing more courses.' },
            skillGrowth: { score: 0, level: 'LOCKED', skillsAcquired: [], totalSkills: 0 },
            careerAlignment: { score: 0, matchedSkills: [], missingSkills: [], alignmentPercentage: 0 },
            consistency: { score: 0, level: 'LOW', description: 'Unlock insights by completing more courses.' },
            careerReadiness: { percentage: 0, status: 'LOCKED', breakdown: { engagement: 0, skillGrowth: 0, careerAlignment: 0, consistency: 0 } },
            feedback: { strengths: [], improvements: ['Complete more courses to unlock personalized insights'], whyItMatters: '' },
            recommendations: { courses: [], skillsToFocus: [], actions: ['Enroll in at least 5 courses', 'Complete at least 3 courses with certificates'] },
            studentProfile: {
                name: user.name,
                educationLevel: user.educationLevel,
                careerFocus: user.interestedCareerPath?.title || user.careerFocusId || null
            }
        };
    }
    // Calculate all dimensions
    const engagement = calculateEngagement(unlockStatus.enrolledCount, unlockStatus.completedCount);
    const skillGrowth = await calculateSkillGrowth(userId);
    const careerAlignment = await calculateCareerAlignment(userId);
    const consistency = await calculateConsistency(userId);
    // Calculate overall career readiness (weighted average)
    const careerReadinessPercentage = Math.round((engagement.score * 0.25) +
        (skillGrowth.score * 0.25) +
        (careerAlignment.score * 0.30) +
        (consistency.score * 0.20));
    let careerStatus;
    if (careerReadinessPercentage >= 80)
        careerStatus = 'CAREER_READY';
    else if (careerReadinessPercentage >= 60)
        careerStatus = 'ON_TRACK';
    else if (careerReadinessPercentage >= 40)
        careerStatus = 'DEVELOPING';
    else
        careerStatus = 'EARLY_STAGE';
    // Generate feedback
    const strengths = [];
    const improvements = [];
    if (engagement.level === 'EXCELLENT' || engagement.level === 'HIGH') {
        strengths.push('Strong course completion rate');
    }
    else {
        improvements.push('Try to complete more enrolled courses');
    }
    if (skillGrowth.totalSkills >= 5) {
        strengths.push(`Acquired ${skillGrowth.totalSkills} valuable skills`);
    }
    else {
        improvements.push('Complete more courses to expand your skill set');
    }
    if (careerAlignment.alignmentPercentage >= 60) {
        strengths.push('Good alignment with your career goals');
    }
    else if (careerAlignment.missingSkills.length > 0) {
        improvements.push(`Develop missing skills: ${careerAlignment.missingSkills.slice(0, 2).join(', ')}`);
    }
    // Get recommendations
    const recommendations = await generateRecommendations(userId, careerAlignment.missingSkills, user.educationLevel);
    return {
        unlockStatus,
        engagement,
        skillGrowth,
        careerAlignment,
        consistency,
        careerReadiness: {
            percentage: careerReadinessPercentage,
            status: careerStatus,
            breakdown: {
                engagement: engagement.score,
                skillGrowth: skillGrowth.score,
                careerAlignment: careerAlignment.score,
                consistency: consistency.score
            }
        },
        feedback: {
            strengths,
            improvements,
            whyItMatters: `These insights are tailored to help you succeed in ${user.interestedCareerPath?.title || 'your chosen career path'}.`
        },
        recommendations,
        studentProfile: {
            name: user.name,
            educationLevel: user.educationLevel,
            careerFocus: user.interestedCareerPath?.title || user.careerFocusId || null
        }
    };
}
