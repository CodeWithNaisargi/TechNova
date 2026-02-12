import prisma from '../config/prisma';
import { PrismaClient, EducationLevel, User, UserSkill, Skill, UserProject, CareerPath, CareerSkill } from '@prisma/client';

/**
 * ML Recommendation Service
 * Content-Based Feature Vector Model (NON-MATRIX)
 * 
 * Uses cosine similarity between student and course feature vectors
 * to generate personalized course recommendations.
 */

// Education level encoding (ordinal)
const EDUCATION_ENCODING: Record<EducationLevel, number> = {
    SECONDARY: 1,
    HIGHER_SECONDARY: 2,
    DIPLOMA: 3,
    UNDERGRADUATE: 4,
    POSTGRADUATE: 5,
};

// Domain encoding
const DOMAIN_ENCODING: Record<string, number> = {
    TECH: 1,
    AGRICULTURE: 2,
    HEALTHCARE: 3,
    URBAN: 4,
};

// Difficulty encoding
const DIFFICULTY_ENCODING: Record<string, number> = {
    BEGINNER: 1,
    INTERMEDIATE: 2,
    ADVANCED: 3,
};

// Core skills for feature vectors
const CORE_SKILLS = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL',
    'IoT', 'Data Analytics', 'GIS', 'Healthcare', 'Machine Learning',
    'HTML5', 'CSS3', 'TypeScript', 'AWS', 'Docker'
];

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (normA * normB);
}

/**
 * Build student feature vector
 * Features: [education_level, skill_scores..., project_count, career_domain]
 */
export async function getStudentVector(userId: string): Promise<number[]> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            userSkills: {
                include: { skill: true }
            },
            userProjects: true,
            interestedCareerPath: true,
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Education level (normalized 0-1)
    const educationScore = user.educationLevel
        ? EDUCATION_ENCODING[user.educationLevel] / 5
        : 0.5;

    // Skill scores (0-1 for each core skill)
    const skillScores = CORE_SKILLS.map(skillName => {
        const userSkill = user.userSkills.find(
            (us: UserSkill & { skill: Skill }) => us.skill.name.toLowerCase().includes(skillName.toLowerCase())
        );
        return userSkill ? userSkill.level / 100 : 0;
    });

    // Project count (normalized, max 10)
    const projectScore = Math.min(user.userProjects.length / 10, 1);

    // Career domain preference (encoded)
    const domainScore = user.interestedCareerPath?.domain
        ? DOMAIN_ENCODING[user.interestedCareerPath.domain] / 4
        : 0.5;

    return [educationScore, ...skillScores, projectScore, domainScore];
}

/**
 * Build course feature vector
 * Features: [target_education, skill_relevance..., has_project, domain, difficulty]
 */
export async function getCourseVector(courseId: string): Promise<number[]> {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            courseSkills: {
                include: { skill: true }
            },
        },
    });

    if (!course) {
        throw new Error('Course not found');
    }

    // Target education (normalized 0-1)
    const educationScore = course.targetEducationLevel
        ? EDUCATION_ENCODING[course.targetEducationLevel] / 5
        : 0.5;

    // Skill relevance (check course tags and skills)
    const skillScores = CORE_SKILLS.map(skillName => {
        // Check if skill is in course skills
        const hasSkill = course.courseSkills.some(
            cs => cs.skill.name.toLowerCase().includes(skillName.toLowerCase())
        );
        // Also check tags
        const inTags = course.tags.some(
            tag => tag.toLowerCase().includes(skillName.toLowerCase())
        );
        return hasSkill || inTags ? 1 : 0;
    });

    // Has project (0 or 1)
    const projectScore = course.hasProject ? 1 : 0;

    // Domain (normalized)
    const domainScore = course.domain
        ? DOMAIN_ENCODING[course.domain] / 4
        : 0.25;

    // Difficulty is already encoded
    const difficultyScore = DIFFICULTY_ENCODING[course.difficulty] / 3;

    return [educationScore, ...skillScores, projectScore, domainScore];
}

/**
 * Get personalized course recommendations for a student
 * STRICT: Only recommends courses matching user's exact education level
 */
