
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ThumbsUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Review {
    id: string;
    reviewerName?: string | null;
    reviewerRole?: string | null;
    reviewerAvatar?: string | null;
    rating: number;
    comment: string;
    createdAt: string;
}

interface CourseReviewsProps {
    reviews: Review[];
    rating: number;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ reviews, rating }) => {
    // Determine rating distribution (mock logic if not provided by backend)
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
        if (r.rating >= 1 && r.rating <= 5) distribution[5 - r.rating]++;
    });
    const total = reviews.length || 1;

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-bold text-slate-900">Student Feedback</h3>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Rating Summary */}
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border shadow-sm w-full md:w-1/3">
                    <div className="text-5xl font-bold text-slate-900">{rating.toFixed(1)}</div>
                    <div className="flex my-2 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-5 h-5 ${i < Math.round(rating) ? "fill-current" : "text-slate-200"}`}
                            />
                        ))}
                    </div>
                    <div className="text-slate-500 font-medium">Course Rating</div>
                </div>

                {/* Rating Bars */}
                <div className="flex-1 w-full space-y-3">
                    {[5, 4, 3, 2, 1].map((stars, i) => (
                        <div key={stars} className="flex items-center gap-4">
                            <Progress value={(distribution[i] / total) * 100} className="h-2 flex-1" />
                            <div className="flex items-center gap-1 w-24">
                                <span className="flex text-yellow-500">
                                    {[...Array(stars)].map((_, j) => <Star key={j} className="fill-current w-3 h-3" />)}
                                </span>
                                <span className="text-xs text-slate-400 ml-auto">{Math.round((distribution[i] / total) * 100)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={review.reviewerAvatar || ""} />
                                    <AvatarFallback>{review.reviewerName?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold text-slate-900">{review.reviewerName || "Student"}</div>
                                    <div className="text-xs text-slate-500">{review.reviewerRole || "Student"}</div>
                                </div>
                            </div>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-slate-200"}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            "{review.comment}"
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                            <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">
                                <ThumbsUp className="w-3 h-3" />
                                <span>Helpful</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseReviews;
