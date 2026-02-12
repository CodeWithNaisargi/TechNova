
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Trophy, FileText, Smartphone } from "lucide-react";

interface CourseSidebarProps {
    course: {
        price: number;
        durationHours?: number | null;
        totalLessons?: number | null;
        level?: string;
        requirements?: string[];
        thumbnail?: string | null;
    };
    onEnroll: () => void;
    isEnrolled?: boolean;
    isLoading?: boolean;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course, onEnroll, isEnrolled = false, isLoading = false }) => {
    return (
        <div className="sticky top-24 w-full">
            <Card className="border-slate-200 shadow-xl overflow-hidden">
                {/* Course Preview Image (Sidebar Top) */}
                <div className="relative h-48 w-full bg-slate-100">
                    <img
                        src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
                        alt="Course Preview"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors cursor-pointer group">
                        <PlayCircle className="w-16 h-16 text-white opacity-90 group-hover:scale-110 transition-transform drop-shadow-lg" />
                    </div>
                </div>

                <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-baseline justify-between">
                        <div className="space-y-1">
                            <div className="text-3xl font-bold text-slate-900">
                                {course.price === 0 ? "Free" : `₹${course.price.toLocaleString()}`}
                            </div>
                            {course.price > 0 && <div className="text-sm text-slate-500 line-through">₹{(course.price * 1.5).toLocaleString()}</div>}
                        </div>
                        {course.price > 0 && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 font-bold px-3 py-1">
                                33% OFF
                            </Badge>
                        )}
                    </div>

                    <Button
                        size="lg"
                        className={`w-full text-lg font-semibold h-12 ${isEnrolled ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"}`}
                        onClick={onEnroll}
                        disabled={isLoading}
                    >
                        {isLoading ? "Enrolling..." : (isEnrolled ? "Go to Course" : "Enroll Now")}
                    </Button>
                    {!isEnrolled && <p className="text-xs text-center text-slate-500">30-Day Money-Back Guarantee</p>}
                </CardHeader>

                <CardContent className="space-y-6 pt-0">
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">This Course Includes:</h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            {course.durationHours && (
                                <li className="flex items-center gap-3">
                                    <PlayCircle className="w-5 h-5 text-slate-400" />
                                    <span>{course.durationHours} hours on-demand video</span>
                                </li>
                            )}
                            {course.totalLessons && (
                                <li className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-slate-400" />
                                    <span>{course.totalLessons} lessons</span>
                                </li>
                            )}
                            <li className="flex items-center gap-3">
                                <Smartphone className="w-5 h-5 text-slate-400" />
                                <span>Access on mobile and TV</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Trophy className="w-5 h-5 text-slate-400" />
                                <span>Certificate of completion</span>
                            </li>
                        </ul>
                    </div>
                </CardContent>

                <CardFooter className="bg-slate-50 p-4 border-t border-slate-100">
                    <div className="w-full">
                        <h4 className="font-bold text-slate-900 text-sm mb-3">Training 5 or more people?</h4>
                        <p className="text-xs text-slate-500 mb-3">Get your team access to SkillOrbit's top 25,000+ courses.</p>
                        <Button variant="outline" className="w-full text-slate-700 border-slate-300 hover:bg-white">
                            Get Team Access
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CourseSidebar;