export async function getRecommendations(
    userId: string,
    limit: number = 10
): Promise<{
    courseId: string;
    title: string;
    similarity: number;
    reason: string;
    thumbnail?: string | null;
}[]> {
    // Get student info including education level
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { educationLevel: true, careerFocusId: true, interestedCareerPath: { select: { domain: true } } },
    });

    // Get student vector for similarity scoring
    const studentVector = await getStudentVector(userId);

    // Build strict filter
    const courseFilter: any = { isPublished: true };

    // STRICT EDUCATION LEVEL FILTER
    // Only show courses where targetEducationLevel === user.educationLevel
    if (user?.educationLevel) {
        courseFilter.targetEducationLevel = user.educationLevel;
    }

    // Get courses matching the strict education level filter
    const courses = await prisma.course.findMany({
        where: courseFilter,
        include: {
            courseSkills: { include: { skill: true } },
            instructor: { select: { name: true } },
        },
    });

    // Get user's enrolled courses to exclude
    const enrolledCourses = await prisma.enrollment.findMany({
        where: { userId },
        select: { courseId: true },
    });
    const enrolledIds = new Set(enrolledCourses.map(e => e.courseId));

    // Calculate similarity for each course (already filtered by education level)
    const recommendations = await Promise.all(
        courses
            .filter(course => !enrolledIds.has(course.id))
            .map(async (course) => {
                const courseVector = await getCourseVector(course.id);
                const similarity = cosineSimilarity(studentVector, courseVector);

                // Generate reason
                let reason = '';
                if (user?.interestedCareerPath?.domain && course.domain && course.domain === user.interestedCareerPath.domain) {
                    reason = `Perfect match for your ${course.domain.toLowerCase()} path`;
                } else if (course.domain) {
                    reason = `Explore the ${course.domain.toLowerCase()} domain`;
                } else if (course.tags.length > 0) {
                    reason = `Focuses on ${course.tags.slice(0, 2).join(', ')}`;
                } else {
                    reason = 'Based on your learning profile';
                }

                return {
                    courseId: course.id,
                    title: course.title,
                    similarity: Math.round(similarity * 100) / 100,
                    reason,
                    instructor: course.instructor.name,
                    domain: course.domain,
                    difficulty: course.difficulty,
                    thumbnail: course.thumbnail,
                };
            })
    );

    // Sort by similarity and return top N
    return recommendations
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
}

/**
 * Get next focus skill suggestion based on career path
 */
export async function getNextFocusSkill(userId: string): Promise<{
    skill: string;
    reason: string;
} | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            interestedCareerPath: {
                include: {
                    skills: { include: { skill: true } }
                }
            },
            userSkills: { include: { skill: true } },
        },
    });

    if (!user?.interestedCareerPath) {
        return null;
    }

    // Find skills in career path that user doesn't have
    const userSkillNames = new Set(
        user.userSkills.map((us: UserSkill & { skill: Skill }) => us.skill.name.toLowerCase())
    );

    const missingSkills = user.interestedCareerPath.skills
        .map((cs: CareerSkill & { skill: Skill }) => cs.skill)
        .filter((skill: Skill) => !userSkillNames.has(skill.name.toLowerCase()));

    if (missingSkills.length === 0) {
        return {
            skill: 'Advanced Practice',
            reason: 'You have all core skills! Focus on deepening expertise.',
        };
    }

    const nextSkill = missingSkills[0];
    return {
        skill: nextSkill.name,
        reason: `Required for ${user.interestedCareerPath.title} career path`,
    };
}

/**
 * Infer skills from course completion
 */
export async function inferSkillsFromCourseCompletion(
    userId: string,
    courseId: string
): Promise<void> {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { courseSkills: { include: { skill: true } } },
    });

    if (!course) return;

    // Get skills from course tags if courseSkills is empty
    const skillsToAdd = course.courseSkills.length > 0
        ? course.courseSkills.map(cs => cs.skill)
        : [];

    // Add or update user skills
    for (const skill of skillsToAdd) {
        await prisma.userSkill.upsert({
            where: {
                userId_skillId: { userId, skillId: skill.id }
            },
            update: {
                level: { increment: 20 }, // Increase by 20 on course completion
            },
            create: {
                userId,
                skillId: skill.id,
                level: 30, // Starting level
                source: 'COURSE_COMPLETION',
            },
        });
    }
}
