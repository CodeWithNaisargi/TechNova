import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import type { CareerFocus } from '@/config/careerFocusConfig';

interface CareerCardProps {
    careerFocus: CareerFocus;
    onLearnMore: (careerFocus: CareerFocus) => void;
    isSelected?: boolean;
}

const domainColors: Record<string, string> = {
    AGRICULTURE: 'bg-amber-500/20 text-amber-700 border-amber-300',
    HEALTHCARE: 'bg-green-500/20 text-green-700 border-green-300',
    URBAN: 'bg-purple-500/20 text-purple-700 border-purple-300',
    TECH: 'bg-blue-500/20 text-blue-700 border-blue-300',
};

const domainLabels: Record<string, string> = {
    AGRICULTURE: 'Agriculture',
    HEALTHCARE: 'Healthcare',
    URBAN: 'Urban Tech',
    TECH: 'Technology',
};

/**
 * CareerCard Component
 * Displays a career focus option for the student to explore.
 * Clicking "Learn More" opens the CareerDetailModal.
 */
export const CareerCard: React.FC<CareerCardProps> = ({
    careerFocus,
    onLearnMore,
    isSelected = false,
}) => {
    return (
        <Card
            className={`
                relative overflow-hidden transition-all duration-300 cursor-pointer
                hover:shadow-lg hover:scale-[1.02] hover:border-primary/50
                ${isSelected ? 'ring-2 ring-primary border-primary' : 'border-border'}
            `}
            onClick={() => onLearnMore(careerFocus)}
        >
            {/* Icon Header */}
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="text-4xl mb-2">{careerFocus.icon}</div>
                    <Badge
                        variant="outline"
                        className={`text-xs ${domainColors[careerFocus.domain] || 'bg-gray-100'}`}
                    >
                        {domainLabels[careerFocus.domain] || careerFocus.domain}
                    </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-foreground leading-tight">
                    {careerFocus.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    {careerFocus.tagline}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
                {/* Brief overview */}
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
                        <Badge variant="secondary" className="text-xs">
                            +{careerFocus.requiredSkills.length - 3} more
                        </Badge>
                    )}
                </div>

                {/* Learn More Button */}
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full group"
                    onClick={(e) => {
                        e.stopPropagation();
                        onLearnMore(careerFocus);
                    }}
                >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </CardContent>

            {/* Selected Indicator */}
            {isSelected && (
                <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default CareerCard;
