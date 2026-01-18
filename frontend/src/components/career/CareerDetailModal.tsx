import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    BookOpen,
    Briefcase,
    GraduationCap,
    TrendingUp,
    IndianRupee,
    Building2,
    Target,
    Rocket,
    X,
} from 'lucide-react';
import type { CareerFocus } from '@/config/careerFocusConfig';

interface CareerDetailModalProps {
    careerFocus: CareerFocus | null;
    isOpen: boolean;
    onClose: () => void;
    onSelectCareer: (careerFocus: CareerFocus) => void;
    onViewCourses: (careerFocus: CareerFocus) => void;
}

const formatSalary = (amount: number): string => {
    if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(1)} LPA`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * CareerDetailModal Component
 * Shows comprehensive career information when a student clicks "Learn More"
 * 
 * Sections:
 * - Career Overview
 * - Why It Matters
 * - Key Responsibilities
 * - Required Skills
 * - Education Path
 * - Industry Sectors
 * - Salary Range
 * - Future Scope
 * - Actions: Select This Path, View Courses
 */
export const CareerDetailModal: React.FC<CareerDetailModalProps> = ({
    careerFocus,
    isOpen,
    onClose,
    onSelectCareer,
    onViewCourses,
}) => {
    if (!careerFocus) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <DialogHeader className="pb-4">
                    <div className="flex items-start gap-4">
                        <div className="text-5xl">{careerFocus.icon}</div>
                        <div className="flex-1">
                            <DialogTitle className="text-2xl font-bold text-foreground">
                                {careerFocus.title}
                            </DialogTitle>
                            <DialogDescription className="text-base text-muted-foreground mt-1">
                                "{careerFocus.tagline}"
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator />

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

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
                    {/* Salary */}
                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 text-center">
                        <IndianRupee className="h-6 w-6 mx-auto text-green-600 mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Salary Range</p>
                        <p className="font-semibold text-green-700 dark:text-green-400 text-sm">
                            {careerFocus.salaryRange.min > 0
                                ? `${formatSalary(careerFocus.salaryRange.min)} - ${formatSalary(careerFocus.salaryRange.max)}`
                                : 'Varies by path'}
                        </p>
                    </div>

                    {/* Industry Count */}
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-center">
                        <Building2 className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Industries</p>
                        <p className="font-semibold text-blue-700 dark:text-blue-400 text-sm">
                            {careerFocus.industrySectors.length}+ Sectors
                        </p>
                    </div>

                    {/* Growth */}
                    <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 text-center col-span-2 md:col-span-1">
                        <TrendingUp className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Growth</p>
                        <p className="font-semibold text-purple-700 dark:text-purple-400 text-sm">
                            High Demand
                        </p>
                    </div>
                </div>

                <Separator />

                {/* Key Responsibilities */}
                <section className="space-y-2 py-4">
                    <h3 className="flex items-center gap-2 font-semibold text-foreground">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Key Responsibilities
                    </h3>
                    <ul className="space-y-2">
                        {careerFocus.responsibilities.map((resp, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="text-primary mt-1">•</span>
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
                            <Badge key={idx} variant="secondary" className="text-sm">
                                {skill}
                            </Badge>
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
                            <Badge key={idx} variant="outline" className="text-sm">
                                {sector}
                            </Badge>
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

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button
                        variant="default"
                        className="flex-1"
                        onClick={() => onSelectCareer(careerFocus)}
                    >
                        Select This Path
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onViewCourses(careerFocus)}
                    >
                        View Courses
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CareerDetailModal;
