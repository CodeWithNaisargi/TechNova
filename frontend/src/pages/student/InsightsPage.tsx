import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    Lock, Unlock, TrendingUp, Target, Brain, Award,
    BookOpen, ChevronRight, Sparkles, AlertCircle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import api from '@/services/api';

interface InsightsData {
    unlockStatus: {
        isUnlocked: boolean;
        enrolledCount: number;
        completedCount: number;
        requiredEnrolled: number;
        requiredCompleted: number;
        enrolledProgress: number;
        completedProgress: number;
    };
    engagement: { score: number; level: string; description: string };
    skillGrowth: { score: number; level: string; skillsAcquired: string[]; totalSkills: number };
    careerAlignment: { score: number; matchedSkills: string[]; missingSkills: string[]; alignmentPercentage: number };
    consistency: { score: number; level: string; description: string };
    careerReadiness: { percentage: number; status: string; breakdown: Record<string, number> };
    feedback: { strengths: string[]; improvements: string[]; whyItMatters: string };
    recommendations: { courses: Array<{ id: string; title: string; reason: string }>; skillsToFocus: string[]; actions: string[] };
    studentProfile: { name: string; educationLevel: string | null; careerFocus: string | null };
}

const InsightsPage = () => {
    const { data: insights, isLoading, error } = useQuery({
        queryKey: ['insights'],
        queryFn: async () => {
            const res = await api.get('/insights');
            return res.data.data as InsightsData;
        }
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (error || !insights) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-slate-600">Failed to load insights</p>
            </div>
        );
    }

    const { unlockStatus } = insights;

    // LOCKED STATE
    if (!unlockStatus.isUnlocked) {
        return (
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Locked Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center mx-auto mb-4">
                            <Lock className="h-10 w-10 text-slate-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Career Insights Locked
                        </h1>
                        <p className="text-slate-600 max-w-md mx-auto">
                            Complete more learning activities to unlock personalized career insights and recommendations.
                        </p>
                    </div>

                    {/* Progress Cards */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <Card className="border-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-blue-500" />
                                    Courses Enrolled
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end gap-2 mb-3">
                                    <span className="text-4xl font-bold text-slate-900">
                                        {unlockStatus.enrolledCount}
                                    </span>
                                    <span className="text-slate-500 pb-1">
                                        / {unlockStatus.requiredEnrolled} required
                                    </span>
                                </div>
                                <Progress value={unlockStatus.enrolledProgress} className="h-3" />
                                {unlockStatus.enrolledCount >= unlockStatus.requiredEnrolled ? (
                                    <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                                        <Unlock className="h-4 w-4" /> Requirement met!
                                    </p>
                                ) : (
                                    <p className="text-slate-500 text-sm mt-2">
                                        Enroll in {unlockStatus.requiredEnrolled - unlockStatus.enrolledCount} more courses
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Award className="h-5 w-5 text-green-500" />
                                    Courses Completed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end gap-2 mb-3">
                                    <span className="text-4xl font-bold text-slate-900">
                                        {unlockStatus.completedCount}
                                    </span>
                                    <span className="text-slate-500 pb-1">
                                        / {unlockStatus.requiredCompleted} required
                                    </span>
                                </div>
                                <Progress value={unlockStatus.completedProgress} className="h-3" />
                                {unlockStatus.completedCount >= unlockStatus.requiredCompleted ? (
                                    <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                                        <Unlock className="h-4 w-4" /> Requirement met!
                                    </p>
                                ) : (
                                    <p className="text-slate-500 text-sm mt-2">
                                        Complete {unlockStatus.requiredCompleted - unlockStatus.completedCount} more courses with certificates
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Call to Action */}
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <CardContent className="py-6 text-center">
                            <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                            <h3 className="font-semibold text-slate-900 mb-2">
                                Unlock AI-Assisted Career Insights
                            </h3>
                            <p className="text-slate-600 text-sm mb-4 max-w-md mx-auto">
                                Once unlocked, you will receive personalized feedback on your learning progress,
                                career alignment analysis, and tailored course recommendations.
                            </p>
                            <Button asChild>
                                <Link to="/courses">
                                    Browse Courses <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    // UNLOCKED STATE
    return (
        <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                            <Brain className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Career Insights
                            </h1>
                            <p className="text-slate-600">
                                AI-assisted analysis for {insights.studentProfile.name}
                            </p>
                        </div>
                    </div>
                    {insights.studentProfile.careerFocus && (
                        <Badge variant="outline" className="mt-2">
                            Career Focus: {insights.studentProfile.careerFocus}
                        </Badge>
                    )}
                </div>

                {/* Career Readiness Score */}
                <Card className="mb-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                    <CardContent className="py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Overall Career Readiness</p>
                                <p className="text-5xl font-bold">{insights.careerReadiness.percentage}%</p>
                                <Badge className={`mt-2 ${insights.careerReadiness.status === 'CAREER_READY' ? 'bg-green-500' :
                                        insights.careerReadiness.status === 'ON_TRACK' ? 'bg-blue-500' :
                                            insights.careerReadiness.status === 'DEVELOPING' ? 'bg-yellow-500' : 'bg-slate-500'
                                    }`}>
                                    {insights.careerReadiness.status.replace('_', ' ')}
                                </Badge>
                            </div>
                            <div className="w-32 h-32 rounded-full border-8 border-white/20 flex items-center justify-center">
                                <Target className="h-12 w-12 text-white/80" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Analysis Dimensions Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-500">Engagement</span>
                                <Badge variant={insights.engagement.level === 'EXCELLENT' ? 'default' : 'secondary'}>
                                    {insights.engagement.level}
                                </Badge>
                            </div>
                            <p className="text-3xl font-bold text-slate-900">{insights.engagement.score}%</p>
                            <p className="text-xs text-slate-500 mt-1">{insights.engagement.description}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-500">Skill Growth</span>
                                <Badge variant={insights.skillGrowth.level === 'EXCELLENT' ? 'default' : 'secondary'}>
                                    {insights.skillGrowth.level}
                                </Badge>
                            </div>
                            <p className="text-3xl font-bold text-slate-900">{insights.skillGrowth.totalSkills} skills</p>
                            <p className="text-xs text-slate-500 mt-1">
                                {insights.skillGrowth.skillsAcquired.slice(0, 3).join(', ')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-500">Career Alignment</span>
                                <Badge variant={insights.careerAlignment.alignmentPercentage >= 60 ? 'default' : 'secondary'}>
                                    {insights.careerAlignment.alignmentPercentage}%
                                </Badge>
                            </div>
                            <p className="text-3xl font-bold text-slate-900">{insights.careerAlignment.matchedSkills.length} matched</p>
                            <p className="text-xs text-slate-500 mt-1">
                                {insights.careerAlignment.missingSkills.length} skills to develop
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-500">Consistency</span>
                                <Badge variant={insights.consistency.level === 'EXCELLENT' ? 'default' : 'secondary'}>
                                    {insights.consistency.level}
                                </Badge>
                            </div>
                            <p className="text-3xl font-bold text-slate-900">{insights.consistency.score}%</p>
                            <p className="text-xs text-slate-500 mt-1">{insights.consistency.description}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Feedback & Recommendations */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Feedback */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                Your Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {insights.feedback.strengths.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-green-600 mb-2">Strengths</p>
                                    <ul className="space-y-1">
                                        {insights.feedback.strengths.map((s, i) => (
                                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                <span className="text-green-500 mt-1">✓</span> {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {insights.feedback.improvements.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-amber-600 mb-2">Areas to Improve</p>
                                    <ul className="space-y-1">
                                        {insights.feedback.improvements.map((s, i) => (
                                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                <span className="text-amber-500 mt-1">→</span> {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {insights.feedback.whyItMatters && (
                                <p className="text-xs text-slate-500 mt-4 p-3 bg-slate-50 rounded">
                                    {insights.feedback.whyItMatters}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-purple-500" />
                                Recommended Next Steps
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {insights.recommendations.courses.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-slate-700 mb-2">
                                        Recommended Courses
                                    </p>
                                    <div className="space-y-2">
                                        {insights.recommendations.courses.map((course) => (
                                            <Link
                                                key={course.id}
                                                to={`/courses/${course.id}`}
                                                className="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <p className="font-medium text-slate-900 text-sm">{course.title}</p>
                                                <p className="text-xs text-slate-500">{course.reason}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {insights.recommendations.actions.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-slate-700 mb-2">Action Items</p>
                                    <ul className="space-y-1">
                                        {insights.recommendations.actions.map((action, i) => (
                                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                <span className="text-purple-500 mt-1">•</span> {action}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* AI Disclaimer */}
                <p className="text-xs text-slate-400 text-center mt-8">
                    These insights are generated using deterministic analysis of your learning behavior.
                    AI is used only to present information clearly, not to make decisions.
                </p>
            </motion.div>
        </div>
    );
};

export default InsightsPage;
