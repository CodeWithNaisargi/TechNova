import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, ArrowLeft, ArrowRight, CheckCircle, Briefcase, GraduationCap, TrendingUp, IndianRupee, Building2, Target, Rocket, BookOpen } from 'lucide-react';
import {
    getCareerFocusesForEducation,
    type CareerFocus,
    type EducationLevel,
} from '@/config/careerFocusConfig';

// ============================================================================
// DOMAIN STYLING
// ============================================================================
const domainColors: Record<string, string> = {
    AGRICULTURE: 'bg-amber-500/20 text-amber-700 border-amber-300 dark:text-amber-400',
    HEALTHCARE: 'bg-green-500/20 text-green-700 border-green-300 dark:text-green-400',
    URBAN: 'bg-purple-500/20 text-purple-700 border-purple-300 dark:text-purple-400',
    TECH: 'bg-blue-500/20 text-blue-700 border-blue-300 dark:text-blue-400',
};

const domainLabels: Record<string, string> = {
    AGRICULTURE: 'Agriculture',
    HEALTHCARE: 'Healthcare',
    URBAN: 'Urban Tech',
    TECH: 'Technology',
};

// ============================================================================
// FORMAT HELPERS
// ============================================================================
const formatSalary = (amount: number): string => {
    if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(1)} LPA`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
};

// ============================================================================
// CAREER CARD COMPONENT
// ============================================================================
interface CareerCardProps {
    careerFocus: CareerFocus;
    onLearnMore: (careerFocus: CareerFocus) => void;
}

const CareerCard: React.FC<CareerCardProps> = ({ careerFocus, onLearnMore }) => {
    return (
        <Card
            className="relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:border-primary/50 border-2 bg-card"
            onClick={() => onLearnMore(careerFocus)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="text-4xl mb-2">{careerFocus.icon}</div>
                    <Badge variant="outline" className={`text-xs ${domainColors[careerFocus.domain] || ''}`}>
                        {domainLabels[careerFocus.domain] || careerFocus.domain}
                    </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-foreground leading-tight">
                    {careerFocus.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    {careerFocus.tagline}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {careerFocus.overview}
                </p>

                {/* Skills Preview */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {careerFocus.requiredSkills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                        </Badge>
                    ))}
                    {careerFocus.requiredSkills.length > 3 && (
                        <Badge variant="secondary" className="text-xs opacity-70">
                            +{careerFocus.requiredSkills.length - 3}
                        </Badge>
                    )}
                </div>

                <Button variant="outline" size="sm" className="w-full group">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </CardContent>
        </Card>
    );
};

// ============================================================================
// CAREER DETAIL MODAL COMPONENT
// ============================================================================
interface CareerDetailModalProps {
    careerFocus: CareerFocus | null;
    isOpen: boolean;
    onClose: () => void;
    onSelectPlan: (careerFocus: CareerFocus) => void;
    isLoading: boolean;
}

const CareerDetailModal: React.FC<CareerDetailModalProps> = ({
    careerFocus,
    isOpen,
    onClose,
    onSelectPlan,
    isLoading,
}) => {
    if (!careerFocus) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <DialogHeader className="pb-4 border-b">
                    <div className="flex items-start gap-4">
                        <div className="text-5xl">{careerFocus.icon}</div>
                        <div className="flex-1">
                            <DialogTitle className="text-2xl font-bold text-foreground">
                                {careerFocus.title}
                            </DialogTitle>
                            <DialogDescription className="text-base text-muted-foreground mt-1 italic">
                                "{careerFocus.tagline}"
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Career Overview */}
                <section className="space-y-2 py-4">
                    <h3 className="flex items-center gap-2 font-semibold text-foreground">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Career Overview
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {careerFocus.overview}
                    </p>
                </section>

                {/* Why It Matters */}
                <section className="space-y-2 py-4 bg-primary/5 -mx-6 px-6 rounded-lg">
                    <h3 className="flex items-center gap-2 font-semibold text-foreground">
                        <Target className="h-5 w-5 text-primary" />
                        Why This Career Matters
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {careerFocus.whyItMatters}
                    </p>
                </section>

                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-4 py-4">
                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 text-center">
                        <IndianRupee className="h-5 w-5 mx-auto text-green-600 mb-1" />
                        <p className="text-xs text-muted-foreground">Salary</p>
                        <p className="font-semibold text-green-700 dark:text-green-400 text-sm">
                            {careerFocus.salaryRange.min > 0
                                ? `${formatSalary(careerFocus.salaryRange.min)} - ${formatSalary(careerFocus.salaryRange.max)}`
                                : 'Varies'}
                        </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-center">
                        <Building2 className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                        <p className="text-xs text-muted-foreground">Industries</p>
                        <p className="font-semibold text-blue-700 dark:text-blue-400 text-sm">
                            {careerFocus.industrySectors.length}+ Sectors
                        </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 text-center">
                        <TrendingUp className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                        <p className="text-xs text-muted-foreground">Growth</p>
                        <p className="font-semibold text-purple-700 dark:text-purple-400 text-sm">
                            High Demand
                        </p>
                    </div>
                </div>

                {/* Key Responsibilities */}
                <section className="space-y-2 py-4 border-t">
                    <h3 className="flex items-center gap-2 font-semibold text-foreground">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Key Responsibilities
                    </h3>
                    <ul className="space-y-1">
                        {careerFocus.responsibilities.map((resp, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="text-primary mt-0.5">•</span>
                                {resp}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Required Skills */}
                <section className="space-y-2 py-4">
                    <h3 className="flex items-center gap-2 font-semibold text-foreground">
                        <Target className="h-5 w-5 text-primary" />
                        Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {careerFocus.requiredSkills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                </section>

                {/* Education Path */}
                <section className="space-y-2 py-4 bg-amber-50 dark:bg-amber-950/30 -mx-6 px-6 rounded-lg">
                    <h3 className="flex items-center gap-2 font-semibold text-foreground">
                        <GraduationCap className="h-5 w-5 text-amber-600" />
                        Education Path
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono bg-white/50 dark:bg-black/20 p-3 rounded">
                        {careerFocus.educationPath}
                    </p>
                </section>

                {/* Industry Sectors */}
                <section className="space-y-2 py-4">
                    <h3 className="flex items-center gap-2 font-semibold text-foreground">
                        <Building2 className="h-5 w-5 text-primary" />
                        Industry Sectors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {careerFocus.industrySectors.map((sector, idx) => (
                            <Badge key={idx} variant="outline">{sector}</Badge>
                        ))}
                    </div>
                </section>

                {/* Future Scope */}
                <section className="space-y-2 py-4">
                    <h3 className="flex items-center gap-2 font-semibold text-foreground">
                        <Rocket className="h-5 w-5 text-primary" />
                        Future Scope
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {careerFocus.futureScope}
                    </p>
                </section>

                {/* CTA Buttons */}
                <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-background pb-2">
                    <Button
                        size="lg"
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                        onClick={() => onSelectPlan(careerFocus)}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-5 w-5" />
                                Select This Career Path
                            </>
                        )}
                    </Button>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
const StudentInterestSelection: React.FC = () => {
    const [modalCareer, setModalCareer] = useState<CareerFocus | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Get career focuses based on user's education level
    const educationCareerMap = useMemo(() => {
        const level = (user?.educationLevel as EducationLevel) || 'UNDERGRADUATE';
        return getCareerFocusesForEducation(level);
    }, [user?.educationLevel]);

    const careerFocuses = educationCareerMap?.careerFocuses || [];
    const pageTitle = educationCareerMap?.pageTitle || 'Choose Your Career';
    const pageDescription = educationCareerMap?.pageDescription || 'Select a career path that interests you.';

    // Handle opening the detail modal
    const handleLearnMore = (careerFocus: CareerFocus) => {
        setModalCareer(careerFocus);
        setIsModalOpen(true);
    };

    // Handle selecting a career - the main CTA action
    const handleSelectPlan = async (careerFocus: CareerFocus) => {
        setSaving(true);
        try {
            const response = await api.put('/career-paths/student/interest', {
                careerFocusId: careerFocus.id,
            });

            if (response.data.success) {
                // Show success toast
                toast({
                    title: '✅ Career path selected successfully!',
                    description: `Your learning path: ${careerFocus.title}`,
                });

                // Invalidate auth cache to ensure fresh user data
                await queryClient.invalidateQueries({ queryKey: ['auth-user'] });

                // Close modal
                setIsModalOpen(false);

                // Redirect to dashboard immediately
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('Error saving career interest:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save your selection. Please try again.',
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <Button
                        variant="ghost"
                        className="mb-4"
                        onClick={() => navigate('/onboarding/education')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Change Education Level
                    </Button>

                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                        {pageTitle}
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {pageDescription}
                    </p>

                    {user?.educationLevel && (
                        <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                            <GraduationCap className="h-4 w-4" />
                            <span>
                                Your Level: {user.educationLevel.replace('_', ' ')}
                            </span>
                        </div>
                    )}
                </div>

                {/* Career Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {careerFocuses.map((career) => (
                        <CareerCard
                            key={career.id}
                            careerFocus={career}
                            onLearnMore={handleLearnMore}
                        />
                    ))}
                </div>

                {/* Help Text */}
                <p className="text-center text-muted-foreground text-sm">
                    Click on any card above to learn more and select your path
                </p>

                {/* No careers fallback */}
                {careerFocuses.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg mb-4">
                            No career paths available for your education level.
                        </p>
                        <Button variant="outline" onClick={() => navigate('/onboarding/education')}>
                            Update Education Level
                        </Button>
                    </div>
                )}
            </div>

            {/* Career Detail Modal */}
            <CareerDetailModal
                careerFocus={modalCareer}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectPlan={handleSelectPlan}
                isLoading={saving}
            />
        </div>
    );
};

export default StudentInterestSelection;
