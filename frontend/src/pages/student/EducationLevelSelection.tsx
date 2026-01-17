import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, GraduationCap, BookOpen, Award, Briefcase, School } from 'lucide-react';

interface EducationLevel {
    value: string;
    label: string;
    description: string;
}

const educationIcons: Record<string, React.ReactNode> = {
    SECONDARY: <School className="h-6 w-6" />,
    HIGHER_SECONDARY: <BookOpen className="h-6 w-6" />,
    DIPLOMA: <Award className="h-6 w-6" />,
    UNDERGRADUATE: <GraduationCap className="h-6 w-6" />,
    POSTGRADUATE: <Briefcase className="h-6 w-6" />,
};

const educationColors: Record<string, string> = {
    SECONDARY: 'bg-blue-500',
    HIGHER_SECONDARY: 'bg-green-500',
    DIPLOMA: 'bg-amber-500',
    UNDERGRADUATE: 'bg-purple-500',
    POSTGRADUATE: 'bg-red-500',
};

const EducationLevelSelection: React.FC = () => {
    const [levels, setLevels] = useState<EducationLevel[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        fetchEducationLevels();
    }, []);

    const fetchEducationLevels = async () => {
        try {
            const response = await api.get('/education/levels');
            if (response.data.success) {
                setLevels(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching education levels:', error);
            // Fallback data if API fails
            setLevels([
                { value: 'SECONDARY', label: 'Secondary (10th)', description: 'Completed 10th grade / SSC' },
                { value: 'HIGHER_SECONDARY', label: 'Higher Secondary (12th)', description: 'Completed 12th grade / HSC' },
                { value: 'DIPLOMA', label: 'Diploma', description: 'Technical diploma / ITI' },
                { value: 'UNDERGRADUATE', label: 'Undergraduate', description: 'Pursuing or completed Bachelor\'s degree' },
                { value: 'POSTGRADUATE', label: 'Postgraduate', description: 'Pursuing or completed Master\'s degree or above' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEducation = async () => {
        if (!selectedLevel) {
            toast({
                variant: 'destructive',
                title: 'Please select your education level',
                description: 'You need to select an education level to continue',
            });
            return;
        }

        setSaving(true);
        try {
            const response = await api.put('/education/student/education-level', {
                educationLevel: selectedLevel,
            });

            if (response.data.success) {
                toast({
                    title: 'Education Level Saved!',
                    description: 'Your education level has been recorded.',
                });

                // Invalidate auth cache to ensure fresh user data
                await queryClient.invalidateQueries({ queryKey: ['auth-user'] });

                // Navigate to career selection if not already selected, else dashboard
                if (!user?.interestedCareerPath) {
                    navigate('/onboarding/career');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error: any) {
            console.error('Error saving education level:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save education level',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Welcome, {user?.name}! 🎓
                    </h1>
                    <p className="text-lg text-slate-600 max-w-xl mx-auto">
                        Tell us about your education level so we can personalize your learning journey
                        and recommend the right courses for you.
                    </p>
                </div>

                {/* Education Level Selection */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Select Your Education Level</CardTitle>
                        <CardDescription>
                            Choose the highest education level you have completed or are currently pursuing.
                            This helps us recommend courses that match your background.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={selectedLevel}
                            onValueChange={setSelectedLevel}
                            className="space-y-3"
                        >
                            {levels.map((level) => (
                                <div
                                    key={level.value}
                                    className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedLevel === level.value
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setSelectedLevel(level.value)}
                                >
                                    <RadioGroupItem value={level.value} id={level.value} />
                                    <div
                                        className={`p-2 rounded-full text-white ${educationColors[level.value] || 'bg-gray-500'
                                            }`}
                                    >
                                        {educationIcons[level.value] || <GraduationCap className="h-6 w-6" />}
                                    </div>
                                    <div className="flex-1">
                                        <Label
                                            htmlFor={level.value}
                                            className="text-base font-medium cursor-pointer"
                                        >
                                            {level.label}
                                        </Label>
                                        <p className="text-sm text-gray-500">{level.description}</p>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            size="lg"
                            disabled={!selectedLevel || saving}
                            onClick={handleSaveEducation}
                            className="w-full text-lg py-6"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Continue →'
                            )}
                        </Button>
                        <p className="text-center text-sm text-slate-500">
                            You can update your education level later from your profile settings.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default EducationLevelSelection;
