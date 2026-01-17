import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Users, Clock, BookOpen } from 'lucide-react';

interface CourseCardProps {
    course: {
        id: string;
        title: string;
        description: string;
        thumbnail?: string;
        price: number;
        difficulty: string;
        duration?: string;
        category: string;
        instructor: {
            name: string;
            avatar?: string;
        };
        _count?: {
            enrollments: number;
            reviews: number;
        };
    };
    progress?: number;
    showProgress?: boolean;
}

const CourseCard = ({ course, progress, showProgress = false }: CourseCardProps) => {
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5001';
    const thumbnailUrl = course.thumbnail
        ? `${baseUrl}${course.thumbnail}`
        : 'https://via.placeholder.com/400x225?text=Course';

    const difficultyColors = {
        BEGINNER: 'bg-green-100 text-green-800 border-green-200',
        INTERMEDIATE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        ADVANCED: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
        <motion.div
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Link to={`/courses/${course.id}`}>
                <Card className="h-full overflow-hidden border-2 hover:border-primary hover:shadow-xl transition-all duration-300 w-full">
                    {/* Thumbnail */}
                    <div className="relative w-full aspect-video overflow-hidden bg-secondary">
                        <motion.img
                            src={thumbnailUrl}
                            alt={course.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        />
                        {/* Difficulty Badge */}
                        <div className="absolute top-3 right-3">
                            <Badge className={`${difficultyColors[course.difficulty as keyof typeof difficultyColors] || difficultyColors.BEGINNER} font-semibold dark:opacity-90`}>
                                {course.difficulty}
                            </Badge>
                        </div>
                        {/* Price Tag */}
                        <div className="absolute bottom-3 left-3">
                            <div className="bg-card/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-border">
                                <span className="text-lg font-bold text-primary">
                                    {course.price === 0 ? 'Free' : `$${course.price}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    <CardHeader className="pb-3">
                        {/* Category */}
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                {course.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-lg line-clamp-2 leading-tight hover:text-primary transition-colors text-foreground">
                            {course.title}
                        </h3>
                    </CardHeader>

                    <CardContent className="pb-3">
                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {course.description}
                        </p>

                        {/* Progress Bar (if enrolled) */}
                        {showProgress && progress !== undefined && (
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs font-medium text-muted-foreground">Progress</span>
                                    <span className="text-xs font-bold text-primary">{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {course.duration && (
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{course.duration}</span>
                                </div>
                            )}
                            {course._count && (
                                <div className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>{course._count.enrollments} students</span>
                                </div>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="pt-3 border-t">
                        {/* Instructor */}
                        <div className="flex items-center gap-2 w-full">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                {course.instructor.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{course.instructor.name}</p>
                                <p className="text-xs text-muted-foreground">Instructor</p>
                            </div>
                            {/* Rating (placeholder) */}
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold">4.8</span>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    );
};

export default CourseCard;
