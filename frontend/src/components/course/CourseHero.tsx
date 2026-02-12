
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Star, Clock, BarChart, Globe } from "lucide-react";

interface CourseHeroProps {
    course: {
        title: string;
        description: string;
        thumbnail?: string | null;
        rating: number; // Average rating
        reviewsCount: number;
        difficulty: string;
        duration?: string | null;
        category: string;
        tags: string[];
        updatedAt: string;
        language?: string;
    };
}

const CourseHero: React.FC<CourseHeroProps> = ({ course }) => {
    // Fallback image if thumbnail is missing
    const bgImage = course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80";

    return (
        <div className="relative w-full bg-slate-900 text-white overflow-hidden">
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={bgImage}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/50" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 lg:py-24 max-w-7xl">
                <div className="max-w-3xl space-y-6">
                    {/* Breadcrumb / Category */}
                    <div className="flex items-center space-x-2 text-blue-400 font-medium text-sm tracking-wide uppercase">
                        <span>{course.category}</span>
                        <span>&bull;</span>
                        <span className="text-blue-300">{course.tags[0]}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                        {course.title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-slate-300 line-clamp-2 md:line-clamp-3 leading-relaxed">
                        {course.description}
                    </p>

                    {/* Meta Info: Rating, Duration, Level */}
                    <div className="flex flex-wrap gap-4 md:gap-8 text-sm md:text-base pt-4">
                        {/* Rating */}
                        <div className="flex items-center space-x-1 text-yellow-400">
                            <span className="font-bold text-lg">{course.rating.toFixed(1)}</span>
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.round(course.rating) ? "fill-current" : "text-slate-600"}`}
                                    />
                                ))}
                            </div>
                            <span className="text-slate-400 ml-1">({course.reviewsCount} reviews)</span>
                        </div>

                        {/* Duration */}
                        {course.duration && (
                            <div className="flex items-center space-x-2 text-slate-300">
                                <Clock className="w-5 h-5 text-slate-400" />
                                <span>{course.duration}</span>
                            </div>
                        )}

                        {/* Difficulty */}
                        <div className="flex items-center space-x-2 text-slate-300">
                            <BarChart className="w-5 h-5 text-slate-400" />
                            <span className="capitalize">{course.difficulty.toLowerCase()}</span>
                        </div>

                        {/* Language - Hardcoded to English for now if not in DB */}
                        <div className="flex items-center space-x-2 text-slate-300">
                            <Globe className="w-5 h-5 text-slate-400" />
                            <span>{course.language || "English"}</span>
                        </div>
                    </div>

                    {/* Last Updated */}
                    <div className="text-xs text-slate-500 pt-2">
                        Last updated {new Date(course.updatedAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseHero;
