import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, Target, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Recommendation {
    courseId: string;
    title: string;
    similarity: number;
    reason: string;
    instructor?: string;
    domain?: string;
    difficulty?: string;
}

interface NextSkill {
    skill: string;
    reason: string;
}

const RecommendationsSection: React.FC = () => {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [nextSkill, setNextSkill] = useState<NextSkill | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const [recsResponse, skillResponse] = await Promise.all([
                api.get('/recommendations?limit=6'),
                api.get('/recommendations/next-skill'),
            ]);

            if (recsResponse.data.success) {
                setRecommendations(recsResponse.data.data);
            }
            if (skillResponse.data.success) {
                setNextSkill(skillResponse.data.data);
            }
        } catch (err: any) {
            console.error('Error fetching recommendations:', err);
            setError('Unable to load recommendations');
        } finally {
            setLoading(false);
        }
    };

    const getDomainColor = (domain?: string) => {
        switch (domain) {
            case 'AGRICULTURE': return 'bg-green-500';
            case 'HEALTHCARE': return 'bg-red-500';
            case 'URBAN': return 'bg-blue-500';
            case 'TECH': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty) {
            case 'BEGINNER': return 'bg-emerald-100 text-emerald-800';
            case 'INTERMEDIATE': return 'bg-amber-100 text-amber-800';
            case 'ADVANCED': return 'bg-rose-100 text-rose-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI Recommendations
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI Recommendations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-4">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="mt-6 space-y-6">
            {/* Next Focus Skill */}
            {nextSkill && (
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/20 rounded-full">
                                    <Target className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Next Focus: {nextSkill.skill}</h3>
                                    <p className="text-sm text-muted-foreground">{nextSkill.reason}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/courses')}
                            >
                                Find Courses <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recommended Courses */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Recommended for You
                    </CardTitle>
                    <CardDescription>
                        Personalized course recommendations based on your education, skills, and career goals
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {recommendations.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                            Complete your profile to get personalized recommendations
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendations.map((rec) => (
                                <Card
                                    key={rec.courseId}
                                    className="hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/courses/${rec.courseId}`)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div
                                                className={`w-2 h-2 rounded-full ${getDomainColor(rec.domain)}`}
                                            />
                                            <Badge variant="secondary" className="text-xs">
                                                {Math.round(rec.similarity * 100)}% match
                                            </Badge>
                                        </div>
                                        <h4 className="font-medium text-sm line-clamp-2 mb-2">
                                            {rec.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mb-3">
                                            {rec.reason}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            {rec.difficulty && (
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${getDifficultyColor(rec.difficulty)}`}
                                                >
                                                    {rec.difficulty}
                                                </Badge>
                                            )}
                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default RecommendationsSection;
