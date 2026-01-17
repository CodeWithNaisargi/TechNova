import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Briefcase, Heart, Stethoscope, Building } from 'lucide-react';

interface Skill {
    id: string;
    name: string;
    description?: string;
}

interface CareerPath {
    id: string;
    title: string;
    description: string;
    domain: string;
    skills: Skill[];
}

const domainColors: Record<string, string> = {
    TECH: 'bg-blue-500',
    HEALTHCARE: 'bg-green-500',
    URBAN: 'bg-purple-500',
    AGRICULTURE: 'bg-amber-500',
};

const domainIcons: Record<string, React.ReactNode> = {
    TECH: <Briefcase className="h-6 w-6" />,
    HEALTHCARE: <Stethoscope className="h-6 w-6" />,
    URBAN: <Building className="h-6 w-6" />,
    AGRICULTURE: <Heart className="h-6 w-6" />,
};

const StudentInterestSelection: React.FC = () => {
    const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        fetchCareerPaths();
    }, []);

    const fetchCareerPaths = async () => {
        try {
            const response = await api.get('/career-paths');
            if (response.data.success) {
                setCareerPaths(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching career paths:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load career paths',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCareer = async () => {
        if (!selectedCareer) {
            toast({
                variant: 'destructive',
                title: 'Please select a career',
                description: 'Choose a career path to continue',
            });
            return;
        }

        setSaving(true);
        try {
            const response = await api.put('/career-paths/student/interest', {
                careerPathId: selectedCareer,
            });

            if (response.data.success) {
                toast({
                    title: 'Career Selected!',
                    description: 'Your career interest has been saved.',
                });
                // Invalidate auth cache to ensure fresh user data
                await queryClient.invalidateQueries({ queryKey: ['auth-user'] });
                // Navigate to dashboard after successful save
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('Error saving career interest:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save career interest',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading career paths...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Welcome, {user?.name}! 👋
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Choose your career path to personalize your learning journey.
                        This will help us recommend the right courses for you.
                    </p>
                </div>

                {/* Career Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {careerPaths.map((career) => (
                        <Card
                            key={career.id}
                            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedCareer === career.id
                                ? 'ring-2 ring-primary ring-offset-2 shadow-lg scale-[1.02]'
                                : 'hover:scale-[1.01]'
                                }`}
                            onClick={() => setSelectedCareer(career.id)}
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`p-3 rounded-full text-white ${domainColors[career.domain] || 'bg-slate-500'
                                            }`}
                                    >
                                        {domainIcons[career.domain] || <Briefcase className="h-6 w-6" />}
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {career.domain}
                                    </Badge>
                                </div>
                                <CardTitle className="mt-4 text-xl">{career.title}</CardTitle>
                                <CardDescription className="line-clamp-3">
                                    {career.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-slate-700">Key Skills:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {career.skills.slice(0, 4).map((skill) => (
                                            <Badge key={skill.id} variant="secondary" className="text-xs">
                                                {skill.name}
                                            </Badge>
                                        ))}
                                        {career.skills.length > 4 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{career.skills.length - 4} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant={selectedCareer === career.id ? 'default' : 'outline'}
                                    className="w-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCareer(career.id);
                                    }}
                                >
                                    {selectedCareer === career.id ? '✓ Selected' : 'Select'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                    <Button
                        size="lg"
                        disabled={!selectedCareer || saving}
                        onClick={handleSelectCareer}
                        className="min-w-[200px] text-lg py-6"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Continue to Dashboard →'
                        )}
                    </Button>
                </div>

                {/* Help Text */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    You can change your career interest later from your profile settings.
                </p>
            </div>
        </div>
    );
};

export default StudentInterestSelection;
